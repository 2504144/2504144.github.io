// Fireworks OPP Demo
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Particle{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.radius = 2;
    this.r = 255;
    this.g = 0;
    this.b = 0;
    this.opacity = 255;
  }

  display(){
    noStroke();
    fill(this.r, this.g, this.b, this.opacity);
    circle(this.x, this.y, this.radius * 2);
  }

  update(){
    //move
    this.x += this.dx;
    this.y += this.dy;

    //fade away over time
    this.opacity --;
  }

  isDead(){
    return this.opacity <= 0;
  }
}

let fireworks = [];
const NUMBER_OF_FIREWORKS_PER_CLICK = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  for (let firework of fireworks){
    if (firework.isDead()){
      //get rid of it
      let index = fireworks.indexOf(firework);
      fireworks.splice(index, 1);
    }
    else{
      firework.update();
      firework.display();
    }
  }
}

function mousePressed(){
  for (let i = 0; i < NUMBER_OF_FIREWORKS_PER_CLICK; i ++){
    let someFirework = new Particle(mouseX, mouseY);
    fireworks.push(someFirework);
  }
}