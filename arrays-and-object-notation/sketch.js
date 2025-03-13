// Maze
// Khoi Tran
// March 10th, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let columns, rows;
let w = 40;
let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  columns = floor(width/w);
  rows = floor(height/w);

  for (let j = 0; j < rows; j++){
    for (let i = 0; i < columns; i++){
      let cell = new box(i,j);
    }
  }
}

function draw() {
  background(220); 
  for (let i = 0; i , boxes.length; i++){
    boxes[i].show;
  }
}

function box(i, j){
  current.i = i;
  current.j = j;
}

current.show= function() {
  let x = current.i * w;
  let y = current.j * w;
  square(x,y,w);
};



//recursive back tracking- use this
//use this link- https://www.youtube.com/watch?v=HyK_Q5rrcr4