// Pong Game
// Khoi Tran
// Feb 26th, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//ball
let x;
let y;
let dx = 2;
let dy = 2;
let radius = 25;
//first player

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = width/2;
  y = height/2;
  dx = random(-5, 5);
  dy = random(-5, 5);
}

function draw() {
  background('light black');
  displayBall();
  moveBall();
  bounce();
  //upDownArrows();
}

function moveBall() {
  x += dx;  
  y += dy;
}

function bounce() {

  if (x > width - radius || x < 0 + radius) {
    dx *= -1;
  }
  
  if (y > height - radius || y < 0 + radius) {
    dy *= -1;
  }
}

function displayBall() {
  fill('lime');
  circle(x, y, radius*2);
  noStroke();
}
function firstPlayer() {
  fill('light blue');
  rect(rectX, rectY, 20, 20);
}

// function upDownArrows() {
//   if (keyIsDown(UP_ARROW)) {
//     y -= dy;
//   }
//   if (keyIsDown(DOWN_ARROW)) {
//     y += dy;
//   }
// }
