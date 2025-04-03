// Bouncing Ball Object Demo
// Khoi Tran
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  spawnBall();
}

function draw() {
  background(220);
  for (let ball of ballArray){
    displayBalls(ball);
    displayBalls(ball);
  }
}

function mousePressed(){
  spawnBall();
}

function spawnBall(){
  let someBall = {
    x: random(width),
    y: random(height),
    radius: random(15,40),
    dx: random(-5, 5),
    dy: random(-5, 5),
  };
  ballArray.push(someBall);
}

function moveBalls(){

  //move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  //teleport to edge of screen
  if (ball.x - ball.radius > width){
    ball.x = -ball.radius;
  }
  else if (ball.x + ball.radius < 0) {
    ball.x = width + ball.radius;
  }
  if (ball.y - ball.radius > height) {
    ball.y = -ball.radius;
  }
  else if (ball.y + ball.radius < 0) {
    ball.y = height + ball.radius;
  }
}

function displayBalls(){
//display ball
  fill("red");
  circle(ball.x, ball.y, ball.radius*2);
}