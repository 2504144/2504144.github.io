// Traffic Light Starter Code
// Khoi Tran
// Feb 27th, 2025

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/#/p5/millis
let state = 'green';
let lastSwitchedTime = 0;
const GREEN_LIGHT_DURATION = 3000;
const YELLOW_LIGHT_DURATION = 1000;
const RED_LIGHT_DURATION = 4000

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255);
  drawOutlineOfLights();
  changeStateIfNeeded();
  lightColors();
}

function lightColors(){
  if (state === 'red') {
    fill('red');
    ellipse(width/2, height/2 - 65, 50, 50); //top
}
  else if (state === 'yellow') {
    fill('yellow');
    ellipse(width/2, height/2, 50, 50); //middle
}
  else if (state === 'green') {
    fill('green');
    ellipse(width/2, height/2 + 65, 50, 50); //bottom
  }
}

function changeStateIfNeeded() {
  if (state === 'green' && millis() > lastSwitchedTime + GREEN_LIGHT_DURATION){
    state = 'yellow';
    lastSwitchedTime = millis();
  }
  else if (state === 'yellow' && millis() > lastSwitchedTime + YELLOW_LIGHT_DURATION){
    state = 'red';
    lastSwitchedTime = millis();
  }
  else if (state === 'red' && millis() > lastSwitchedTime + RED_LIGHT_DURATION){
    state = 'green';
    lastSwitchedTime = millis();
  }
}



function drawOutlineOfLights() {
  //box
  rectMode(CENTER);
  fill(0);
  rect(width/2, height/2, 75, 200, 10);

  //lights
  fill(255);
  ellipse(width/2, height/2 - 65, 50, 50); //top
  ellipse(width/2, height/2, 50, 50); //middle
  ellipse(width/2, height/2 + 65, 50, 50); //bottom
}