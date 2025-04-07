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

let numberOfBombs = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.floor(width/CELL_SIZE/1.1);
  rows = Math.floor(height/CELL_SIZE/1.25);
  grid = generateEmptyGrid(cols, rows);

  //bombs
  bombsPlaced(numberOfBombs);
  amountOfNeighbors();

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

  buttons();
}

function preload(){
  bomb = loadImage("cartoon-bomb.png");
  shovel = loadImage("silver-shovel.webp");
  flag = loadImage("flag.png");
}

//displaying add bombs
function displayGrid() {
  let cellX;
  let cellY;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);

      //made for different origin
      cellX = x * CELL_SIZE;
      cellY = y * CELL_SIZE;

      if (grid[y][x].revealed){

        //revealed cells
        fill("green");
      }
      else{

        //hidden cells
        fill("grey");
      }
      square(cellX, cellY, CELL_SIZE);

      //show numbers if bomb not clicked
      if (grid[y][x].revealed && grid[y][x].neighbors > 0 && !grid[y][x].bomb){
        fill("white");
        textSize(20);
        textAlign(CENTER);
        text(grid[y][x].neighbors, cellX + CELL_SIZE/2,cellY + CELL_SIZE/2);
      }

      //placing flag
      if (!grid[y][x].revealed && grid[y][x].flagged){
        image(flag, cellX, cellY, CELL_SIZE, CELL_SIZE);
      }

      //if bomb clicked
      if (grid[y][x].revealed && grid[y][x].bomb){
        image(bomb, cellX, cellY, CELL_SIZE, CELL_SIZE);
      }
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
  mouseX = mouseX - CELL_SIZE/1.1;
  mouseY = mouseY - CELL_SIZE/1.25;

  //find tile
  cellX = floor(mouseX / CELL_SIZE);
  cellY = floor(mouseY / CELL_SIZE);

  //if clicked
  if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows){

    if (state === "shovel" && !grid[cellY][cellX].flagged){
      grid[cellY][cellX].revealed = true;
    }

    else if (state === "flag" && !grid[cellY][cellX].revealed){
      grid[cellY][cellX].flagged = !grid[cellY][cellX];
    }
  }
}

function bombsPlaced(numberOfBombs){
  placed = 0;
    
  while (placed < numberOfBombs){

    //random placement
    let x = floor(random(cols));
    let y = floor(random(rows));
    grid[y][x];

    if (!grid[y][x].bomb){
      grid[y][x].bomb = true;
      placed++;
    }
  }
}

function amountOfNeighbors(){
  let count;

  for (let y = 0; y < rows; y++){
    for (let x = 0; x < cols; x ++){
      if (!grid[y][x].bomb){
        bombCount = 0;

        //check for a 3 by 3 squar around
        for (let neighborY = -1; neighborY <= 1; neighborY++){
          for (let neighborX = -1; neighborX <= 1; neighborX++){
            newNeighborY = y + neighborY;
            newNeighborX = x + neighborX;

            //doesnt count current cell and out of bounds
            if (newNeighborY >= 0 && newNeighborY < rows && newNeighborX >= 0 && newNeighborX < cols ){
              if (grid[newNeighborY][newNeighborX].bomb){
                bombCount++;
              }
            }
          }
        }
      }

      //update neighbors
      grid[y][x].neighbors = bombCount;
    }
  }
}