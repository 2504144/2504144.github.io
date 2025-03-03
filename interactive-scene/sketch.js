// Pong Game
// Khoi Tran
// Feb 26th, 2025
//
// Extra for Experts:
// - I have uncorperated mouse weheel into my project by using it to change the speed of the ball

//buttons
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

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = width/2;
  y = height/2;
  dx = random(-5, 5);
  dy = random(-5, 5);

  //first player
  firstX = width/15;
  firstY = height/2 - rectHeight/2;

  //second player
  secondX = width - width/15 - rectWidth;
  secondY = height/2 - rectHeight/2;
}

function draw() {
  if (state === 'main') {
    mainPage();
  }
  else if (state === 'game') {
    background('black');
    displayBall();
    moveBall();
    bounce();
    firstPlayer();
    secondPlayer();
  }
}

function mainPage(){
  background('lime');

  //Banner
  fill('black');
  rect(width/2 - buttonWidth/2 * 1.5, height/10, buttonWidth * 1.5, buttonHeight);

  //Play Button
  rect(width/2 - buttonWidth/4, height/3, buttonWidth/2, buttonHeight);

  //Controls Button
  rect(width/2 - buttonWidth/(1.75*2), height/2, buttonWidth/1.75, buttonHeight);

  //Banner Text
  fill('lime');
  textSize(50);
  textStyle('bold');
  text("Khoi's Version of Pong", width/2 - buttonWidth/2 * 1.5 + buttonWidth/2/2 - 70, height/10 + buttonHeight/2 + 17);

  // Play Text
  textSize(50);
  textStyle('bold');
  text('Play', width/2 - buttonWidth/4 + buttonWidth/2/2 - 50, height/3+buttonHeight/2 + 17);

  //Control Text
  textSize(50);
  textStyle('bold');
  text('Controls', width/2 - buttonWidth/4 + buttonWidth/2/2 - 100, height/2+buttonHeight/2 + 17);
}

function moveBall() {
  //Ball Movement
  x += dx;  
  y += dy;
}

function bounce() {
  //Bounce Mechanics
  if (x > width - radius || x < 0 + radius) {
    dx *= -1;
  }
  
  if (y > height - radius || y < 0 + radius) {
    dy *= -1;
  }
}

function displayBall() {
  //Ball
  fill('lime');
  circle(x, y, radius*2);
  noStroke();
}

function firstPlayer() {
  //Player One
  rect(firstX, firstY, rectWidth, rectHeight);
}

function secondPlayer() {
  //Player Two
  rect(secondX,secondY, rectWidth, rectHeight);
}

//Extra for Experts
function mouseWheel(){
  if (dx > 0 && dx < 30 && dy > 0 && dy < 30){
    dx += 4;
    dy += 4;
  }
}
// function upDownArrows() {
//   if (keyIsDown(UP_ARROW)) {
//     y -= dy;
//   }
//   if (keyIsDown(DOWN_ARROW)) {
//     y += dy;
//   }
// }
