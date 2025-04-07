// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// USE THIS AS REFERENCE - https://www.youtube.com/watch?v=LFU5ZlrR21E

let buttonX;
let buttonY;
let spaceInBetween;

//mode
let state = "shovel";

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

  //variables for buttons
  let gridWidth = CELL_SIZE * cols;
  buttonX = gridWidth/2;
  buttonY = rows * CELL_SIZE + 25;
  spaceInBetween = CELL_SIZE * 2;
}

function draw() {
  background("grey");
  fill("white");

  // changed origin so up against window
  translate(CELL_SIZE / 1.1, CELL_SIZE / 1.25);

  //display grid
  displayGrid();

  //bomb check
  bombsPlaced();

  buttons();
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
      newGrid[y].push({
        bomb: false,
        revealed: false,
        flagged: false,
        neighbors: 0,
      });

    }
  }
  return newGrid;
}

//buttons
function buttons(){

  //shovel
  if (state === "shovel"){
    fill('green');
    square(buttonX - spaceInBetween, buttonY, CELL_SIZE);
    image(shovel, buttonX - spaceInBetween, buttonY, CELL_SIZE, CELL_SIZE);

    fill('red');
    square(buttonX + spaceInBetween, buttonY, CELL_SIZE);
    image(flag, buttonX + spaceInBetween, buttonY, CELL_SIZE, CELL_SIZE);
  }

  //flag
  if (state === "flag"){
    fill('green');
    square(buttonX + spaceInBetween, buttonY, CELL_SIZE);
    image(flag, buttonX + spaceInBetween, buttonY, CELL_SIZE, CELL_SIZE);

    fill('red');
    square(buttonX - spaceInBetween, buttonY, CELL_SIZE);
    image(shovel, buttonX - spaceInBetween, buttonY, CELL_SIZE, CELL_SIZE);
  }
}

function mousePressed(){
  //updated mouse positioning due to translation
  mouseX = mouseX - CELL_SIZE / 1.1;
  mouseY = mouseY - CELL_SIZE / 1.25;

  //if clicked
  if (mouseX > buttonX - spaceInBetween && mouseX < buttonX - spaceInBetween + CELL_SIZE && mouseY > buttonY && mouseY < buttonY + CELL_SIZE){
    state = "shovel";
  }

  else if (mouseX > buttonX + spaceInBetween && mouseX < buttonX + spaceInBetween + CELL_SIZE && mouseY > buttonY && mouseY < buttonY + CELL_SIZE){
    state = "flag";
  }
}

function bombsPlaced(numberOfBombs){
  placed = 0;
  while (placed < numberOfBombs){
    x = floor(random(cols));
    y = floor(random(rows));
    if (!grid[y][x].bomb){
      grid[y][x].bomb = true;
      placed++;
      image(bomb, x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

function amountOfNeighbors(){
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      
    }
  }
}