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
  background(220);
  fill(0);
  rect(width/2 - ROADWIDTH, 0, ROADWIDTH * 2, height);
  car();
  roadLines();
  goFast();
  control();
}

function drawRoad(){
  
}

function roadLines(){
  fill(255, 255, 0);
  rect(width/2 - 10, height, 20, 0);
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
  if (cX > width / 2- ROADWIDTH  / 2){
    cX -= HORIZONTALSPEED;
    console.log(cX);
  }
}

function mergeRight(){
  if (cX < width / 2+ ROADWIDTH  / 2){
    cX += HORIZONTALSPEED;
    console.log(cX);
  }
}

function car(){
  fill(255, 0, 0);
  rect(cX, cY, cW, cH);
}



