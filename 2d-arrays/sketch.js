// Battle Tanks
// Ayrton Sauder
// march 26 2026
//
// Extra for Experts:
// - the gratest animations of all time mixed with a soundtrack that would make a grown kid cry all preloaded ofc textures never seen before to such quality
// sound effects making realism a understatement and to top it all off the best online support since sliced bread

// varriables
const cellSize = 50;
let bulletX, bulletY;
let shooting = false;
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
  spawnInGreen();
}

function draw() {
  background(220);
  displayGrid();
  drawPlayer(player.x * cellSize, player.y * cellSize);
}

function mousePressed() {
  if (!beat.isPlaying()) {
    beat.loop();
  }
}

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
    forward();
  }
  if (key === "a") {
    rotateLeft();
  }
  if (key === "d") {
    rotateRight();
  }
  if (key === "s") {
    back();
  }
  if (key === " ") {
    shoot();
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

function forward() {
  let nextX = player.x;
  let nextY = player.y;
  if (facingNorth) {
    nextY -= 1;
  } else if (facingSouth) {
    nextY += 1;
  } else if (facingWest) {
    nextX -= 1;
  } else if (facingEast) {
    nextX += 1;
  }
  if (grid[nextY] && grid[nextY][nextX] === unblocked) {
    player.x = nextX;
    player.y = nextY;
  }
}

function back() {
  let nextX = player.x;
  let nextY = player.y;
  if (facingNorth) {
    nextY += 1;
  } else if (facingSouth) {
    nextY -= 1;
  } else if (facingWest) {
    nextX += 1;
  } else if (facingEast) {
    nextX -= 1;
  }
  // gemini pseudocode
  if (grid[nextY] && grid[nextY][nextX] === unblocked) {
    player.x = nextX;
    player.y = nextY;
  }
}

function drawPlayer(x, y) {
  let cx = x + cellSize / 2;
  let cy = y + cellSize / 2;
  let angle = 0;
  if (facingNorth) {
    angle = -HALF_PI; //google search
  } else if (facingSouth) {
    angle = HALF_PI;
  } else if (facingWest) {
    angle = PI;
  } else if (facingEast) {
    angle = 0;
  }
  push(); //ai drew du tank
  translate(cx, cy);
  rotate(angle);
  fill(40);
  rect(-20, -18, 40, 10, 3);
  rect(-20, 8, 40, 10, 3);
  fill(80, 110, 60);
  rect(-15, -13, 30, 26, 4);
  fill(65, 95, 50);
  ellipse(0, 0, 22, 22);
  fill(50, 75, 40);
  rect(0, -4, 25, 8, 2);
  pop();
}

function spawnInGreen() {
  let spawned = false;

  while (!spawned) {
    let randX = floor(random(1, cols - 1));
    let randY = floor(random(1, rows - 1));

    if (grid[randY][randX] === unblocked) {
      player.x = randX;
      player.y = randY;
      spawned = true;
    }
  }
}

// shooting
function shoot() {
  shooting = true;
  bulletX = player.x;
  bulletY = player.y;
}

function shell() {
  if (shooting) {
    if (facingEast) {
      bulletX++;
    }
    if (facingWest) {
      bulletX--;
    }
    if (facingNorth) {
      bulletY--;
    }
    if (facingSouth) {
      bulletY++;
    }
  }
}

function detonate() {
  if (shooting) {
    if (grid[bulletY] && grid[bulletY][bulletX] === blocked) {
      grid[bulletY][bulletX] = unblocked;
    }
    shooting = false;
  }
}
