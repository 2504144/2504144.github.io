// Maze
// Khoi Tran
// March 10th, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let maze = null;

//tile size
let pixelPerTile = 50;
let count = 0;

//to go through wall
const WALL = true;
const UNLOCK = false;

function setup() {
  createCanvas(800, 400);
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
    }
  }
  count++;
}

function makeMaze(w, h){

  //maze untilities
  maze = {
    stack: [],
    tiles: [],
    w: w,
    h: h,
  };

  for (let i = 0; i < w - 1; i++){
    maze.tiles[i] = [];
    for(let j = 0; j < h - 1; j++){

      //tile
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
  if (tileAndWall){
    maze.stack.push(current);
    tileAndWall.tile[tileAndWall.wall] = UNLOCK;
    current[oppisiteWall(tileAndWall.wall)] = UNLOCK;
    tileAndWall.tile.seen = true;
    maze.stack.push(tileAndWall.tile);

    current.isCurrent = false;
    maze.stack[maze.stack.length-1].isCurrent = true;
  }

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

  //border right?!?!?
  let rightTile = maze.tiles[tile.x + 1][tile.y];
  if (tile.x < maze.w - 1 && !rightTile.seen){
    invis.push({tile: rightTile, wall: "right"});
  }


  if (invis.length === 0){
    return null;
  } 
  return invis[Math.floor(Math.random()*invis.length)];
}

//sense wall
function oppisiteWall(wall){

  //if up then go down
  if (wall === "up"){
    return "down";
  }

  //if down then go up
  else if (wall === "down"){
    return "up";
  }

  //if left go right
  else if (wall === "left"){
    return "right";
  }

  //if right go left
  else if (wall === "right"){
    return "left";
  }

  return -1;
}

function drawMaze(){
  push(); 
  translate(-pixelPerTile, -pixelPerTile);

  for (let i = 0; i < maze.tiles.length; i++){
    for (let j = 0; j < maze.tiles[i].length; j++){
      let tile = maze.tiles[i][j];
      drawTile(tile, i, j);
    }
  }
}

function drawTile(tile, i, j){
  strokeWeight(0);

  if (tile.seen === true){
    fill(0);
    square(i*pixelPerTile, j*pixelPerTile, pixelPerTile);

    strokeWeight(2);
    stroke("white");
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
}


//recursive back tracking- use this
//use this link- https://www.youtube.com/watch?v=HyK_Q5rrcr4
//better link- https://www.youtube.com/watch?v=jQFYh3nRfSQ