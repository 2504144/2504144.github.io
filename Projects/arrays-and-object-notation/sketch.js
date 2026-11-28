// Maze
// Khoi Tran
// March 10th, 2025
//
// Extra for Experts:
// - I used preload and createAudio to add sounds, also learnt text align if you havent taught that
// - the maze builds itself with recursive back tracking, and you can watch it happen
// - you can pick how big the maze is
//
// How to play:
// - pick a maze size on the main menu (or use Small / Medium / Large)
// - wait for the maze to build (or press space to skip)
// - move with W A S D or the arrow keys, hold a key to keep moving
// - get your red dot from the green start to the yellow finish

//recursive back tracking - reference
//link- https://www.youtube.com/watch?v=HyK_Q5rrcr4
//more helpful link- https://www.youtube.com/watch?v=jQFYh3nRfSQ


//screens - "main", "controls", "generating", "game", "win"
let gameState = "main";

//settings you can change on the main menu
let cols = 15;
let rows = 10;

//limits for the settings
let minSize = 5;
let maxCols = 40;
let maxRows = 25;

//presets - name, columns, rows
let presets = [
  { name: "Small", cols: 10, rows: 6 },
  { name: "Medium", cols: 20, rows: 12 },
  { name: "Large", cols: 35, rows: 20 },
];

//the maze - tiles[x][y], each tile has 4 walls
let maze = null;

//tile size and where the maze sits on screen (worked out in layoutMaze so it always fits)
let tileSize;
let mazeX;
let mazeY;

//player
let player = {
  x: 0,
  y: 0,
};

//every tile the player has stepped on (drawn as a trail)
let trail = [];

//holding a key down - how many frames between each step
let moveDelay = 6;
let lastMove = 0;

//score
let moves = 0;
let startTime = 0;
let finishTime = 0;

//menu button size
let buttonWidth = 400;
let buttonHeight = 60;

//every button on screen right now - redrawn each frame so clicks match what you see
let clickables = [];

//sounds
let audioWhistle;
let cheer;


//sounds
function preload(){
  audioWhistle = createAudio("cartoon whistle noise.wav");
  cheer = createAudio("crowd cheer.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial");
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
  else if (gameState === "generating"){
    generating();
  }
  else if (gameState === "game"){
    game();
  }
  else if (gameState === "win"){
    winner();
  }
}

//window resizing
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  layoutMaze();
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

function mousePressed(){
  for (let b of clickables){
    if (inside(b.x, b.y, b.w, b.h)){
      b.action();
      return;
    }
  }
}


// ---------- screens ----------

//main screen - play, controls and the maze size
function mainPage(){
  background("lightblue");

  //everything stacks down the middle, spacing shrinks on small windows
  let middle = width / 2;
  let step = min(78, (height - 40) / 9);
  let y = step * 0.4;
  let h = step * 0.8;

  //banner
  fill("black");
  rect(middle - buttonWidth / 2, y, buttonWidth, h, 12);
  fill("white");
  textStyle("bold");
  textAlign(CENTER, CENTER);
  textSize(min(h * 0.75, 50));
  text("Maze", middle, y + h / 2);

  //play and controls
  y += step * 1.3;
  button("Play", middle - buttonWidth / 4, y, buttonWidth / 2, h, newMaze);
  y += step;
  button("Controls", middle - buttonWidth / 3.5, y, buttonWidth / 1.75, h, function(){
    gameState = "controls";
  });

  //settings title
  y += step * 1.4;
  fill("black");
  textSize(min(h * 0.55, 32));
  text("Maze Size", middle, y + h / 3);

  //columns and rows - each with a - and + button
  y += step * 0.8;
  stepper("Columns", cols, y, h, function(change){
    cols = constrain(cols + change, minSize, maxCols);
  });
  y += step;
  stepper("Rows", rows, y, h, function(change){
    rows = constrain(rows + change, minSize, maxRows);
  });

  //quick presets
  y += step * 1.15;
  let presetWidth = 120;
  let gap = 16;
  let startX = middle - (presets.length * presetWidth + (presets.length - 1) * gap) / 2;

  for (let i = 0; i < presets.length; i++){
    let p = presets[i];

    //the preset you're on is green
    let picked = cols === p.cols && rows === p.rows;

    button(p.name, startX + i * (presetWidth + gap), y, presetWidth, h * 0.85, function(){
      cols = p.cols;
      rows = p.rows;
    }, picked ? "green" : "black");
  }
}

//one settings row:  Columns  [-]  15  [+]
function stepper(label, value, y, h, change){
  let middle = width / 2;

  //label
  fill("black");
  textStyle("bold");
  textAlign(RIGHT, CENTER);
  textSize(min(h * 0.5, 28));
  text(label, middle - 70, y + h / 2);

  //- and + buttons
  button("-", middle - 50, y, h, h, function(){
    change(-1);
  });
  button("+", middle + 110, y, h, h, function(){
    change(1);
  });

  //the number, half way between the - and + buttons
  fill("black");
  textAlign(CENTER, CENTER);
  textSize(min(h * 0.6, 34));
  text(value, (middle - 50 + h + middle + 110) / 2, y + h / 2);
}

//controls screen
function controlPage(){
  background("black");

  let boxWidth = min(width - 60, 760);
  let boxX = width / 2 - boxWidth / 2;

  //banner
  fill("lightblue");
  rect(width / 2 - buttonWidth / 2, height / 10, buttonWidth, buttonHeight, 12);
  fill("black");
  textSize(46);
  textStyle("bold");
  textAlign(CENTER, CENTER);
  text("Controls", width / 2, height / 10 + buttonHeight / 2);

  //text box
  let lines = [
    "- Move with W A S D or the arrow keys",
    "- Hold a key down to keep moving",
    "- Get your red dot from the green start to the yellow finish",
    "- Press space while the maze is building to skip",
    "- Change the maze size on the main menu",
    "- Good luck!",
  ];
  let boxY = height / 10 + buttonHeight + 30;
  let lineHeight = 44;

  fill("lightblue");
  rect(boxX, boxY, boxWidth, lines.length * lineHeight + 30, 12);

  fill("black");
  textSize(min(24, boxWidth / 28));
  textAlign(LEFT, CENTER);
  for (let i = 0; i < lines.length; i++){
    text(lines[i], boxX + 24, boxY + 15 + lineHeight / 2 + i * lineHeight);
  }

  //play and back buttons
  let y = boxY + lines.length * lineHeight + 60;
  button("Play", width / 2 + 10, y, buttonWidth / 2.2, buttonHeight, newMaze, "grey");
  button("Back", width / 2 - 10 - buttonWidth / 2.2, y, buttonWidth / 2.2, buttonHeight, function(){
    gameState = "main";
  }, "grey");
}

//maze building itself - a few steps every frame so you can watch
function generating(){
  background("lightblue");

  //bigger mazes build faster so they dont take forever
  let stepsPerFrame = max(1, floor(cols * rows / 150));
  for (let i = 0; i < stepsPerFrame && maze.stack.length > 0; i++){
    generateTile();
  }

  drawMaze();

  //status bar
  bottomBar("Building the maze...  (space to skip)");

  //done building
  if (maze.stack.length === 0){
    startGame();
  }
}

//playing
function game(){
  background("lightblue");

  //holding a key keeps moving
  if (frameCount - lastMove >= moveDelay){
    if (keyIsDown(87) || keyIsDown(UP_ARROW)){ //w
      tryMove(0, -1);
    }
    else if (keyIsDown(83) || keyIsDown(DOWN_ARROW)){ //s
      tryMove(0, 1);
    }
    else if (keyIsDown(65) || keyIsDown(LEFT_ARROW)){ //a
      tryMove(-1, 0);
    }
    else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)){ //d
      tryMove(1, 0);
    }
  }

  drawMaze();
  drawPlayer();

  //time and moves
  let seconds = floor((millis() - startTime) / 1000);
  bottomBar("Time: " + seconds + "s     Moves: " + moves);

  button("Menu", width - 130, height - 52, 110, 40, function(){
    gameState = "main";
  });
}

//winner
function winner(){
  background("black");
  drawMaze();
  drawPlayer();

  //dark box with the result
  let boxWidth = min(width - 40, 460);
  let boxX = width / 2 - boxWidth / 2;
  let boxY = height / 2 - 140;

  fill(0, 0, 0, 210);
  rect(boxX, boxY, boxWidth, 280, 16);

  //text
  fill("lightblue");
  textStyle("bold");
  textAlign(CENTER, CENTER);
  textSize(48);
  text("Well Done!", width / 2, boxY + 50);

  fill("white");
  textSize(22);
  let seconds = floor((finishTime - startTime) / 1000);
  text(plural(seconds, "second") + "   " + plural(moves, "move"), width / 2, boxY + 100);

  button("Play Again", boxX + 30, boxY + 135, boxWidth - 60, buttonHeight, newMaze, "green");
  button("Menu", boxX + 30, boxY + 135 + buttonHeight + 10, boxWidth - 60, buttonHeight * 0.7, function(){
    gameState = "main";
  });
}

//"1 second" but "2 seconds"
function plural(amount, word){
  if (amount === 1){
    return amount + " " + word;
  }
  return amount + " " + word + "s";
}

//strip along the bottom for messages
function bottomBar(message){
  noStroke();
  fill("black");
  rect(0, height - 60, width, 60);

  fill("white");
  textStyle("bold");
  textAlign(LEFT, CENTER);
  textSize(22);
  text(message, 20, height - 30);
}


// ---------- making the maze ----------

//starts building a new maze with the current size
function newMaze(){
  makeMaze(cols, rows);
  layoutMaze();
  gameState = "generating";
}

//works out how big each tile is so the whole maze fits on screen
function layoutMaze(){
  let roomWidth = width - 40;
  let roomHeight = height - 60 - 40;

  tileSize = floor(min(roomWidth / cols, roomHeight / rows));

  //center the maze
  mazeX = (width - tileSize * cols) / 2;
  mazeY = (height - 60 - tileSize * rows) / 2;
}

function makeMaze(w, h){

  //maze utilities
  maze = {
    stack: [],
    tiles: [],
    w: w,
    h: h,
  };

  //for each tile - starts with all 4 walls up
  for (let x = 0; x < w; x++){
    maze.tiles[x] = [];
    for (let y = 0; y < h; y++){
      maze.tiles[x][y] = {
        up: true,
        down: true,
        left: true,
        right: true,

        //positioning of tile
        x: x,
        y: y,

        //has the builder been here yet
        seen: false,
        isCurrent: false,
      };
    }
  }

  //start in the top left corner
  let start = maze.tiles[0][0];
  start.seen = true;
  start.isCurrent = true;
  maze.stack.push(start);
}

//one step of recursive back tracking
function generateTile(){
  let current = maze.stack.pop();
  current.isCurrent = false;

  let next = chooseNeighbor(current);

  //explore maze
  if (next){

    //come back here later
    maze.stack.push(current);

    //knock down the wall between the two tiles
    current[next.wall] = false;
    next.tile[oppositeWall(next.wall)] = false;

    next.tile.seen = true;
    maze.stack.push(next.tile);
  }

  //the tile on top of the stack is where the builder is now (back tracking if nothing new)
  if (maze.stack.length > 0){
    maze.stack[maze.stack.length - 1].isCurrent = true;
  }
}

//picks a random neighbor the builder hasnt been to yet
function chooseNeighbor(tile){
  let options = [];

  //tile above
  if (tile.y > 0 && !maze.tiles[tile.x][tile.y - 1].seen){
    options.push({ tile: maze.tiles[tile.x][tile.y - 1], wall: "up" });
  }

  //tile below
  if (tile.y < maze.h - 1 && !maze.tiles[tile.x][tile.y + 1].seen){
    options.push({ tile: maze.tiles[tile.x][tile.y + 1], wall: "down" });
  }

  //tile on the left
  if (tile.x > 0 && !maze.tiles[tile.x - 1][tile.y].seen){
    options.push({ tile: maze.tiles[tile.x - 1][tile.y], wall: "left" });
  }

  //tile on the right
  if (tile.x < maze.w - 1 && !maze.tiles[tile.x + 1][tile.y].seen){
    options.push({ tile: maze.tiles[tile.x + 1][tile.y], wall: "right" });
  }

  //all is filled
  if (options.length === 0){
    return null;
  }

  //rounds down number and picks random
  return options[Math.floor(Math.random() * options.length)];
}

//the wall on the other side
function oppositeWall(wall){
  if (wall === "up"){
    return "down";
  }
  else if (wall === "down"){
    return "up";
  }
  else if (wall === "left"){
    return "right";
  }
  return "left";
}

//builds the rest of the maze straight away
function finishBuilding(){
  while (maze.stack.length > 0){
    generateTile();
  }
}


// ---------- drawing ----------

function drawMaze(){

  //each tile
  for (let x = 0; x < maze.w; x++){
    for (let y = 0; y < maze.h; y++){
      drawTile(maze.tiles[x][y]);
    }
  }

  //start and finish
  noStroke();
  fill("green");
  square(mazeX + tileSize * 0.15, mazeY + tileSize * 0.15, tileSize * 0.7, 4);
  fill("gold");
  square(mazeX + (maze.w - 1) * tileSize + tileSize * 0.15, mazeY + (maze.h - 1) * tileSize + tileSize * 0.15, tileSize * 0.7, 4);
}

function drawTile(tile){
  let left = mazeX + tile.x * tileSize;
  let top = mazeY + tile.y * tileSize;
  let right = left + tileSize;
  let bottom = top + tileSize;

  //tiles the builder hasnt reached yet stay light blue
  if (!tile.seen){
    return;
  }

  //floor
  noStroke();
  fill("black");
  square(left, top, tileSize);

  //white walls
  stroke("white");
  strokeWeight(max(2, tileSize / 12));
  if (tile.up){
    line(left, top, right, top);
  }
  if (tile.down){
    line(left, bottom, right, bottom);
  }
  if (tile.left){
    line(left, top, left, bottom);
  }
  if (tile.right){
    line(right, top, right, bottom);
  }

  //follows where the builder is heading
  if (tile.isCurrent){
    noStroke();
    fill("orange");
    circle(left + tileSize / 2, top + tileSize / 2, tileSize / 2);
  }
}

//player and the trail behind them
function drawPlayer(){
  noStroke();

  //trail
  fill(173, 216, 230, 120); //light blue see through
  for (let spot of trail){
    circle(mazeX + spot.x * tileSize + tileSize / 2, mazeY + spot.y * tileSize + tileSize / 2, tileSize / 4);
  }

  //player
  fill("red");
  circle(mazeX + player.x * tileSize + tileSize / 2, mazeY + player.y * tileSize + tileSize / 2, tileSize / 1.8);
}


// ---------- playing ----------

//maze is built - put the player at the start
function startGame(){
  audioWhistle.play();

  player.x = 0;
  player.y = 0;
  trail = [{ x: 0, y: 0 }];
  moves = 0;
  startTime = millis();
  lastMove = frameCount;

  gameState = "game";
}

//movement
function keyPressed(){

  //skip building
  if (gameState === "generating" && key === " "){
    finishBuilding();
    return;
  }

  if (gameState !== "game"){
    return;
  }

  //one step straight away when a key is pressed (holding is done in game)
  if (key === "w" || keyCode === UP_ARROW){
    tryMove(0, -1);
  }
  else if (key === "s" || keyCode === DOWN_ARROW){
    tryMove(0, 1);
  }
  else if (key === "a" || keyCode === LEFT_ARROW){
    tryMove(-1, 0);
  }
  else if (key === "d" || keyCode === RIGHT_ARROW){
    tryMove(1, 0);
  }

  //stops the arrow keys from scrolling the page
  return false;
}

//moves the player if there isnt a wall in the way
function tryMove(stepX, stepY){
  let tile = maze.tiles[player.x][player.y];

  //which wall is in the way for this direction
  let wall;
  if (stepY === -1){
    wall = tile.up;
  }
  else if (stepY === 1){
    wall = tile.down;
  }
  else if (stepX === -1){
    wall = tile.left;
  }
  else {
    wall = tile.right;
  }

  lastMove = frameCount;

  //blocked
  if (wall){
    return;
  }

  player.x += stepX;
  player.y += stepY;
  moves++;
  trail.push({ x: player.x, y: player.y });

  //made it to the finish (bottom right corner)
  if (player.x === maze.w - 1 && player.y === maze.h - 1){
    finishTime = millis();
    cheer.play();
    gameState = "win";
  }
}
