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

function setup() {
  //Screen
  createCanvas(windowWidth, windowHeight);
  x = width/2;
  y = height/2;

  //starts at a playable speed, going left or right
  dx = random([-1, 1]) * random(4, 6);
  dy = random(-4, 4);
  startSpeed = abs(dx);

  //First player
  firstX = width - width/15 - rectWidth;
  firstY = height/2 - rectHeight/2;

  //Second Player
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

  //Banner
  fill('black');
  rect(width/2 - buttonWidth/2 * 2, height/10, buttonWidth * 2, buttonHeight);

  //Play Button
  rect(width/2 - buttonWidth/4, height/3, buttonWidth/2, buttonHeight);

  //Controls Button
  rect(width/2 - buttonWidth/(1.75*2), height/2, buttonWidth/1.75, buttonHeight);

  //Banner Text
  fill('lime');
  textSize(50);
  textStyle('bold');
  text("Khoi's Version of Pong (Out of 1)", width/2 - buttonWidth/2 * 1.5 + buttonWidth/4 - 192, height/10 + buttonHeight/2 + 17);

  // Play Text
  textSize(50);
  textStyle('bold');
  text('Play', width/2 - buttonWidth/4 + buttonWidth/4 - 50, height/3+buttonHeight/2 + 17);

  //Control Text
  textSize(50);
  textStyle('bold');
  text('Controls', width/2 - buttonWidth/4 + buttonWidth/4 - 100, height/2+buttonHeight/2 + 17);
}

//Controls Page
function controlPage(){
  background('black');

  //Banner
  fill('lime');
  rect(width/2 - buttonWidth/2, height/10, buttonWidth, buttonHeight);
  
  //Text
  fill('black');
  textSize(50);
  textStyle('bold');
  text("Game Controls", width/2 - buttonWidth/2 + buttonWidth/4 - 79, height/10 + buttonHeight/2 + 17);

  //Text Box
  fill('lime');
  rect(width/2 - (width - 600)/2, height/2 - height/4, width - 600, height/2.75);

  //Text
  fill('black');
  textSize(30);
  textStyle('bold');
  text("Player 1: W Key and S Key                                                             Player 2: Up Arrow and Down Arrow                               Scroll your mouse for a suprise!!(Might have to scroll a few times)                                                                     As you saw, this game of pong is out of 1 so tread carefully.",width/2 - (width - 650)/2, height/2 - height/4.5, width - 650, height/1.5);
  
  //Play Button on Control Screen
  fill('lime');
  rect(width/2 - buttonWidth/4, height/1.5, buttonWidth/2, buttonHeight);

  // Play Text on Control Screen
  fill('black');
  textSize(50);
  textStyle('bold');
  text('Play', width/2 - buttonWidth/4 + buttonWidth/4 - 50, height/1.5 + buttonHeight/2 + 17);
}

//If Buttons Clicked
function mouseClicked(){

  //PLay Button
  if (mouseX > width/2 - buttonWidth/4 && mouseY > height/3 && state === 'main'){
    state = 'game';
  }

  //Control Button
  if (mouseX > width/2 - buttonWidth/(1.75*2) && mouseY > height/2){
    state = 'controls';
  }
  //Play Button on Control Screen
  if (mouseX > width/2 - buttonWidth/4 && mouseY > height/1.5 && state === 'controls'){
    state = 'game';
  }
}

//Ball Movement
function moveBall() {
  x += dx;  
  y += dy;
}

//Bounce Mechanics
function bounce() {
  if (x > width - radius || x < 0 + radius) {
    state = 'lose';
  }
  
  if (y > height - radius || y < 0 + radius) {
    dy *= -1;
  }

  //First Player (right side) - always send it back left
  if (x > firstX - radius && x < firstX && y > firstY && y < firstY + rectHeight) {
    dx = -abs(dx);

    //move the ball out of the paddle so it doesnt get stuck inside
    x = firstX - radius;
    speedUpBall();
  }

  //Second Player (left side) - always send it back right
  if (x < secondX + radius + rectWidth && x > secondX && y > secondY && y < secondY + rectHeight) {
    dx = abs(dx);
    x = secondX + rectWidth + radius;
    speedUpBall();
  }
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
  rect(firstX, firstY, rectWidth, rectHeight);
  wSKeys();
}

//Player Two
function secondPlayer() {
  rect(secondX,secondY, rectWidth, rectHeight);
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

function loser(){
  background('lime');

  //Text Box
  fill('black');
  rect(width/2 - buttonWidth/1.7*1.5, height/2 - buttonHeight/2*2, buttonWidth * 1.7, buttonHeight * 3);

  //Text
  fill('lime');
  textStyle('bold');
  text('WELL, WELL, WELL', width/2 - buttonWidth/1.7 * 1.5 + 100, height/2 - buttonHeight/3 + 10, buttonWidth * 3, buttonHeight * 2);
  text('Look who we have here.', width/2 - buttonWidth/1.95 * 1.6 + 30, height/2 - buttonHeight/15 + 50, buttonWidth * 3, buttonHeight * 2);
}

//Extra for Experts
function mouseWheel(){
  if (dx > 0 && dx < 30 && dy > 0 && dy < 30){
    dx += 5;
    dy += 5;
  }
}