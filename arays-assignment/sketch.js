// car game (work in progress)
// Ayrton Sauder
// march 6 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"0

const ROADWIDTH = 100;
const LINESPEED = 50; 
let cW = (raodwidth / 2) - 5
let cH = 75;

let fast = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  let cX = width;
  let cY = height;


}

function draw() {
  background(220);
  fill(0);
  rect(width/2 - ROADWIDTH, 0, ROADWIDTH * 2, height);
  roadLines();
  control();
  goFast();
}

function roadLines(){
  fill(255, 255, 0);
  rect(width/2, height/2, 20, height);
}

function goFast(){
  if (fast){
    mergeLeft();
  }
  else{
    mergeRigth();
  }
}

function control(){
  if (keyIsDown(32)) {
    fast = true;
  }
  else{
    fast = false;
  }
}

function mergeLeft(){
  while (cX < (width / 2)- ROADWIDTH  / 2){
    cX -= HORIZONTALSPEED
  }
}

function mergeRight(){
  while (cX )
}

function car(){
  fill(255, 0, 0);
  rect(cX, cY, cW, cH);
}



