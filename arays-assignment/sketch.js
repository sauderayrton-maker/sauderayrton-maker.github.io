// car game (work in progress)
// Ayrton Sauder
// march 6 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"0

const ROADWIDTH = 100;
const LINESPEED = 50; 

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  fill(0);
  rect(width/2 - ROADWIDTH, 0, ROADWIDTH * 2, height);
  roadLines();
}

function roadLines(y){
  fill(255, 255, 0);
  rect(width / LINEWIDTH, height- 60, 20, 60);
}