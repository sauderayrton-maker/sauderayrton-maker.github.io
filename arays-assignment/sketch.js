// car game (work in progress)
// Ayrton Sauder
// march 6 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"0

const ROADWIDTH = 100;
const LINESPEED = 50; 
const HORIZONTALSPEED = 5;
let cW = ROADWIDTH / 2 - 5;
let cH = 75;
let cX, cY;

let fast = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cX = width/2;
  cY = height/2;
}

function draw() {
  background(0, 150, 0);
  drawRoad();
  roadLines();
  car();
  goFast();
  control();
}

function drawRoad(){
  fill(255);
  rect(width/2 - ROADWIDTH - ROADWIDTH / 10, 0, ROADWIDTH * 2 + ROADWIDTH + 10, height);
  fill(0);
  rect(width/2 - ROADWIDTH, 0, ROADWIDTH * 2, height);
}

function roadLines(){
  fill(255, 255, 0);
  for (let i = -100; i < height + 100; i += 100){
    rect(width / 2 - 5, i, 10, 50);
  }
}

function goFast(){
  if (fast){
    mergeLeft();
  }
  else{
    mergeRight();
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
  if (cX > width / 2 - ROADWIDTH  / 2){
    cX -= HORIZONTALSPEED;
    console.log(cX);
  }
}

function mergeRight(){
  if (cX < width / 2 + ROADWIDTH  / 2){
    cX += HORIZONTALSPEED;
    console.log(cX);
  }
}

function car(){
  fill(255, 0, 0);
  rect(cX - cW/2, cY - cH/2, cW, cH);
}



