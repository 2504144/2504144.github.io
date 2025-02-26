// Pong Game
// Khoi Tran
// Feb 26th, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let rectX;
let rectY;
let dy = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background('grey');
  upDownArrows()
  displayBall()
}

function displayBall() {
  circle(x, y, 50);
}
function upDownArrows(){
  if keyIsDown(UP_ARROW){
    y -= dy;
  }
  if keyIsDown(DOWN_ARROW){
    y += dy;
  }
}
