// Battle Tanks

let grid;
const GRIDBOX = 10;
let gridSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  checkTheSize();
}

function draw() {
  background(220);
}

function checkTheSize() {
  if (width > height) {
    gridSize = width / GRIDBOX;
  } else {
    gridSize = height / GRIDBOX;
  }
}
