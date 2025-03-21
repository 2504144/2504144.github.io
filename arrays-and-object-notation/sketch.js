// Maze
// Khoi Tran
// March 10th, 2025
//
//
// Extra for Experts:
// I used preload and create audio sound to the end, also learnt text align if you havent taught that. 


//recursive back tracking - reference
//link- https://www.youtube.com/watch?v=HyK_Q5rrcr4
//more helpful link- https://www.youtube.com/watch?v=jQFYh3nRfSQ

let maze = null;

//tile size
let pixelPerTile = 100;
let count = 0;

//to go back through wall
const WALL = true;
const UNLOCK = false;

//sound
let audioWhistlePlayed = false;

//player/object
let player = {
  x: 1,
  y: 1,
  size: pixelPerTile/3,
};

function setup() {
  createCanvas(800, 400);//could not figuire out full screen
  noStroke();
  
  //create maze
  makeMaze(width / pixelPerTile + 2, height / pixelPerTile + 2);
  drawMaze(); 
}

function draw() {  

  //checks if there is any space left to cover
  if (maze.stack.length !== 0){
    if (count % 5 === 0){
      background("lightblue");
      generateTile();
      drawMaze();
      spawnPlayer();
    }
  }
  else{
    
    //play once
    if (!audioWhistlePlayed){
      audioWhistle.play();
      audioWhistlePlayed = true;
    }

  }
  count++;

  //once won
  if (maze.stack.length === 0){
    if (player.x === maze.w - 2 && player.y === maze.h - 2){
      winner();
      cheer.play();//almsot had it for this
    }
  }
} 

function makeMaze(w, h){

  //maze untilities
  maze = {
    stack: [],
    tiles: [],
    w: w,
    h: h,
  };

  //for each tile
  for (let i = 0; i < w - 1; i++){
    maze.tiles[i] = [];
    for(let j = 0; j < h - 1; j++){
      maze.tiles[i][j] = {

        //if tile blocked by wall
        up: WALL,
        down: WALL,
        left: WALL,
        right: WALL,

        //if tile start or current
        isStart: false,
        isCurrent: false,

        //positioning of tile
        x: i,
        y: j,

        //seen
        seen: false,
      };
      
      //has tile been seen?
      if (i === 0 ||  i === w - 1 || j === 0 || j === h - 1){
        maze.tiles[i][j].seen = true;
      }
    }
  }

  //postions
  maze.tiles[1][1].isCurrent = true;
  maze.tiles[1][1].isStart = true;
  maze.tiles[1][1].seen = true;
  maze.stack.push(maze.tiles[1][1]);
}

function generateTile(){
  let current = maze.stack.pop();
  
  let tileAndWall = chooseNeighbor(current);

  //explore maze
  if (tileAndWall){
    
    //add to stack
    maze.stack.push(current);
    tileAndWall.tile[tileAndWall.wall] = UNLOCK;
    current[oppisiteWall(tileAndWall.wall)] = UNLOCK;
    tileAndWall.tile.seen = true;
    maze.stack.push(tileAndWall.tile);

    current.isCurrent = false;
    maze.stack[maze.stack.length-1].isCurrent = true;
  }

  //back track to find 
  else if (maze.stack.length !== 0){
    current.isCurrent = false;
    maze.stack[maze.stack.length-1].isCurrent = true;
  }
}

//bounderies
function chooseNeighbor(tile){
  let invis = [];

  //border on top
  let upTile = maze.tiles[tile.x][tile.y + 1];
  if (tile.y < maze.h -2 && !upTile.seen){
    invis.push({tile: upTile, wall: "up"});
  }

  //border bottom
  let downTile = maze.tiles[tile.x][tile.y - 1];
  if (tile.y > 0 && !downTile.seen){
    invis.push({tile: downTile, wall: "down"});
  }

  //border left
  let leftTile = maze.tiles[tile.x - 1][tile.y];
  if (tile.y > 0 && !leftTile.seen){
    invis.push({tile: leftTile, wall: "left"});
  }

  //border right
  if (tile.x + 1 < maze.tiles.length && maze.tiles[tile.x + 1] && maze.tiles[tile.x + 1][tile.y]){
    let rightTile = maze.tiles[tile.x + 1][tile.y];
    if (!rightTile.seen){
      invis.push({tile: rightTile, wall: "right"});
    }
  }

  //all is filled
  if (invis.length === 0){
    return null;
  } 

  //rounds down number and picks random
  return invis[Math.floor(Math.random()*invis.length)];
}

//sense wall
function oppisiteWall(wall){

  //if up look down
  if (wall === "up"){
    return "down";
  }

  //if down look up
  else if (wall === "down"){
    return "up";
  }

  //if left look right
  else if (wall === "left"){
    return "right";
  }

  //if right look left
  else if (wall === "right"){
    return "left";
  }

  return -1;
}

function drawMaze(){
  push(); 

  //switch origin
  translate(-pixelPerTile, -pixelPerTile);

  //each tile
  for (let i = 0; i < maze.tiles.length; i++){
    for (let j = 0; j < maze.tiles[i].length; j++){
      let tile = maze.tiles[i][j];
      drawTile(tile, i, j);
    }
  }
}

function drawTile(tile, i, j){
  //for opening
  strokeWeight(0);

  //walls
  if (tile.seen === true){
    //draws pixel
    fill("black");
    square(i*pixelPerTile, j*pixelPerTile, pixelPerTile);

    //white walls
    strokeWeight(2);
    stroke("white");

    //place walls
    if (tile.up === WALL){
      line(i*pixelPerTile,j*pixelPerTile,(i+1)*pixelPerTile,j*pixelPerTile);
    }
    if (tile.down === WALL){
      line(i*pixelPerTile,(j+1)*pixelPerTile,(i+1)*pixelPerTile,(j+1)*pixelPerTile);
    }
    if (tile.left === WALL){
      line((i+1)*pixelPerTile,j*pixelPerTile,(i+1)*pixelPerTile,(j+1)*pixelPerTile);
    }
    if (tile.right === WALL){
      line(i*pixelPerTile,j*pixelPerTile,i*pixelPerTile,(j+1)*pixelPerTile);
    }
  }

  //follows where tile is heading
  if (tile.isCurrent){
    fill("orange");
    noStroke();
    circle(i*pixelPerTile + pixelPerTile/2, j*pixelPerTile + pixelPerTile/2, pixelPerTile/3);
  }

  //start circle
  if (tile.isStart){
    fill('green');
    noStroke();
    circle(i * pixelPerTile + pixelPerTile/2, j * pixelPerTile + pixelPerTile/2, pixelPerTile/3);
  }
}

//sounds
function preload(){
  audioWhistle = createAudio("cartoon whistle noise.wav");
  cheer = createAudio('crowd cheer');
}

//player
function spawnPlayer(){
  fill("red");
  noStroke();
  circle(player.x * pixelPerTile + pixelPerTile / 2, player.y * pixelPerTile + pixelPerTile / 2, player.size);
}

//movement
function keyPressed(){

  //up
  if (key === "w" && player.y >= 1 && maze.tiles[player.x][player.y].up === UNLOCK){
    player.y--;
  }

  //down
  if (key === "s" && player.y < maze.h - 1 && maze.tiles[player.x][player.y + 1].up === UNLOCK){
    player.y++;
  }

  //left
  if (key === "a" && player.y >= 1 && maze.tiles[player.x - 1][player.y].left === UNLOCK){
    player.x--;
  }

  //right
  if (key === "d" && player.x < maze.w - 1 && maze.tiles[player.x + 1][player.y].right === UNLOCK){
    player.x++;
  }
}

//winner
function winner(){
  background("black");
  fill("lightblue");
  rect (width/4 , height/2 -height / 10, width / 2, height /5);

  //text
  fill("black");
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Well Done!", width / 2, height/2);
}