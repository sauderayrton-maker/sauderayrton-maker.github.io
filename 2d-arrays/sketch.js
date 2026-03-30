// Battle Tanks
// Ayrton Sauder
// march 26 2026
//
// Extra for Experts:
// - the gratest animations of all time mixed with a soundtrack that would make a grown kid cry all preloaded ofc textures never seen before to such quality
// sound effects making realism a understatement amd to top it all off the best online support simce sliced bread

// varriables
const cellSize = 50;
let inside;
let grid;
let rows, cols;
let player = {
  x: 1,
  y: 1,
};
let wall;
let ground;
let boom;
let beat;
let unblocked = 0;
let blocked = 1;
let facingNorth, facingSouth, facingEast, facingWest;

// setup graphics and music/sounds
function preload() {
  wall = loadImage("brick.png");
  ground = loadImage("grass.png");
  boom = loadImage("fireball.jpg");
  beat = loadSound("music.mp3");
}

function setup() {
  facingWest = true;
  noStroke();
  createCanvas(windowWidth, windowHeight);
  rows = floor(height / cellSize);
  cols = floor(width / cellSize);
  inside = ((rows - 2) * (cols - 2)) / 3;
  grid = outsideWall(cols, rows);
  insideWall(cols, rows);
}

function draw() {
  background(220);
  displayGrid();
  spawnInGreen();
  drawPlayer(player.x * cellSize, player.y * cellSize);
}

// controls
function mousePressed() {
  if (!beat.isPlaying()) {
    beat.loop();
  }
}

//makes the grid
function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === unblocked) {
        image(ground, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      if (grid[y][x] === blocked) {
        image(wall, x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

//makes a barier arround
function outsideWall(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
        newGrid[y].push(blocked);
      } else {
        newGrid[y].push(unblocked);
      }
    }
  }
  return newGrid;
}

function insideWall(cols, rows) {
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      if (random(100) > 50) {
        grid[y][x] = blocked;
      } else {
        grid[y][x] = unblocked;
      }
    }
  }
}

function keyPressed() {
  if (key === "w") {
    forward(player.x, player.y);
  }
  if (key === "a") {
    rotateLeft();
  }
  if (key === "d") {
    rotateRight();
  }
  if (key === "s") {
    back(player.x, player.y);
  }
}

function rotateLeft() {
  if (facingNorth) {
    facingNorth = false;
    facingWest = true;
  } else if (facingWest) {
    facingWest = false;
    facingSouth = true;
  } else if (facingSouth) {
    facingSouth = false;
    facingEast = true;
  } else {
    facingEast = false;
    facingNorth = true;
  }
}

function rotateRight() {
  if (facingNorth) {
    facingNorth = false;
    facingEast = true;
  } else if (facingEast) {
    facingEast = false;
    facingSouth = true;
  } else if (facingSouth) {
    facingSouth = false;
    facingWest = true;
  } else {
    facingWest = false;
    facingNorth = true;
  }
}

function forward(x, y) {
  let nextX = player.x;
  let nextY = player.y;

  if (facingNorth) {
    nextY -= 1;
  } else if (facingSouth) {
    nextY += 1;
  } else if (facingWest) {
    nextX -= 1;
  } else {
    nextX += 1;
  }

  if (grid[nextY][nextX] === unblocked) {
    player.x = nextX;
    player.y = nextY;
  }
}

function back(x, y) {
  let nextX = player.x;
  let nextY = player.y;

  if (facingNorth) {
    nextY += 1;
  } else if (facingSouth) {
    nextY -= 1;
  } else if (facingWest) {
    nextX += 1;
  } else {
    nextX -= 1;
  }

  if (grid[nextY][nextX] === unblocked) {
    player.x = nextX;
    player.y = nextY;
  }
}

function drawPlayer(x, y) {
  circle(x - cellSize / 2, y - cellSize / 2, cellSize);
}

function spawnInGreen() {
  let spawned = false;

  // Keep picking random coordinates until we find a grass tile
  while (!spawned) {
    let randX = floor(random(1, cols - 1));
    let randY = floor(random(1, rows - 1));

    // If the spot is unblocked, place the player there and stop the loop
    if (grid[randY][randX] === unblocked) {
      player.x = randX;
      player.y = randY;
      spawned = true;
    }
  }
}
