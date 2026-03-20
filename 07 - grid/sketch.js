// grid demo
//learning 2d arrays

// let theGrid = [[0, 0, 1, 0],
//               [1, 0, 1, 0],
//               [0, 1, 0, 0],
//               [0, 1, 0, 1]];

let theGrid;

const SQUARE_DIM = 10;
let cellSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (width < height) {
    cellSize = width / SQUARE_DIM;
  }
  else {
    cellSize = height / SQUARE_DIM;
  }
  theGrid = generateRandomGrid(SQUARE_DIM, SQUARE_DIM);
}

function draw() {
  background(220);
  showGrid();
}

function showGrid() {
  for (let y = 0; y < SQUARE_DIM; y++) {
    for (let x = 0; x < SQUARE_DIM; x++) {
      if (theGrid[y][x] === 1) {
        fill("black");
      }
      if (theGrid[y][x] === 0) {
        fill("white");
      }
      square(x * cellSize, y * cellSize, cellSize);
    }
  }
}

function mouseClicked() {
  let x = floor(mouseX / cellSize);
  let y = floor(mouseY / cellSize);

  toggleCell(x, y);
}

function toggleCell(x, y) {
  if (theGrid[y][x] === 1) {
    theGrid[y][x] = 0;
  }
  else {
    theGrid[y][x] = 1;
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (random(100) < 50) {
        newGrid[y].push(0);
      } 
      else {
        newGrid[y].push(1);
      }
    }
  }
  return newGrid;
}
