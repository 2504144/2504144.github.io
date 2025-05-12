// 2d collide library demo

let hit = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  collideDebug(true);
}

function draw() {
  background(255);
  line(300, 300, 150, 150);
  circle(mouseX, mouseY, 50);

  hit = collideLineCircle(300, 300, 150, 150, mouseX, mouseY, 50);

  if (hit){
    stroke("red");
  }
  else{
    stroke("black");
  }

  //stroke(hit ? color('red') : 0);
  //print('colliding?', hit);
}