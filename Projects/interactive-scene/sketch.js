// Pong Game
// Khoi Tran
// Feb 26th, 2025
//
// Extra for Experts: (It's at the bottom of all code)
// - I have uncorperated mouse weheel into my project by using it to change the speed of the ball(it may take a bit to change speed but it changes very quick)
// - the ball gets a little faster every time a paddle hits it, so rallies get harder the longer they go

//button dimensions
let buttonWidth = 400;
let buttonHeight = 70;
//ball
let x;
let y;
let dx = 20;
let dy = 20;
let radius = 25;
//player
let rectWidth = 30;
let rectHeight = 100;
let firstX;
let firstY;
let secondX;
let secondY;
let state = 'main';
let movementSpeed = 7;

//speed up
let startSpeed;        //how fast the ball starts, to work out how much faster it is now
let speedUp = 1.08;    //every paddle hit makes the ball 8% faster
let maxSpeed = 25;     //fastest it can go so it cant skip through a paddle

//winning
let winner = '';       //who won the last game
let winTime = 0;       //when they won
let winScreenTime = 5000;  //how long the winner shows before going home by itself (milliseconds)

function setup() {
  //Screen
  createCanvas(windowWidth, windowHeight);
  resetGame();
}

//puts the ball and paddles back in the middle for a new game
function resetGame(){
  x = width/2;
  y = height/2;

  //starts at a playable speed, going left or right
  dx = random([-1, 1]) * random(4, 6);
  dy = random(-4, 4);
  startSpeed = abs(dx);

  //First player (right side, arrow keys)
  firstX = width - width/15 - rectWidth;
  firstY = height/2 - rectHeight/2;

  //Second Player (left side, W and S)
  secondX = width/15;
  secondY = height/2 - rectHeight/2;
}

function draw() {
  if (state === 'main') {
    mainPage();
  }
  else if (state === 'controls'){
    controlPage();
  }
  else if (state === 'game') {
    game();
  }
  else if (state === 'lose'){
    loser();
  }
}

function game(){
  background('black');
  displayBall();
  moveBall();
  firstPlayer();
  secondPlayer();
  bounce();
  showSpeed();
}
//Main Page
function mainPage(){
  background('lime');

  //Banner (rounded with a shadow)
  fill('black');
  shadowOn(0, 0, 0, 0.45);
  rect(width/2 - buttonWidth/2 * 2, height/10, buttonWidth * 2, buttonHeight, buttonHeight/2);

  //Play Button
  rect(width/2 - buttonWidth/4, height/3, buttonWidth/2, buttonHeight, buttonHeight/2);

  //Controls Button
  rect(width/2 - buttonWidth/(1.75*2), height/2, buttonWidth/1.75, buttonHeight, buttonHeight/2);
  shadowOff();

  //Banner Text
  fill('lime');
  textSize(50);
  textStyle('bold');
  textAlign(CENTER, CENTER);
  textSize(44);
  text("Khoi's Version of Pong (Out of 1)", width/2, height/10 + buttonHeight/2);
  textSize(50);

  // Play Text
  textSize(50);
  textStyle('bold');
  text('Play', width/2, height/3 + buttonHeight/2);

  //Control Text
  textSize(50);
  textStyle('bold');
  text('Controls', width/2, height/2 + buttonHeight/2);
  textAlign(LEFT, BASELINE);
}

//Controls Page
function controlPage(){
  background('black');

  //Banner
  fill('lime');
  shadowOn(0, 255, 0, 0.35);
  rect(width/2 - buttonWidth/2, height/10, buttonWidth, buttonHeight, buttonHeight/2);
  shadowOff();
  
  //Text
  fill('black');
  textSize(50);
  textStyle('bold');
  text("Game Controls", width/2 - buttonWidth/2 + buttonWidth/4 - 79, height/10 + buttonHeight/2 + 17);

  //Text Box
  fill('lime');
  shadowOn(0, 255, 0, 0.35);
  rect(width/2 - (width - 600)/2, height/2 - height/4, width - 600, height/2.75, 30);
  shadowOff();

  //Text
  fill('black');
  textSize(30);
  textStyle('bold');
  text("Player 1: W Key and S Key                                                             Player 2: Up Arrow and Down Arrow                               Scroll your mouse for a suprise!!(Might have to scroll a few times)                                                                     As you saw, this game of pong is out of 1 so tread carefully.",width/2 - (width - 650)/2, height/2 - height/4.5, width - 650, height/1.5);
  
  //Play Button on Control Screen
  fill('lime');
  shadowOn(0, 255, 0, 0.35);
  rect(width/2 - buttonWidth/4, height/1.5, buttonWidth/2, buttonHeight, buttonHeight/2);
  shadowOff();

  // Play Text on Control Screen
  fill('black');
  textSize(50);
  textStyle('bold');
  text('Play', width/2 - buttonWidth/4 + buttonWidth/4 - 50, height/1.5 + buttonHeight/2 + 17);
}

//If Buttons Clicked
function mouseClicked(){

  //PLay Button
  if (state === 'main' && inside(width/2 - buttonWidth/4, height/3, buttonWidth/2, buttonHeight)){
    resetGame();
    state = 'game';
  }

  //Control Button
  else if (state === 'main' && inside(width/2 - buttonWidth/(1.75*2), height/2, buttonWidth/1.75, buttonHeight)){
    state = 'controls';
  }

  //Play Button on Control Screen
  else if (state === 'controls' && inside(width/2 - buttonWidth/4, height/1.5, buttonWidth/2, buttonHeight)){
    resetGame();
    state = 'game';
  }

  //Play Again on the end screen - straight into a new game
  else if (state === 'lose' && inside(playAgainX(), endButtonY(), endButtonWidth(), buttonHeight)){
    resetGame();
    state = 'game';
  }

  //Home on the end screen
  else if (state === 'lose' && inside(homeX(), endButtonY(), endButtonWidth(), buttonHeight)){
    resetGame();
    state = 'main';
  }
}

//true if the mouse is inside a button
function inside(left, top, w, h){
  return mouseX > left && mouseX < left + w && mouseY > top && mouseY < top + h;
}

//Ball Movement
function moveBall() {
  x += dx;  
  y += dy;
}

//Bounce Mechanics
function bounce() {
  //ball got past the right paddle - Player 1 (W and S) wins
  if (x > width - radius) {
    someoneWins('Player 1');
  }

  //ball got past the left paddle - Player 2 (arrows) wins
  else if (x < 0 + radius) {
    someoneWins('Player 2');
  }
  
  if (y > height - radius || y < 0 + radius) {
    dy *= -1;
  }

  //First Player (right side) - any part of the ball touching any part of the paddle
  //only while the ball is heading towards it, so it cant bounce twice
  if (dx > 0 && touchingPaddle(firstX, firstY)) {
    dx = -abs(dx);
    speedUpBall();
  }

  //Second Player (left side)
  if (dx < 0 && touchingPaddle(secondX, secondY)) {
    dx = abs(dx);
    speedUpBall();
  }
}

//true if the ball is touching the whole paddle box (front, top, bottom and corners)
function touchingPaddle(paddleX, paddleY){

  //the spot on the paddle closest to the middle of the ball
  let closestX = constrain(x, paddleX, paddleX + rectWidth);
  let closestY = constrain(y, paddleY, paddleY + rectHeight);

  //touching if that spot is inside the ball
  return dist(x, y, closestX, closestY) < radius;
}

//makes the ball a little faster after each hit
function speedUpBall(){
  if (abs(dx) < maxSpeed){
    dx *= speedUp;
    dy *= speedUp;
  }

  //never faster than the max
  dx = constrain(dx, -maxSpeed, maxSpeed);
  dy = constrain(dy, -maxSpeed, maxSpeed);
}

//how fast the ball is going compared to the start
function showSpeed(){
  fill('lime');
  textSize(24);
  textStyle('bold');
  textAlign(CENTER, TOP);
  text('Speed x' + (abs(dx) / startSpeed).toFixed(1), width/2, 15);
  textAlign(LEFT, BASELINE);
}

//Ball
function displayBall() {
  fill('lime');
  circle(x, y, radius*2);
  noStroke();
}

//PLayer One
function firstPlayer() {
  shadowOn(0, 255, 0, 0.5);
  rect(firstX, firstY, rectWidth, rectHeight, rectWidth/2);
  shadowOff();
  wSKeys();
}

//Player Two
function secondPlayer() {
  shadowOn(0, 255, 0, 0.5);
  rect(secondX, secondY, rectWidth, rectHeight, rectWidth/2);
  shadowOff();
  upDownArrows();
}

//W and S Keys
function wSKeys(){

  //W Key
  if (keyIsDown(87) && secondY > 0) {
    secondY -= movementSpeed;
  }

  //S Key
  if (keyIsDown(83) && secondY < height - rectHeight) {
    secondY += movementSpeed;
  }

  //stay on the screen
  secondY = constrain(secondY, 0, height - rectHeight);
}

//Up Down Arrows
function upDownArrows() {

  //Up Arrow
  if (keyIsDown(UP_ARROW) && firstY > 0) {
    firstY -= movementSpeed;
  }
  
  //Down Arrow
  if (keyIsDown(DOWN_ARROW) && firstY < height - rectHeight) {
    firstY += movementSpeed;
  }

  //stay on the screen
  firstY = constrain(firstY, 0, height - rectHeight);
}

//end screen buttons sit side by side under the message
function endButtonWidth(){
  return buttonWidth/1.6;
}
function endButtonY(){
  return height/2 + buttonHeight * 2.4;
}
function playAgainX(){
  return width/2 - endButtonWidth() - 15;
}
function homeX(){
  return width/2 + 15;
}

//game over - remember who won and when
function someoneWins(player){
  winner = player;
  winTime = millis();
  state = 'lose';
}

function loser(){
  background('lime');

  //Text Box
  fill('black');
  shadowOn(0, 0, 0, 0.45);
  rect(width/2 - buttonWidth/1.7*1.5, height/2 - buttonHeight/2*2, buttonWidth * 1.7, buttonHeight * 3, 30);
  shadowOff();

  //Text
  fill('lime');
  textStyle('bold');
  text('WELL, WELL, WELL', width/2 - buttonWidth/1.7 * 1.5 + 100, height/2 - buttonHeight/3 + 10, buttonWidth * 3, buttonHeight * 2);
  text('Look who we have here.', width/2 - buttonWidth/1.95 * 1.6 + 30, height/2 - buttonHeight/15 + 50, buttonWidth * 3, buttonHeight * 2);

  //who won
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(60);
  text(winner + ' wins!', width/2, height/2 - buttonHeight * 2.3);

  //Play Again and Home buttons
  shadowOn(0, 0, 0, 0.45);
  fill('black');
  rect(playAgainX(), endButtonY(), endButtonWidth(), buttonHeight, buttonHeight/2);
  rect(homeX(), endButtonY(), endButtonWidth(), buttonHeight, buttonHeight/2);
  shadowOff();

  fill('lime');
  textSize(36);
  text('Play Again', playAgainX() + endButtonWidth()/2, endButtonY() + buttonHeight/2);
  text('Home', homeX() + endButtonWidth()/2, endButtonY() + buttonHeight/2);

  //count down back to the home screen if nobody presses a button
  let secondsLeft = ceil((winScreenTime - (millis() - winTime)) / 1000);
  fill('black');
  textSize(24);
  text('Back to the home screen in ' + max(secondsLeft, 1) + '...', width/2, endButtonY() + buttonHeight + 40);
  textAlign(LEFT, BASELINE);
  textSize(50);

  //time is up - back home with a fresh game ready
  if (millis() - winTime > winScreenTime){
    resetGame();
    state = 'main';
  }
}

//Extra for Experts
function mouseWheel(){
  if (dx > 0 && dx < 30 && dy > 0 && dy < 30){
    dx += 5;
    dy += 5;
  }
}

//turns on a soft shadow for whatever gets drawn next
//(r, g, b) is the shadow colour, a is how see through it is (0 to 1)
function shadowOn(r, g, b, a){
  drawingContext.shadowColor = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
  drawingContext.shadowBlur = 20;
  drawingContext.shadowOffsetX = 6;
  drawingContext.shadowOffsetY = 8;
}

//turns the shadow off so text doesnt get one
function shadowOff(){
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0)';
  drawingContext.shadowBlur = 0;
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
}
