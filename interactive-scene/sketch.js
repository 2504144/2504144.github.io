// Pong Game
// Khoi Tran
// Feb 26th, 2025
//
// Extra for Experts:
// - I have uncorperated mouse weheel into my project by using it to change the speed of the ball

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
  secondX = width - (width/15) - rectWidth;
  secondY = height/2 - rectHeight/2;
}

function draw() {
  background('black');
  displayBall();
  moveBall();
  bounce();
  firstPlayer();
  secondPlayer();
}

function moveBall() {
  //ball movement
  x += dx;  
  y += dy;
}

function bounce() {
  //bounce mechanics
  if (x > width - radius || x < 0 + radius) {
    dx *= -1;
  }
  
  if (y > height - radius || y < 0 + radius) {
    dy *= -1;
  }
}

function displayBall() {
  //ball
  fill('lime');
  circle(x, y, radius*2);
  noStroke();
}

function firstPlayer() {
  //player one
  rect(firstX, firstY, rectWidth, rectHeight);
}

function secondPlayer() {
  //player two
  rect(secondX,secondY, rectWidth, rectHeight);
}

//extra for experts
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
