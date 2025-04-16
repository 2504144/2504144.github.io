// Translate Rotate Demo
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CORNER);
}

function draw() {
  background("lightblue");

  push();//save transformatio matrix  
  translate(width/2, height/2);
  rotate(mouseX);
  fill("red");
  rect(0, 0, 200, 75);
  pop();

  fill("green");
  rect(200,height - 100, width*2, 200);

}
