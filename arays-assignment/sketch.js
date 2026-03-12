// car game (work in progress)
// Ayrton Sauder
// march 6 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"0

const ROADWIDTH = 100;
const LINESPEED = 10; 
const HORIZONTALSPEED = 5;
let cW = ROADWIDTH / 2 - 5;
let cH = 75;
let cX, cY;

let fast = false;
let lineLoop = 0;

// gamestates 
let gameState = 'startScreen'

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  cX = width/2 + ROADWIDTH/2;
  cY = height - height/4;
}

function draw() {
  if (gameState === 'startScreen'){
    start();
  }
  if (gameState === 'play'){
    background(10, 25, 15);
    drawRoad();
    roadLines();
    car();
    goFast();
    control();
    hud();
  }
}

function keyPressed() {
  if (keyCode === ENTER && gameState === 'startScreen') {
    gameState = 'play'
  }
}

function drawRoad(){
  fill(215, 215, 200);
  rect(width/2 - ROADWIDTH - ROADWIDTH / 10, 0, ROADWIDTH * 2 + 20, height);
  fill(0);
  rect(width/2 - ROADWIDTH, 0, ROADWIDTH * 2, height);
}

function roadLines(){
  fill(255, 210, 100);
  for (let i = -100; i < height + 100; i += 100){
    rect(width / 2 - 5, i + lineLoop, 10, 50);
  }

  if (fast){
    lineLoop += LINESPEED * 2;
  }  
  else {
    lineLoop += LINESPEED;
  }

  if (lineLoop > 100){
    lineLoop = 0
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
  noStroke();
  fill(200, 0, 0);
  rect(cX - cW/2, cY - cH/2, cW, cH, 8);

  fill(255, 0, 0);
  rect(cX - cW/2 + 5, cY - cH/2 + 15, cW - 10, cH - 30, 5);

  fill(50, 50, 80);
  rect(cX - cW/2 + 7, cY - cH/2 + 20, cW - 14, 15, 2);

  fill(50, 50, 80);
  rect(cX - cW/2 + 7, cY - cH/2 + 50, cW - 14, 10, 2);
}

function start(){
  background(15, 15, 15);
  strokeWeight(2);
  stroke(60, 60, 80);
  fill(40, 40, 50, 200);
  rect(width / 2 - 250, height / 2 - 150, 500, 300, 20);
  noStroke();
  fill(0, 200, 255);
  textStyle(BOLD)
  textSize(45);
  textAlign(CENTER);
  text("CAR GAME", width / 2, height / 2 - 80);
  textStyle(normal);
  fill(220);
  textSize(22);
  text("Press Enter to Start", width / 2, height / 2 + 10);
  fill(150);
  textSize(18);
  text("Press Space to Pass", width / 2, height / 2 + 50);
  
}

function end(){
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(100);
  text("game over", width/ 2, height/ 2)
}

function hud(){
  strokeWeight(2);
  stroke(60, 60, 80);
  fill(40, 40, 50, 200);
  rect(20 - width / 4, height - 170, 300, 150, 20)
}