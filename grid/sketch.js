// 2D Array grid demo
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// let grid = [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 1, 0, 0],];

// const CELL_SIZE = 100; - if you are just choozing a size

let cellSize;

const SQAURE_DIMENSIONS = 4;

let grid;

function setup() {
  createCanvas(windowWidth, windowHeight);

  //make largest square possible
  if (height > width){
    cellSize = width / SQAURE_DIMENSIONS;
  }
  else{
    cellSize = height / SQAURE_DIMENSIONS;
  }
  grid = generateRandomGrid(SQAURE_DIMENSIONS, SQAURE_DIMENSIONS);
}

function draw() {
  background(220);
  diplayGrid();
}

function keyPressed(){
  if (key === "r"){
    grid = generateRandomGrid(SQAURE_DIMENSIONS, SQAURE_DIMENSIONS);
  }
}

function diplayGrid(){
  for (let y = 0; y < SQAURE_DIMENSIONS; y++){
    for (let x = 0; x < SQAURE_DIMENSIONS; x++){
      if (grid [y][x] === 1){
        fill("black");
      }
      else if (grid[y][x] === 0){
        fill("white");
      }
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function generateGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++){
    newGrid.push([]);
    for (let x = 0; x < cols; x++){
      if (random(100 < 50)) {
        newGrid[y].push(0);
      }
      else{
        newGrid.push(1);
      }
    }
  }
  return newGrid;
}