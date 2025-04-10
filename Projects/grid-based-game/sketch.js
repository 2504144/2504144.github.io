// Minesweeper
// Khoi Tran
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// USE THIS AS REFERENCE - https://www.youtube.com/watch?v=LFU5ZlrR21E
//color codes - https://www.computerhope.com/htmcolor.htm\
//chroma keying - https://github.com/brianchirls/Seriously.js/wiki/Chroma-Key

//game state
let gameState = "main";

//button dimensions
let buttonWidth = 400;
let buttonHeight = 60;

//shovel and flag variables
let buttonX;
let buttonY;
let spaceInBetween;
let gridWidth;

//mode
let state = "shovel";

//grid variables
const CELL_SIZE = 120;
let grid;
let rows = 20;
let cols = 20;

//bomb variables
let numberOfBombs = 4;
let bombCount = numberOfBombs;

//first click isnt a bomb
let noBomb = true;

//winner vid
let playOnce = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.floor(width/CELL_SIZE/1.1);
  rows = Math.floor(height/CELL_SIZE/1.25);
  grid = generateEmptyGrid(cols, rows);

  //variables for buttons
  gridWidth = CELL_SIZE * cols;
  buttonX = gridWidth/2;
  buttonY = rows * CELL_SIZE + 25;
  spaceInBetween = CELL_SIZE * 2;

  //bomb video
  frameRate(30);

}

function draw() {
  if (gameState === "main") {
    mainPage();
  }

  else if (gameState === "controls"){
    controlPage();
  }

  else if (gameState === "game"){
    game();
  }

  else if (gameState === "win" && playOnce === false){
    winner();
    playOnce = true;
  }

  else if (gameState === "lose" || state === "bomb"){
    ending();
    playAgain();
  }

}

function preload(){
  //objects
  bomb = loadImage("cartoon-bomb.png");
  shovel = loadImage("silver-shovel.webp");
  flag = loadImage("flag.png");

  //explosion Gif
  explosion = loadImage("explosion-gif.gif"); //link - https://gifer.com/en/3IsK
  //explosion.hide(); - console said wasnt needed

  //winner video
  noice = createVideo("noice.mp4");
  noice.hide();
}

//Main Page
function mainPage(){
  background("grey");

  //Banner
  fill("black");
  rect(width/2 - buttonWidth/2, height/10, buttonWidth, buttonHeight);

  //Play Button
  rect(width/2 - buttonWidth/4, height/3, buttonWidth/2, buttonHeight);

  //Controls Button
  rect(width/2 - buttonWidth/(1.75 * 2), height/2, buttonWidth/1.75, buttonHeight);

  //Banner Text
  fill("white");
  textSize(50);
  textStyle("bold");
  textAlign(CENTER, CENTER);
  text("Minesweeper", width/2, height/10 + buttonHeight/2);

  // Play Text
  textSize(40);
  textStyle("bold");
  textAlign(CENTER,CENTER);
  text("Play", width/2, height/3 + buttonHeight/2);

  //Control Text
  textSize(40);
  textStyle("bold");
  textAlign(CENTER,CENTER);
  text("Controls", width/2, height/2 + buttonHeight/2);
}

//Controls Page
function controlPage(){
  background("black");

  //Banner
  fill("grey");
  rect(width/2 - buttonWidth/2, height/10, buttonWidth, buttonHeight);
  
  //Text
  fill("white");
  textSize(50);
  textStyle("bold");
  textAlign(CENTER, CENTER);
  text("Game Controls", width/2, height/10 + buttonHeight/2);

  //Text Box
  fill("grey");
  rect(width/2 - (width - 650)/2, height/2 - height/4, width - 650, height/2.75);

  //Text
  fill("white");
  textSize(30);
  textStyle("bold");
  text("- Use bottom Shovel to dig ground",width/2 - (width - 650)/2, height/2 - height/1.9, width - 650, height/1.5);
  text("- Use Flag to place ontop of bomb",width/2 - (width - 650)/2, height/2 - height/1.9 + 55, width - 650, height/1.5);
  text("- Find all the bombs",width/2 - (width - 650)/2, height/2 - height/1.9 + 55 * 2, width - 650, height/1.5);
  text("-Good luck!",width/2 - (width - 650)/2, height/2 - height/1.9 + 55 * 3, width - 650, height/1.5);

  //Play Button on Control Screen
  fill("grey");
  rect(width/2 - buttonWidth/4, height/1.45, buttonWidth/2 , buttonHeight);

  // Play Text on Control Screen
  fill("white");
  textSize(40);
  textStyle("bold");
  textAlign(CENTER, CENTER);
  text("Play", width/2, height/1.5 + buttonHeight/2 + 17);
}

//win page
function winner(){

  noice.show();
  image(noice, 0, 0, CELL_SIZE * cols, CELL_SIZE * rows);
  noice.play();

  playAgain();
}

//play again
function playAgain(){

  fill("black");
  rect(width/2 - buttonWidth/2, height/2 - buttonHeight/2, buttonWidth, buttonHeight);

  //text
  fill("white");
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Play Again", width/2, height/2); 
}

//game page
function game(){
  background("grey");
  fill("white");

  // changed origin so up against window
  translate(CELL_SIZE / 1.1, CELL_SIZE / 1.25);

  buttons();

  //display grid
  displayGrid();

  bombCounter(); 

  winCheck();
}

//field of play
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
        textAlign(CENTER, CENTER);
        textSize(20);
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
    fill("green");
    square(buttonX - spaceInBetween, buttonY, CELL_SIZE);
    image(shovel, buttonX - spaceInBetween, buttonY, CELL_SIZE, CELL_SIZE);

    fill("red");
    square(buttonX + spaceInBetween, buttonY, CELL_SIZE);
    image(flag, buttonX + spaceInBetween, buttonY, CELL_SIZE, CELL_SIZE);
  }

  //flag
  if (state === "flag"){
    fill("green");
    square(buttonX + spaceInBetween, buttonY, CELL_SIZE);
    image(flag, buttonX + spaceInBetween, buttonY, CELL_SIZE, CELL_SIZE);

    fill("red");
    square(buttonX - spaceInBetween, buttonY, CELL_SIZE);
    image(shovel, buttonX - spaceInBetween, buttonY, CELL_SIZE, CELL_SIZE);
  }
}

function mousePressed(){
  //PLay Button
  if (mouseX > width/2 - buttonWidth/4 && mouseX < width/2 + buttonWidth/4 && mouseY > height/3 && mouseY < height/3 + buttonHeight && gameState === "main"){
    gameState = "game";
  }
  
  //Control Button
  if (mouseX > width/2 - buttonWidth/(1.75*2) && mouseX < width/2 + buttonWidth/(1.75*2) && mouseY > height/2 && mouseY < height/2 + buttonHeight && gameState === "main"){
    gameState = "controls";
  }
  
  //Play Button on Control Screen
  if (mouseX > width/2 - buttonWidth/4 && mouseX < width/2 + buttonWidth/4 && mouseY > height/1.5 && mouseY < height/1.5 + buttonHeight && gameState === "controls"){
    gameState = "game";
  }

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

  //if clicked within
  if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows){

    //first click no bombs
    if (noBomb){
      bombsPlaced(numberOfBombs, cellX, cellY);
      amountOfNeighbors();
      noBomb = false;
    }

    if (state === "shovel" && !grid[cellY][cellX].flagged){
      grid[cellY][cellX].revealed = true;
    }
    //if bomb clicked
    if (state === "shovel" && grid[cellY][cellX].bomb){
      state = "bomb"; 
      gameState = "lose";

      //shows all bombs
      for (let y = 0; y < rows; y++){
        for (let x = 0; x < cols; x ++){
          if (grid[y][x].bomb){
            grid[y][x].revealed = true;
          }
        }
      }
    }

    else if (state === "flag" && !grid[cellY][cellX].revealed){
      grid[cellY][cellX].flagged = !grid[cellY][cellX].flagged;
      image(flag, cellY, cellX, CELL_SIZE, CELL_SIZE);
    }
  }

  //restart
  if ((gameState === "win" || gameState === "lose") && mouseX > width / 2 - buttonWidth / 2 && mouseX < width / 2 + buttonWidth / 2 && mouseY > height / 2 && mouseY < height / 1.5 + buttonHeight && gameState !== "game"){
    restart();
  }

}

function bombsPlaced(numberOfBombs, noBombX, noBombY){
  let placed = 0;
    
  while (placed < numberOfBombs){

    //random placement
    let x = floor(random(cols));
    let y = floor(random(rows));

    if (!grid[y][x].bomb && x !== noBombX && y !== noBombY){
      grid[y][x].bomb = true;
      placed++;
    }
  }
}

//numbers of bomb surrounding
function amountOfNeighbors(){
  let bombCount;

  for (let y = 0; y < rows; y++){
    for (let x = 0; x < cols; x ++){
      if (!grid[y][x].bomb){
        bombCount = 0;

        //check for a 3 by 3 square around
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
  textAlign(CENTER, CENTER);
  text("Bombs: " + bombCount, buttonX + CELL_SIZE/2, buttonY + CELL_SIZE/2);
}

//win check
function winCheck(){

  let flagsOnBomb = 0;

  for ( let y = 0; y < rows; y++){
    for (let x = 0; x < cols; x ++){
      if (grid[y][x].flagged && grid[y][x].bomb){

        //adds number
        flagsOnBomb++;
      }
    }
  }
  if (flagsOnBomb ===  numberOfBombs){
    gameState = "win";
  }
}

//plays video
function ending(){

  //frames for bomb
  let total = explosion.numFrames();
  let crurrentFrame = explosion.getCurrentFrame();

  //plays explosion once
  if (explosion.getCurrentFrame() < 20){
    image(explosion, 0, 0, CELL_SIZE * cols, CELL_SIZE * rows);
  }
}


//restart
function restart(){
  noice.hide();
  grid = generateEmptyGrid(cols, rows);
  bombCount = numberOfBombs;
  noBomb = true;
  playOnce = false;
  gameState = "game";
  state = "shovel";
  bombsPlaced(numberOfBombs, -1, -1);
  amountOfNeighbors();
  game();
}