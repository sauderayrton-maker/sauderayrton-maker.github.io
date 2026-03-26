// rect grid

const cellSize = 100;
let inside;
let grid;
let rows, cols;

function setup() {
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
}

function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) {
        fill("white");
      } else {
        fill("black");
      }
      square(x * cellSize, y * cellSize, cellSize);
    }
  }
}

function outsideWall(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
        newGrid[y].push(1);
      } else {
        newGrid[y].push(0);
      }
    }
  }
  return newGrid;
}

function insideWall(cols, rows) {
    for (let y = 1; y < rows - 1; y++) {
      for (let x = 1; x < cols - 1; x++) {
        if (random(100) > 50) {
          grid[y][x] = 1;
        } else {
          grid[y][x] = 0;
        }
      }
  }
  return newGrid;
}
