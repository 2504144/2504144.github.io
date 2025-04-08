// Minesweeper
// Khoi Tran
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// USE THIS AS REFERENCE - https://www.youtube.com/watch?v=LFU5ZlrR21E
//color codes - https://www.computerhope.com/htmcolor.htm

let buttonX;
let buttonY;
let spaceInBetween;

//mode
let state = "shovel";

const CELL_SIZE = 75;
let grid;
let rows = 20;
let cols = 20;

let numberOfBombs = 5;
let bombCount = numberOfBombs;

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

  bombCounter();
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
        fill(139, 69, 19);//saddle brown
      }
      else{

        //hidden cells
        fill(52, 124, 44); //jungle green
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

      //shows bomb if clicked
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
  shiftedMouseX = mouseX - CELL_SIZE/1.1;
  shiftedMouseY = mouseY - CELL_SIZE/1.25;

  //with in tile
  cellX = floor(shiftedMouseX / CELL_SIZE);
  cellY = floor(shiftedMouseY / CELL_SIZE);

  //shovel state
  if (shiftedMouseX > buttonX - spaceInBetween && shiftedMouseX < buttonX - spaceInBetween + CELL_SIZE && shiftedMouseY > buttonY && shiftedMouseY < buttonY + CELL_SIZE){
    state = "shovel";
  }

  //flag state
  if (shiftedMouseX > buttonX + spaceInBetween && shiftedMouseX < buttonX + spaceInBetween + CELL_SIZE && shiftedMouseY > buttonY && shiftedMouseY < buttonY + CELL_SIZE){
    state = "flag";
  }

  //if clicked
  if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows){

    if (state === "shovel" && !grid[cellY][cellX].flagged){
      grid[cellY][cellX].revealed = true;
    }
    //if bomb clicked
    if (state === "shovel" && grid[cellY][cellX].bomb){
      state = "bomb"; 
    }

    else if (state === "flag" && !grid[cellY][cellX].revealed){
      grid[cellY][cellX].flagged = !grid[cellY][cellX].flagged;
      image(flag, cellY, cellX, CELL_SIZE, CELL_SIZE);
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
  let bombCount;

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

function bombCounter(){
  fill("white");
  textSize(35);
  textStyle("bold");
  textAlign(CENTER);
  text("Bombs: " + bombCount, buttonX + CELL_SIZE/2, buttonY + CELL_SIZE/2);
}