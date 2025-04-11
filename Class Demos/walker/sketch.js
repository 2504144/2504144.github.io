// Walker OPP demo
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Walker{
  constructor(x, y, color){
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 10;
    this.speed = this.radius * 2;

  }

  display(){
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.radius * 2);
  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      //up 
      this.y -= this.speed;
    }
    else if (choice < 50){
      //down
      this.y += this.speed;
    }
    else if (choice < 75){
      //left
      this.x -= this.speed;
    }
    else{
      this.x += this.speed;
    }
  }
}

// let luke;
// let khoi;
let theWalkers = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  //   luke = new Walker(width / 2, height/2, "red");
  //   khoi = new Walker(width/2, height/2, "blue");
  spawnWalker(width/2, height/2);  
}

function draw() {

  // luke.move();
  // khoi.move();
  // luke.display();
  // khoi.display();

  for (let myWalker of theWalkers){
    myWalker.move();
    myWalker.display();
  }
}

function mousePressed(){
  spawnWalker(mouseX, mouseY);
}

function spawnWalker(x, y){
  let r = random(255);
  let g = random(255);
  let b = random(255);
  
  let someColor = color(r, g, b);

  let someWalker = new Walker(x, y, someColor);
  theWalkers.push(someWalker);
}