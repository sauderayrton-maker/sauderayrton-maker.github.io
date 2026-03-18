// grid demo
//learning 2d arrays

let theGrid = [[0, 0, 1, 0],
              [1, 0, 1, 0],
              [0, 1, 0, 0],
              [0, 1, 0, 1]];

const SQUARE_DIM = theGrid.length;
let cellSize;


function setup() {
  createCanvas(windowWidth, windowHeight);
  if (width < height){
    cellSize = width / SQUARE_DIM;
  }
  else {
    cellSize = height / SQUARE_DIM;
  }
}

function draw() {
  background(220);
  showGrid();
}

function showGrid() {
  for (let y = 0; y < SQUARE_DIM; y ++){
    for (let x = 0; x < SQUARE_DIM; x++){
      if (theGrid[y][x] ===1) {
        fill("black");
      }
      if (theGrid[y][x] ===0) {
        fill("white");
      }
      square(x * cellSize, y * cellSize, cellSize);
    }
  }
}


function mouseClicked(){
  
}
