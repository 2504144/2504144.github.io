// Minesweeper
// Khoi Tran
// 2025
//
// Extra for Experts:
// - I learnt how to use (createVideo) for my winning screen and also learnt about (numFrames) inorder to play the explosion once
// - you can pick how big the grid is and how many bombs there are
// - empty squares open up all the squares around them (flood fill)
//
// How to play:
// - pick a grid size and number of bombs on the main menu (or use Easy / Medium / Hard)
// - Shovel digs a square, Flag marks where you think a bomb is
// - win by flagging every bomb, or by digging every square that isnt a bomb

// reference for mine sweeper logic - https://www.youtube.com/watch?v=LFU5ZlrR21E
//color codes - https://www.computerhope.com/htmcolor.htm
//explosion gif - https://gifer.com/en/3IsK


//screens - "main", "controls", "game", "exploding", "lose", "win"
let gameState = "main";

//tool you are using - "shovel" or "flag"
let state = "shovel";

//settings you can change on the main menu
let cols = 9;
let rows = 9;
let numberOfBombs = 10;

//limits for the settings
let minSize = 5;
let maxCols = 30;
let maxRows = 20;

//presets - name, columns, rows, bombs
let presets = [
  { name: "Easy", cols: 9, rows: 9, bombs: 10 },
  { name: "Medium", cols: 16, rows: 16, bombs: 40 },
  { name: "Hard", cols: 30, rows: 16, bombs: 99 },
];

//grid
let grid;

//first click isnt a bomb
let noBomb = true;

//grid size and position on screen (worked out in layoutGrid so it always fits)
let cellSize;
let gridX;
let gridY;

//shovel and flag buttons under the grid
let toolSize = 70;
let toolY;

//menu button size
let buttonWidth = 400;
let buttonHeight = 60;

//every button on screen right now - redrawn each frame so clicks match what you see
let clickables = [];

//images and video
let bomb;
let shovel;
let flag;
let explosion;
let noice;

//explosion - which frame it was on last time (to know when it finishes)
let lastExplosionFrame = 0;

//winner video only starts once
let playOnce = false;


function preload(){
  //objects
  bomb = loadImage("cartoon-bomb.png");
  shovel = loadImage("silver-shovel.webp");
  flag = loadImage("flag.png");

  //explosion Gif
  explosion = loadImage("explosion-gif.gif");

  //winner video - hidden, it gets drawn onto the canvas instead
  noice = createVideo("noice.mp4");
  noice.hide();

  //when the video finishes, go back to the starting screen
  noice.onended(backToMenu);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  textFont("Arial");

  //empty grid so the screen has something before the first game
  grid = generateEmptyGrid(cols, rows);
  layoutGrid();
}

function draw() {

  //buttons get added again by whatever screen is drawn
  clickables = [];

  if (gameState === "main"){
    mainPage();
  }
  else if (gameState === "controls"){
    controlPage();
  }
  else if (gameState === "game"){
    game();
  }
  else if (gameState === "exploding"){
    game();
    explode();
  }
  else if (gameState === "lose"){
    game();
    playAgain("Boom! You hit a bomb");
  }
  else if (gameState === "win"){
    winner();
  }
}

//window resizing
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  layoutGrid();
}


// ---------- buttons ----------

//draws a button and remembers where it is so it can be clicked
function button(label, x, y, w, h, action, colour){
  fill(colour || "black");
  stroke("white");
  strokeWeight(2);
  rect(x, y, w, h, 12);

  //text
  noStroke();
  fill("white");
  textStyle("bold");
  textAlign(CENTER, CENTER);
  textSize(min(h * 0.55, 40));
  text(label, x + w / 2, y + h / 2);

  clickables.push({ label: label, x: x, y: y, w: w, h: h, action: action });
}

//true if the mouse is inside a box
function inside(x, y, w, h){
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}


// ---------- screens ----------

//main screen - play, controls and the settings
function mainPage(){
  background("grey");

  //everything stacks down the middle, spacing shrinks on small windows
  let middle = width / 2;
  let step = min(78, (height - 40) / 10);
  let y = step * 0.4;
  let h = step * 0.8;

  //banner
  fill("black");
  rect(middle - buttonWidth / 2, y, buttonWidth, h, 12);
  fill("white");
  textStyle("bold");
  textAlign(CENTER, CENTER);
  textSize(min(h * 0.75, 50));
  text("Minesweeper", middle, y + h / 2);

  //play and controls
  y += step * 1.3;
  button("Play", middle - buttonWidth / 4, y, buttonWidth / 2, h, newGame);
  y += step;
  button("Controls", middle - buttonWidth / 3.5, y, buttonWidth / 1.75, h, function(){
    gameState = "controls";
  });

  //settings title
  y += step * 1.4;
  fill("white");
  textSize(min(h * 0.55, 32));
  text("Settings", middle, y + h / 3);

  //columns, rows and bombs - each with a - and + button
  y += step * 0.8;
  stepper("Columns", cols, y, h, function(change){
    cols = constrain(cols + change, minSize, maxCols);
    fixBombs();
  });
  y += step;
  stepper("Rows", rows, y, h, function(change){
    rows = constrain(rows + change, minSize, maxRows);
    fixBombs();
  });
  y += step;
  stepper("Bombs", numberOfBombs, y, h, function(change){
    numberOfBombs = numberOfBombs + change;
    fixBombs();
  });

  //quick presets
  y += step * 1.15;
  let presetWidth = 120;
  let gap = 16;
  let startX = middle - (presets.length * presetWidth + (presets.length - 1) * gap) / 2;

  for (let i = 0; i < presets.length; i++){
    let p = presets[i];

    //the preset you're on is green
    let picked = cols === p.cols && rows === p.rows && numberOfBombs === p.bombs;

    button(p.name, startX + i * (presetWidth + gap), y, presetWidth, h * 0.85, function(){
      cols = p.cols;
      rows = p.rows;
      numberOfBombs = p.bombs;
    }, picked ? color(52, 124, 44) : "black");
  }
}

//one settings row:  Columns  [-]  9  [+]
function stepper(label, value, y, h, change){
  let middle = width / 2;
  let small = h;

  //label
  fill("white");
  textStyle("bold");
  textAlign(RIGHT, CENTER);
  textSize(min(h * 0.5, 28));
  text(label, middle - 70, y + h / 2);

  //- and + buttons
  button("-", middle - 50, y, small, h, function(){
    change(-1);
  });
  button("+", middle + 110, y, small, h, function(){
    change(1);
  });

  //the number, half way between the - and + buttons
  let minusRight = middle - 50 + small;
  let plusLeft = middle + 110;
  fill("white");
  textAlign(CENTER, CENTER);
  textSize(min(h * 0.6, 34));
  text(value, (minusRight + plusLeft) / 2, y + h / 2);
}

//keeps the number of bombs possible
//at least 1, and always leaves room for the safe 3 by 3 first click
function fixBombs(){
  let most = cols * rows - 9;
  numberOfBombs = constrain(numberOfBombs, 1, most);
}

//controls screen
function controlPage(){
  background("black");

  let boxWidth = min(width - 60, 760);
  let boxX = width / 2 - boxWidth / 2;

  //banner
  fill("grey");
  rect(width / 2 - buttonWidth / 2, height / 10, buttonWidth, buttonHeight, 12);
  fill("white");
  textSize(46);
  textStyle("bold");
  textAlign(CENTER, CENTER);
  text("Game Controls", width / 2, height / 10 + buttonHeight / 2);

  //text box
  let lines = [
    "- Use the Shovel to dig a square",
    "- Numbers show how many bombs are touching that square",
    "- Use the Flag to mark a bomb (click again to remove it)",
    "- Flag every bomb, or dig every safe square, to win",
    "- Change the grid size and bombs on the main menu",
    "- Good luck!",
  ];
  let boxY = height / 10 + buttonHeight + 30;
  let lineHeight = 44;

  fill("grey");
  rect(boxX, boxY, boxWidth, lines.length * lineHeight + 30, 12);

  fill("white");
  textSize(min(24, boxWidth / 28));
  textAlign(LEFT, CENTER);
  for (let i = 0; i < lines.length; i++){
    text(lines[i], boxX + 24, boxY + 15 + lineHeight / 2 + i * lineHeight);
  }

  //play and back buttons
  let y = boxY + lines.length * lineHeight + 60;
  button("Play", width / 2 + 10, y, buttonWidth / 2.2, buttonHeight, newGame, "grey");
  button("Back", width / 2 - 10 - buttonWidth / 2.2, y, buttonWidth / 2.2, buttonHeight, function(){
    gameState = "main";
  }, "grey");
}

//game page
function game(){
  background("grey");

  //shovel and flag
  tools();

  //display grid
  displayGrid();

  //visual representation for amount of bombs left
  bombCounter();
}

//plays the explosion once, then shows the lose screen
function explode(){
  image(explosion, gridX, gridY, cellSize * cols, cellSize * rows);

  //gif went back to the start, so it finished
  let current = explosion.getCurrentFrame();
  if (current < lastExplosionFrame || current >= explosion.numFrames() - 1){
    gameState = "lose";
  }
  lastExplosionFrame = current;
}

//win page - plays the video over the whole screen
function winner(){
  background("black");

  //start the video only once
  if (!playOnce){
    noice.time(0);
    noice.play();
    playOnce = true;
  }

  //the video file has black bars on the top and bottom
  //so only use the middle part (the actual picture), 480 x 270 out of 480 x 360
  let picX = 0;
  let picY = 45;
  let picWidth = 480;
  let picHeight = 270;

  //make the picture as big as it can go while filling the whole screen
  let scale = max(width / picWidth, height / picHeight);
  let w = picWidth * scale;
  let h = picHeight * scale;
  image(noice, (width - w) / 2, (height - h) / 2, w, h, picX, picY, picWidth, picHeight);

  //message along the top
  noStroke();
  fill(0, 0, 0, 160);
  rect(0, 0, width, 70);
  fill("white");
  textStyle("bold");
  textAlign(CENTER, CENTER);
  textSize(36);
  text("You found every bomb!", width / 2, 35);

  //click anywhere to skip
  clickables.push({ label: "skip", x: 0, y: 0, w: width, h: height, action: backToMenu });
}

//stops the video and goes back to the starting screen
function backToMenu(){
  stopVideo();
  gameState = "main";
}

//play again and menu buttons on top of the game
function playAgain(message){

  //dark box behind the buttons so they stand out
  let boxWidth = min(width - 40, 460);
  let boxX = width / 2 - boxWidth / 2;
  let boxY = height / 2 - 110;
  fill(0, 0, 0, 200);
  rect(boxX, boxY, boxWidth, 220, 16);

  //message
  fill("white");
  textStyle("bold");
  textAlign(CENTER, CENTER);
  textSize(min(34, boxWidth / 13));
  text(message, width / 2, boxY + 45);

  button("Play Again", boxX + 30, boxY + 90, boxWidth - 60, buttonHeight, newGame, color(52, 124, 44));
  button("Menu", boxX + 30, boxY + 90 + buttonHeight + 10, boxWidth - 60, buttonHeight * 0.7, backToMenu, "black");
}


// ---------- grid ----------

//starts a fresh game with the current settings
function newGame(){
  stopVideo();
  fixBombs();
  grid = generateEmptyGrid(cols, rows);
  layoutGrid();

  noBomb = true;
  playOnce = false;
  state = "shovel";
  gameState = "game";
}

//stops the winning video
function stopVideo(){
  noice.stop();
}

//works out how big each square is so the whole grid fits on screen
function layoutGrid(){
  let roomWidth = width - 40;
  let roomHeight = height - 40 - toolSize - 30;

  cellSize = floor(min(roomWidth / cols, roomHeight / rows));

  //center the grid
  gridX = (width - cellSize * cols) / 2;
  gridY = 20;

  //tools sit under the grid
  toolY = gridY + cellSize * rows + 20;
}

//2D array
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

//field of play
function displayGrid() {
  stroke("black");
  strokeWeight(1);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = grid[y][x];
      let cellX = gridX + x * cellSize;
      let cellY = gridY + y * cellSize;

      if (cell.revealed){
        //revealed cells
        fill(139, 69, 19);//saddle brown
      }
      else {
        //hidden cells
        fill(52, 124, 44); //jungle green
      }
      square(cellX, cellY, cellSize);

      //show numbers if bomb not clicked
      if (cell.revealed && cell.neighbors > 0 && !cell.bomb){
        noStroke();
        fill("white");
        textStyle("bold");
        textAlign(CENTER, CENTER);
        textSize(cellSize * 0.55);
        text(cell.neighbors, cellX + cellSize / 2, cellY + cellSize / 2);
        stroke("black");
      }

      //placing flag
      if (!cell.revealed && cell.flagged){
        image(flag, cellX, cellY, cellSize, cellSize);
      }

      //shows bomb if clicked
      if (cell.revealed && cell.bomb){
        image(bomb, cellX, cellY, cellSize, cellSize);
      }
    }
  }
}

//shovel and flag buttons - the one you're using is green
function tools(){
  let middle = width / 2;
  let shovelX = middle - 170;
  let flagX = middle + 170 - toolSize;

  stroke("black");
  strokeWeight(2);

  //shovel
  fill(state === "shovel" ? "green" : "red");
  square(shovelX, toolY, toolSize, 10);
  image(shovel, shovelX, toolY, toolSize, toolSize);

  //flag
  fill(state === "flag" ? "green" : "red");
  square(flagX, toolY, toolSize, 10);
  image(flag, flagX, toolY, toolSize, toolSize);

  //only clickable while playing
  if (gameState === "game"){
    clickables.push({ x: shovelX, y: toolY, w: toolSize, h: toolSize, action: function(){
      state = "shovel";
    }});
    clickables.push({ x: flagX, y: toolY, w: toolSize, h: toolSize, action: function(){
      state = "flag";
    }});
  }
}

//bombs left = bombs - flags placed
function bombCounter(){
  let flagsPlaced = 0;
  for (let y = 0; y < rows; y++){
    for (let x = 0; x < cols; x++){
      if (grid[y][x].flagged){
        flagsPlaced++;
      }
    }
  }

  noStroke();
  fill("white");
  textSize(32);
  textStyle("bold");
  textAlign(CENTER, CENTER);
  text("Bombs: " + (numberOfBombs - flagsPlaced), width / 2, toolY + toolSize / 2);
}


// ---------- clicking ----------

function mousePressed(){

  //buttons first (menus, tools, play again)
  for (let b of clickables){
    if (inside(b.x, b.y, b.w, b.h)){
      b.action();
      return;
    }
  }

  //grid only works while playing
  if (gameState !== "game"){
    return;
  }

  //which square was clicked
  let cellX = floor((mouseX - gridX) / cellSize);
  let cellY = floor((mouseY - gridY) / cellSize);

  //clicked outside the grid
  if (cellX < 0 || cellX >= cols || cellY < 0 || cellY >= rows){
    return;
  }

  let cell = grid[cellY][cellX];

  //flag mode - put a flag on or take it off
  if (state === "flag"){
    if (!cell.revealed){
      cell.flagged = !cell.flagged;
    }
  }

  //shovel mode - dig (flags protect a square from the shovel)
  else if (!cell.flagged){

    //first click no bombs
    if (noBomb){
      bombsPlaced(numberOfBombs, cellX, cellY);
      amountOfNeighbors();
      noBomb = false;
    }

    //if bomb clicked
    if (cell.bomb){
      showAllBombs();
      explosion.reset();
      lastExplosionFrame = 0;
      gameState = "exploding";
      return;
    }

    reveal(cellX, cellY);
  }

  winCheck();
}

//puts the bombs in random places, but never in or around the first click
function bombsPlaced(numberOfBombs, noBombX, noBombY){
  let placed = 0;

  while (placed < numberOfBombs){

    //random placement
    let x = floor(random(cols));
    let y = floor(random(rows));

    //safe 3 by 3 around the first click
    let nearFirstClick = abs(x - noBombX) <= 1 && abs(y - noBombY) <= 1;

    if (!grid[y][x].bomb && !nearFirstClick){
      grid[y][x].bomb = true;
      placed++;
    }
  }
}

//numbers of bomb surrounding
function amountOfNeighbors(){
  for (let y = 0; y < rows; y++){
    for (let x = 0; x < cols; x++){
      let bombCount = 0;

      //check for a 3 by 3 square around
      for (let neighborY = -1; neighborY <= 1; neighborY++){
        for (let neighborX = -1; neighborX <= 1; neighborX++){
          let newNeighborY = y + neighborY;
          let newNeighborX = x + neighborX;

          //skip out of bounds
          if (newNeighborY >= 0 && newNeighborY < rows && newNeighborX >= 0 && newNeighborX < cols){
            if (grid[newNeighborY][newNeighborX].bomb){
              bombCount++;
            }
          }
        }
      }

      //update neighbors
      grid[y][x].neighbors = bombCount;
    }
  }
}

//digs a square - if it has no bombs around it, digs all the squares around it too
function reveal(startX, startY){

  //squares still to dig
  let toDig = [[startX, startY]];

  while (toDig.length > 0){
    let spot = toDig.pop();
    let x = spot[0];
    let y = spot[1];

    //skip out of bounds
    if (x < 0 || x >= cols || y < 0 || y >= rows){
      continue;
    }

    let cell = grid[y][x];

    //skip squares already dug or flagged
    if (cell.revealed || cell.flagged){
      continue;
    }

    cell.revealed = true;

    //empty square - open up everything around it
    if (cell.neighbors === 0 && !cell.bomb){
      for (let neighborY = -1; neighborY <= 1; neighborY++){
        for (let neighborX = -1; neighborX <= 1; neighborX++){
          toDig.push([x + neighborX, y + neighborY]);
        }
      }
    }
  }
}

//shows all bombs when you lose
function showAllBombs(){
  for (let y = 0; y < rows; y++){
    for (let x = 0; x < cols; x++){
      if (grid[y][x].bomb){
        grid[y][x].revealed = true;
      }
    }
  }
}

//win check
//win 1: every bomb flagged and no extra flags
//win 2: every square that isnt a bomb has been dug
function winCheck(){
  let flagsOnBomb = 0;
  let flagsPlaced = 0;
  let safeLeft = 0;

  for (let y = 0; y < rows; y++){
    for (let x = 0; x < cols; x++){
      let cell = grid[y][x];

      if (cell.flagged){
        flagsPlaced++;

        if (cell.bomb){
          flagsOnBomb++;
        }
      }

      if (!cell.bomb && !cell.revealed){
        safeLeft++;
      }
    }
  }

  let allFlagged = flagsOnBomb === numberOfBombs && flagsPlaced === numberOfBombs;
  let allDug = !noBomb && safeLeft === 0;

  if (allFlagged || allDug){
    gameState = "win";
  }
}
