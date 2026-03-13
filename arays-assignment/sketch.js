// car game (work in progress)
// Ayrton Sauder
// march 6 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


//-----CONSTANTS-----//
const ROADWIDTH = 100;
const LINESPEED = 10; 
const HORIZONTALSPEED = 5;
const SPEEDLIMIT = 80;

//-----VARIABLES-----//
let hudX, hudY;
let hudW = 350;
let hudH = 200;
let trafficArray = [];

let score = 0;
let fast = false;
let lineLoop = 0;

//-----CAR-----//
let cW = ROADWIDTH / 2 - 5;
let cH = 75;
let cX, cY;
let topSpeed = 181;
let currentSpeed = 0;

//----- GAMESTATE VARIABLES-----//
let gameState = 'startScreen';

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  cX = width/2 + ROADWIDTH/2;
  cY = height - height/4;
  hudX = width / 2 - hudW / 2;
  hudY = height - 0.2 * height;
}

function draw() {
  //----- GAMESTATE LOGIC -----//
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

//----- START BUTTON -----//
function keyPressed() {
  if (keyCode === ENTER && gameState === 'startScreen') {
    gameState = 'play';
  }
}

//----- MAKES THE ROAD -----//
function drawRoad(){
  fill(215, 215, 200);
  rect(width/2 - ROADWIDTH - ROADWIDTH / 10, 0, ROADWIDTH * 2 + 20, height);
  fill(0);
  rect(width/2 - ROADWIDTH, 0, ROADWIDTH * 2, height);
}

//----- MAKES THE ROAD LINES -----//
function roadLines(){
  fill(255, 210, 100); //yellow
  for (let i = -100; i < height + 100; i += 100){
    rect(width / 2 - 5, i + lineLoop, 10, 50);
  }

  // sets speed - lerp transitions between two numbers smoothly
  if (fast){
    lineLoop += LINESPEED * 2;
    score += 0.5;
    currentSpeed = lerp(currentSpeed, topSpeed, 0.05);
  }  
  else {
    lineLoop += LINESPEED;
    score += 0.1;
    currentSpeed = lerp(currentSpeed, SPEEDLIMIT, 0.05);
  }

  // starts loop over
  if (lineLoop > 100){
    lineLoop = 0;
  }
}

//----- MERGING SELECTOR -----// 
function goFast(){
  if (fast){
    mergeLeft();
  }
  else{
    mergeRight();
  }
}

//----- ADDS CAR CONTROL -----//
function control(){
  if (keyIsDown(32)) {
    fast = true;
  }
  else{
    fast = false;
  }
}

//----- LEFT LANE LOGIC -----//
function mergeLeft(){
  if (cX > width / 2 - ROADWIDTH  / 2){
    cX -= HORIZONTALSPEED;
  }
}

//----- RIGHT LANE LOGIC -----//
function mergeRight(){
  if (cX < width / 2 + ROADWIDTH  / 2){
    cX += HORIZONTALSPEED;
  }
}

//----- DRAWS THE PLAYER CAR -----//
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

//----- MAKES THE START SCREEN -----//
function start(){
  background(15, 15, 15);
  strokeWeight(2);
  stroke(60, 60, 80);
  fill(40, 40, 50, 200);
  rect(width / 2 - 250, height / 2 - 150, 500, 300, 20);
  noStroke();
  fill(0, 200, 255);
  textStyle(BOLD);
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

// ----- END SCREEN -----//
function end(){
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(100);
  text("game over", width/ 2, height/ 2);
}

//----- HUD -----//
function hud(){
//----- BACKING -----//
  strokeWeight(2);
  stroke(60, 60, 80);
  fill(40, 40, 50, 200);
  rect(hudX, hudY, hudW, hudH, 20);
  noStroke();
 
  //----- SPEEDLABLE -----//
  textAlign(CENTER);
  fill(100, 110, 140);
  textSize(11);
  textStyle(BOLD);
  text("SPEED", hudX + hudW / 4, hudY + 45);
  textStyle(NORMAL);
 
  //----- COLOURCHANGING -----//
  if (currentSpeed >= 150) {
    fill(255, 60, 60);
  } 
  else if (currentSpeed >= 100) {
    fill(255, 220, 60);
  } 
  else {
    fill(200, 210, 255);
  }

  textSize(52);
  textStyle(BOLD);
  text(floor(currentSpeed), hudX + hudW / 4, hudY + hudH / 2); // floor is just rounding to the lower int
  textStyle(NORMAL);
 
  fill(100, 110, 140);
  textSize(11);
  text("KM/H", hudX + hudW / 4, hudY + hudH / 3 * 2);
 
  // stroke(60, 65, 85);
  // strokeWeight(1);
  // line(hudX + 25, hudY + 160, hudX + hudW - 25, hudY + 160);
  // noStroke();
 
  fill(100, 110, 140);
  textSize(11);
  textStyle(BOLD);
  text("DISTANCE", hudX + hudW - hudW / 4, hudY + 45);
  textStyle(NORMAL);
 
  if (fast) {
    fill(0, 200, 255);
  } 
  else {
    fill(200, 210, 255);
  }
  textSize(36);
  textStyle(BOLD);
  text(floor(score) + "m", hudX + hudW - hudW / 4, hudY + hudH / 2);
  textStyle(NORMAL);
}
