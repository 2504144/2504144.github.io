// Maze
// Khoi Tran
// March 10th, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let maze;
let pixelPerTile = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);

}

function draw() {
  background(220); 
  
}

function makeMaze(w, h){
  maze = {
    "stack": [],
    "tiles": [],
    "w": w,
    "h": h,
  };

  for (let i = 0; i < w; i++){
    maze.tiles[i] = [];
    for(let j = 0; j < h; j++){
      maze.tiles[i][j] = {
        "up": "wall",
        "down": "wall",
        "left": "wall",
        "right": "wall",
        "isStart": false,
        "isCurrent": false,
        "x": i,
        "y": j,
        "seen": false,
      };
      if (i === 0 ||  i === w - 1 || j === 0 || j === h - 1){
        maze.tiles[i][j].seen = true;
      }
    }
  }
  maze.tiles[1][1].isCurrent = true;
  maze.tiles[1][1].isStart = true;
  maze.tiles[1][1].seen = true;
  maze.stack.push(maze.tiles[1][1]);
}

function generateTile(){
  let current = maze.stack.pop();
  
  let tileAndWall = chooseNeighbor(current);
}

function chooseNeighbor(tile){
  let invis = [];

  let upTile = maze.tiles[tile.x][tile.y + 1];
  if (!upTile.seen){
    invis.push(["tile", upTile, "wall", "down"]);
  }

  let downTile = maze.tiles[tile.x][tile.y - 1];
  if (!downTile.seen){
    invis.push(["tile", downTile, "wall", "down"]);
  }

  let leftTile = maze.tiles[tile.x - 1][tile.y];
  if (!leftTile.seen){
    invis.push(["tile", leftTile, "wall", "down"]);
  }

  let rightTile = maze.tiles[tile.x + 1][tile.y];
  if (!rightTile.seen){
    invis.push(["tile", rightTile, "wall", "down"]);
  }

  if (invis.length === 0){
    return null;
  }
}

function oppisiteWall(){
  if (wall === "up"){
    return "down";
  }

  else if (wall === "down"){
    return "up";
  }

  else if (wall === "left"){
    return "right";
  }

  else if (wall === "right"){
    return "left";
  }
}

function drawMaze(){

}

function drawTile(tile, i, j){
  
}


//recursive back tracking- use this
//use this link- https://www.youtube.com/watch?v=HyK_Q5rrcr4
//better link- https://www.youtube.com/watch?v=jQFYh3nRfSQ
