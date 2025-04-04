// Project Title
// Your Name
// Date
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
  cols = Math.floor(width/CELL_SIZE/1.1);
  rows = Math.floor(height/CELL_SIZE/1.25);
  grid = generateEmptyGrid(cols, rows);
}

function draw() {
  background("grey");

  // changed origin so up against window
  translate(CELL_SIZE / 1.1, CELL_SIZE / 1.25);

  //display grid
  displayGrid();

  //bomb check
  displayBomb();

  //diffferent states
  displayFlagButton();
  displayShovelButton();
}

function preload(){
  bomb = loadImage("cartoon-bomb.png");
  shovel = loadImage("silver-shovel.webp");
  flag = loadImage("flag.png");
}

//displaying add bombs
function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
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

function displayBomb(){
  bomb = {
    x: random(rows),
    y: random(cols),
  };
  image(bomb, bomb.x, bomb.y, CELL_SIZE, CELL_SIZE);
}

function displayShovelButton(){
  image(shovel, 0, 0, CELL_SIZE, CELL_SIZE);
}

function displayFlagButton(){
  let flag = {
    x = width/2 - CELL_SIZE + CELL_SIZE/2,
    y = height+ height/8 - CELL_SIZE + CELL_SIZE/2,
    width,
    height,
  };
  image(flag, 0, 0, CELL_SIZE, CELL_SIZE);
}