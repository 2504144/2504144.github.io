// Pong Game
// Khoi Tran
// Feb 26th, 2025
//
// Extra for Experts:
// - I have uncorperated mouse weheel into my project by using it to change the speed of the ball(it may take a bit to change speed but it changes very quick)

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
let movementSpeed = 5;

function setup() {
  //Screen
  createCanvas(windowWidth, windowHeight);
  x = width/2;
  y = height/2;
  dx = random(0, 5);
  dy = random(0, 5);

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
    background('black');
    displayBall();
    moveBall();
    firstPlayer();
    secondPlayer();
    bounce();
  }
  else if (state === 'lose'){
    loser();
  }
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

//Control Page
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
  rect(width/2 - (width - 600)/2, height/2 - height/4, width - 600, height/3.25);

  //Text
  fill('black');
  textSize(30);
  textStyle('bold');
  text("Player 1: W Key and S Key                                                             Player 2: Up Arrow and Down Arrow                               Scroll your mouse for a suprise!!                           As you saw, this game of pong is out of 1 so tread carefully.",width/2 - (width - 650)/2, height/2 - height/4.5, width - 650, height/1.5);
  
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

  //First Player
  if (x > firstX - radius && x < firstX && y > firstY && y < firstY + rectHeight) {
    dx *= -1;
  }

  //Second Player
  if (x < secondX + radius + rectWidth && x > secondX && y > secondY && y < secondY + rectHeight) {
    dx *= -1;
  }
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

//Extra for Experts
function mouseWheel(){
  if (dx > 0 && dx < 30 && dy > 0 && dy < 30){
    dx += 5;
    dy += 5;
  }
}

//W and S Keys
function wSKeys(){

  //W Key
  if (keyIsDown(87) && firstY > 0) {
    secondY -= movementSpeed;
  }

  //S Key
  if (keyIsDown(83) && firstY < height - buttonHeight) {
    secondY += movementSpeed;
  }
}

//Up Down Arrows
function upDownArrows() {

  //Up Arrow
  if (keyIsDown(UP_ARROW) && secondY > 0) {
    firstY -= movementSpeed;
  }
  
  //Down Arrow
  if (keyIsDown(DOWN_ARROW) && secondY < height - buttonHeight) {
    firstY += movementSpeed;
  }
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