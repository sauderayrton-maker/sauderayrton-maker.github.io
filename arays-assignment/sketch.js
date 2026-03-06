// car game (work in progress)
// Ayrton Sauder
// march 6 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"0

let bgMusic;

function preload() {
  bgMusic = loadSound("8bt.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgMusic.loop();
}

function draw() {
  background(220);
  text('music is playing', 50, 50);
}