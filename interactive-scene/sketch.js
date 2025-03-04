// Pong Game
// Khoi Tran
// Feb 26th, 2025
//
// Extra for Experts:
// - I have uncorperated mouse weheel into my project by using it to change the speed of the ball

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
  text("Khoi's Version of Pong (Out of 1)", width/2 - buttonWidth/2 * 1.5 + buttonWidth/2/2 - 192, height/10 + buttonHeight/2 + 17);

  // Play Text
  textSize(50);
  textStyle('bold');
  text('Play', width/2 - buttonWidth/4 + buttonWidth/2/2 - 50, height/3+buttonHeight/2 + 17);

  //Control Text
  textSize(50);
  textStyle('bold');
  text('Controls', width/2 - buttonWidth/4 + buttonWidth/2/2 - 100, height/2+buttonHeight/2 + 17);
}

//Control Page
function controlPage(){
  background('black')

  //Banner
  fill('lime');
  rect(width/2 - buttonWidth/2, height/10, buttonWidth, buttonHeight);

  fill('black');
  textSize(50);
  textStyle('bold');
  text("Game Controls", width/2 - buttonWidth/2 + buttonWidth/2/2 - 79, height/10 + buttonHeight/2 + 17);

  //Text Box
  fill('lime');
  rect(width/2 - (width - 600)/2, height/2 - height/4, width - 600, height/1.5);

}

//If Buttons Clicked
function mouseClicked(){
  if (mouseX > width/2 - buttonWidth/4 && mouseY > height/3){
    state = 'game';
  if (mouseX > width/2 - buttonWidth/(1.75*2) && mouseY > height/2){
    state = 'controls';
  }
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
    state = 'main';
  }
  
  if (y > height - radius || y < 0 + radius) {
    dy *= -1;
  }

  //First Player
  if (x > firstX - radius && y > firstY && y < firstY + rectHeight) {
    dx *= -1;
  }

  //Second Player
  if (x < secondX + radius + rectWidth && y > secondY && y < secondY + rectHeight) {
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