// Perlin Noise Demo
// Moving a Circle
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let timeX = 0;
let timeY = 1000;
let deltaTime = 0.01;
let x;
let y;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  fill("black");
  x = noise(timeX) * width;
  y = noise(timeY) * height;
  circle(x, y, 50);

  timeX += deltaTime;
  timeY += deltaTime;
}
