// Battle Tanks
// Ayrton Sauder
// march 26 2026
//
// Extra for Experts:
// - the gratest animations of all time mixed with a soundtrack that would make a grown kid cry all preloaded ofc textures never seen before to such quality
// sound effects making realism a understatement and to top it all off the best ai enemy system since sliced bread
//
// used ai to comment and organize my code before and after were committed

// ── CONSTANTS ─────────────────────────────────────────────
const cellSize = 50;
const BUTTON_WIDTH = 100;
const BUTTON_HEIGHT = 50;
const GRASS = 0;
const BRICK = 1;
const STEEL = 2;

// ── ASSETS ────────────────────────────────────────────────
let wall, ground, boom, beat;

// ── GRID ──────────────────────────────────────────────────
let grid;
let rows, cols;
let inside;

// ── PLAYER ────────────────────────────────────────────────
let player = { x: 1, y: 1 };
let facingNorth, facingSouth, facingEast, facingWest;

// ── GAME ──────────────────────────────────────────────────
let gameState;
let bombs = [];

// ── BOMB CLASS ────────────────────────────────────────────
class Bomb {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = cellSize;
    this.exploded = false;
    this.blastRadius = 1;
    this.timer = 120;
  }

  explode() {
    this.exploded = true;
    grid[this.y][this.x] = 0;
    for (let i = 1; i <= this.blastRadius; i++) {
      if (this.x + i < cols) {
        grid[this.y][this.x + i] = 0;
      }
      if (this.x - i >= 0) {
        grid[this.y][this.x - i] = 0;
      }
      if (this.y + i < rows) {
        grid[this.y + i][this.x] = 0;
      }
      if (this.y - i >= 0) {
        grid[this.y - i][this.x] = 0;
      }
    }
    console.log("booom");
  }

  update() {
    this.timer--;
    if (this.timer <= 0) {
      this.explode();
    }
  }

  draw() {
    let cx = this.x * cellSize + cellSize / 2;
    let cy = this.y * cellSize + cellSize / 2;
    //ai drawn
    push();
    translate(cx, cy);

    fill(20);
    stroke(255, 0, 0);
    strokeWeight(2);
    ellipse(0, 0, this.size * 0.7);

    let glow = sin(frameCount * 0.2) * 100 + 155;
    fill(glow, 0, 0);
    noStroke();
    ellipse(0, 0, this.size * 0.3);

    stroke(150);
    line(0, -this.size * 0.35, 5, -this.size * 0.5);
    pop();
  }
}

// ── PRELOAD / SETUP ───────────────────────────────────────
function preload() {
  wall = loadImage("brick.png");
  ground = loadImage("grass.png");
  boom = loadImage("fireball.jpg");
  beat = loadSound("music.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rows = floor(height / cellSize);
  cols = floor(width / cellSize);
  inside = ((rows - 2) * (cols - 2)) / 3;
  grid = outsideWall(cols, rows);
  insideWall(cols, rows);
  spawnInGreen();
  facingWest = true;
  gameState = "startScreen";
}

// ── SCREENS ───────────────────────────────────────────────
function startScreen() {
  background(0);
  textAlign(CENTER, CENTER);
  fill(30);
  rect(0, 0, width / 2, height);
  fill(255);
  textSize(32);
  text("PLAY", width / 4, height / 2);
  fill(20);
  rect(width / 2, 0, width / 2, height);
  fill(255);
  textSize(32);
  text("HOW TO PLAY", (width * 3) / 4, height / 2);
}

function tutorialScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(32);
  text("HOW TO PLAY", width / 2, height / 4);

  textSize(18);
  text("W - move forward", width / 2, height / 2 - 80);
  text("S - move backward", width / 2, height / 2 - 50);
  text("A - rotate left", width / 2, height / 2 - 20);
  text("D - rotate right", width / 2, height / 2 + 10);
  text("SPACE - drop bomb", width / 2, height / 2 + 40);
  text("bombs destroy walls in a plus shape", width / 2, height / 2 + 90);
  text("dont stand on your own bomb!!!", width / 2, height / 2 + 120);

  textSize(22);
  text("BACK TO TITLE", width / 2, height - 60);
}

function gameOverFromSelf() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("NOT OPTIMAL STRATEGY", width / 2, height / 2);
}

function gameOverFromEnemy() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("MY GRANDMA PLAYS BETTER THAN YOU", width / 2, height / 2);
}

function winnerScreen() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("YOU WIN", width / 2, height / 2);
}

// ── BUTTONS ───────────────────────────────────────────────
function startButtons() {
  if (gameState === "startScreen") {
    if (mouseX < width / 2) {
      gameState = "playing";
    } else {
      gameState = "tutorial";
    }
  }
}

// ── DRAW / STATE ROUTER ───────────────────────────────────
function draw() {
  if (gameState === "startScreen") {
    startScreen();
  }
  if (gameState === "tutorial") {
    tutorialScreen();
  }
  if (gameState === "playing") {
    play();
  }
  if (gameState === "gameOverSelf") {
    gameOverFromSelf();
  }
  if (gameState === "gameOverEnemy") {
    gameOverFromEnemy();
  }
  if (gameState === "winner") {
    winnerScreen();
  }
}

function play() {
  background(220);
  displayGrid();
  drawPlayer(player.x * cellSize, player.y * cellSize);
  displayBombs();
}

// ── INPUT ─────────────────────────────────────────────────
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
    placeBomb();
    console.log("boom");
  }
}

function mousePressed() {
  if (!beat.isPlaying()) {
    beat.loop();
  }
  if (gameState === "tutorial") {
    gameState = "startScreen";
    return;
  }
  startButtons();
}

// ── PLAYER MOVEMENT ───────────────────────────────────────
function forward() {
  let nextX = player.x;
  let nextY = player.y;
  if (facingNorth) {
    nextY -= 1;
  }
  if (facingSouth) {
    nextY += 1;
  }
  if (facingWest) {
    nextX -= 1;
  }
  if (facingEast) {
    nextX += 1;
  }
  if (grid[nextY] && grid[nextY][nextX] === GRASS) {
    player.x = nextX;
    player.y = nextY;
  }
}

function back() {
  let nextX = player.x;
  let nextY = player.y;
  if (facingNorth) {
    nextY += 1;
  }
  if (facingSouth) {
    nextY -= 1;
  }
  if (facingWest) {
    nextX += 1;
  }
  if (facingEast) {
    nextX -= 1;
  }
  // gemini pseudocode
  if (grid[nextY] && grid[nextY][nextX] === GRASS) {
    player.x = nextX;
    player.y = nextY;
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
  } else if (facingEast) {
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
  } else if (facingWest) {
    facingWest = false;
    facingNorth = true;
  }
}

// ── GRID ──────────────────────────────────────────────────
function outsideWall(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
        newGrid[y].push(STEEL);
      } else {
        newGrid[y].push(GRASS);
      }
    }
  }
  return newGrid;
}

function insideWall(cols, rows) {
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      if (random(100) > 50) {
        grid[y][x] = BRICK;
      } else {
        grid[y][x] = GRASS;
      }
    }
  }
}

function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === GRASS) {
        image(ground, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      if (grid[y][x] === BRICK) {
        image(wall, x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

// ── BOMBS ─────────────────────────────────────────────────
function placeBomb() {
  let bomb = new Bomb(player.x, player.y);
  bombs.push(bomb);
}

function displayBombs() {
  for (let i = 0; i < bombs.length; i++) {
    bombs[i].draw();
    if (bombs[i].exploded) {
      bombs.splice(i, 1);
      i--;
    } else {
      bombs[i].update();
    }
  }
}

// ── PLAYER DRAW ───────────────────────────────────────────
function drawPlayer(x, y) {
  let cx = x + cellSize / 2;
  let cy = y + cellSize / 2;
  let angle = 0;
  if (facingNorth) {
    angle = -HALF_PI; //google search
  }
  if (facingSouth) {
    angle = HALF_PI;
  }
  if (facingWest) {
    angle = PI;
  }
  if (facingEast) {
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
    if (grid[randY][randX] === GRASS) {
      player.x = randX;
      player.y = randY;
      spawned = true;
    }
  }
}
