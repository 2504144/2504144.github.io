// Maze
// Khoi Tran
// March 10th, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let maze = null;
let pixelPerTile = 10;
let count = 0;

function setup() {
  createCanvas(800, 450);
  noStroke();

  makeMaze(width / pixelPerTile + 2, height / pixelPerTile + 2);
  drawMaze();

}

function draw() {  
  background("grey");
  if (count % 5 === 0){
    if (maze.stack.length !== 0){
      background("purple");
      generateTile();
      drawMaze();
    }
  }
  count++;
}

function makeMaze(w, h){
  maze = {
    stack: [],
    tiles: [],
    w: w,
    h: h,
  };

  for (let i = 0; i < w; i++){
    maze.tiles[i] = [];
    for(let j = 0; j < h; j++){
      maze.tiles[i][j] = {
        up: wall,
        down: wall,
        left: wall,
        right: wall,
        isStart: false,
        isCurrent: false,
        x: i,
        y: j,
        seen: false,
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
  if (tileAndWall){
    maze.stack.push(current);
    tileAndWall.tile[tileAndWall.wall] = open;
    current[oppisiteWall(tileAndWall.wall)] = open;
    tileAndWall.tile.seen = true;
    maze.stack.push(tileAndWall.tile);

    current.isCurrent = false;
    maze.stack[maze.stack.length-1].isCurrent = true;
  }

  else if (maze.tack.length !== 0){
    current.isCurrent = false;
    maze.stack[maze.stack.length-1].isCurrent = true;
  }
}

function chooseNeighbor(tile){
  let invis = [];

  let upTile = maze.tiles[tile.x][tile.y + 1];
  if (!upTile.seen){
    invis.push([tile, upTile, wall, down]);
  }

  let downTile = maze.tiles[tile.x][tile.y - 1];
  if (!downTile.seen){
    invis.push([tile, downTile, wall, down]);
  }

  let leftTile = maze.tiles[tile.x - 1][tile.y];
  if (!leftTile.seen){
    invis.push([tile, leftTile, wall, down]);
  }

  let rightTile = maze.tiles[tile.x + 1][tile.y];
  if (!rightTile.seen){
    invis.push([tile, rightTile, wall, down]);
  }

  if (invis.length === 0){
    return null;
  }
  return invis[Math.floor(Math.random()*invis.length)];
}

function oppisiteWall(wall){
  if (wall === up){
    return down;
  }

  else if (wall === down){
    return up;
  }

  else if (wall === left){
    return right;
  }

  else if (wall === right){
    return left;
  }
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
    if (tile.up === wall){
      line(i*pixelPerTile,j*pixelPerTile,(i+1)*pixelPerTile,j*pixelPerTile);
    }
    if (tile.down === wall){
      line(i*pixelPerTile,(j+1)*pixelPerTile,(i+1)*pixelPerTile,(j+1)*pixelPerTile);
    }
    if (tile.left === wall){
      line((i+1)*pixelPerTile,j*pixelPerTile,(i+1)*pixelPerTile,(j+1)*pixelPerTile);
    }
    if (tile.right === wall){
      line(i*pixelPerTile,j*pixelPerTile,i*pixelPerTile,(j+1)*pixelPerTile);
    }
  }
  if (tile.isCurrent){
    fill("orange");
    noStroke();
    circle(i*pixelPerTile + pixelPerTile/2, j*pixelPerTile + pixelPerTile/2, pixelPerTile/3);
  }
}


//recursive back tracking- use this
//use this link- https://www.youtube.com/watch?v=HyK_Q5rrcr4
//better link- https://www.youtube.com/watch?v=jQFYh3nRfSQ