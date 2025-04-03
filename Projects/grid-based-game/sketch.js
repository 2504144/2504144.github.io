// Minesweeper
// Khoi Tran
// March 31st, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// USE THIS AS REFERENCE - https://www.youtube.com/watch?v=LFU5ZlrR21E

let state;
let bomb;
const CELL_SIZE = 75;
let grid;
let rows = 20;
let cols = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.floor(width/CELL_SIZE);
  rows = Math.floor(height/CELL_SIZE);
  grid = generateEmptyGrid(cols, rows);

  displayBomb();
}

function draw() {
  displayGrid();
}

function preload(){
  bomb = loadImage("cartoon-bomb.png");
  shovel = loadImage("silver-shovel.webp");
  flag = loadImage("flag.png");
}

function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) {
        fill("white");
      }
      else if (grid[y][x] === 1) {
        fill("black");
      }
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
    }
  }
}

function generateEmptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
}

function eachCell(x, y, w){
  
}

function displayBomb(){
  image(bomb, 0, 0);
}