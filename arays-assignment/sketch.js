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

function preload() {
  engineSound = loadSound('sounds/engine.mp3');
  crashSound = loadSound('sounds/crash.mp3');
  backgroundMusic = loadSound('sounds/music.mp3');
} //was not working

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
    if (!backgroundMusic.isPlaying()) {
      backgroundMusic.loop();
    }
    start();
  }
  if (gameState === 'play'){
    background(160, 75, 45);
    drawRoad();
    roadLines();
    car();
    spawnBadTraffic();
    goFast();
    control();
    hud();
  }
  if (gameState === 'gameOver') {
    end();
  }
}

//----- START BUTTON -----//
function keyPressed() {
  if (keyCode === ENTER && gameState === 'startScreen') {
    gameState = 'play';
  }
  if (keyCode === ENTER && gameState === 'gameOver') {
    score = 0;
    currentSpeed = 0;
    trafficArray = [];
    cX = width/2 + ROADWIDTH/2;
    gameState = 'play';
  }
}

//----- MAKES THE ROAD -----//
function drawRoad(){
  fill(210, 180, 140);
  rect(width/2 - ROADWIDTH - ROADWIDTH / 10, 0, ROADWIDTH * 2 + 20, height);
  fill(45, 45, 50);
  rect(width/2 - ROADWIDTH, 0, ROADWIDTH * 2, height);
}

//----- MAKES THE ROAD LINES -----//
function roadLines(){
  fill(255, 230, 150);
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
  fill(200, 177, 95);
  rect(cX - cW/2, cY - cH/2, cW, cH, 8);

  fill(255, 230, 150);
  rect(cX - cW/2 + 5, cY - cH/2 + 15, cW - 10, cH - 30, 5);

  fill(25, 35, 45);
  rect(cX - cW/2 + 7, cY - cH/2 + 20, cW - 14, 15, 2);

  fill(25, 35, 45);
  rect(cX - cW/2 + 7, cY - cH/2 + 50, cW - 14, 10, 2);
}

//----- MAKES THE START SCREEN -----//

function start(){
  background(15, 15, 15);
  noStroke();
  textAlign(CENTER);
  textStyle(BOLD);
  fill(255, 160, 60);
  textSize(48);
  text("CAR GAME", width/2, height/2 - 40);
  textStyle(NORMAL);
  fill(160, 160, 160);
  textSize(16);
  text("hold space to pass", width/2, height/2 + 15);
  fill(200, 200, 200);
  textSize(16);
  text("press enter to start", width/2, height/2 + 45);
}

// ----- END SCREEN -----//
function end(){
  background(15, 15, 15);
  noStroke();
  textAlign(CENTER);
  textStyle(BOLD);
  fill(255, 70, 70);
  textSize(48);
  text("GAME OVER", width/2, height/2 - 40);
  textStyle(NORMAL);
  fill(160, 160, 160);
  textSize(16);
  text(floor(score) + "m", width/2, height/2 + 15);
  fill(200, 200, 200);
  textSize(16);
  text("press enter to restart", width/2, height/2 + 45);
}

//----- HUD -----//
function hud(){
//----- BACKING -----//
  fill(200, 205, 215);
  strokeWeight(3);
  stroke(130, 135, 145);
  circle(hudX + hudW / 2 - hudW / 4, hudY + hudH / 2 - hudH / 11 , hudW / 2 - hudH / 20);
  circle(hudX + hudW / 2 + hudW / 4, hudY + hudH / 2 - hudH / 11 , hudW / 2 - hudH / 20);
  stroke(245, 250, 255);
  fill(15, 15, 18, 230);
  circle(hudX + hudW / 2 - hudW / 4, hudY + hudH / 2 - hudH / 11 , hudW / 2 - hudH / 8);
  circle(hudX + hudW / 2 + hudW / 4, hudY + hudH / 2 - hudH / 11 , hudW / 2 - hudH / 8);
  noStroke();
 
  //----- SPEEDLABLE -----//
  textAlign(CENTER);
  fill(180, 180, 190);
  textSize(11);
  textStyle(BOLD);
  text("SPEED", hudX + hudW / 4, hudY + 45);
  textStyle(NORMAL);
 
  //----- COLOURCHANGING -----//
  if (currentSpeed >= 150) {
    fill(255, 80, 80);
  } 
  else if (currentSpeed >= 100) {
    fill(255, 200, 80);
  } 
  else {
    fill(120, 220, 255);
  }

  textSize(34);
  textStyle(BOLD);
  text(floor(currentSpeed), hudX + hudW / 4, hudY + hudH / 2); // floor is just rounding to the lower int
  textStyle(NORMAL);
 
  fill(100, 110, 140);
  textSize(11);
  text("KM/H", hudX + hudW / 4, hudY + hudH / 3 * 2);
 
  fill(180, 180, 190);
  textSize(11);
  textStyle(BOLD);
  text("DISTANCE", hudX + hudW - hudW / 4, hudY + 45);
  textStyle(NORMAL);
 
  if (fast) {
    fill(255, 80, 80);
  } 
  else {
    fill(120, 220, 255);
  }
  textSize(34);
  textStyle(BOLD);
  text(floor(score) + "m", hudX + hudW - hudW / 4, hudY + hudH / 2);
  textStyle(NORMAL);
}

function makeBadTaffic(){
  let lanes = random(0, 100);
  let startingPoint;

  if (lanes < 50) {
    startingPoint = width/2 - ROADWIDTH/2;
  }
  else{
    startingPoint = width/2 + ROADWIDTH/2;
  }

  let badDrivers = {
    x: startingPoint,
    y: -100,
    speed: random(2, 5),
    r: random(100, 255),
    g: random(50, 150),
    b: random(50, 150),
  };
  trafficArray.push(badDrivers);
}

function spawnBadTraffic() {
  if (frameCount % 60 === 0) {
    makeBadTaffic();
  }

  for (let t of trafficArray){
    if (fast) {
        t.y += t.speed + 10; 
      } 
      else {
        t.y += t.speed + 2;
      }
  fill(t.r, t.g, t.b);
  rect(t.x - cW/2, t.y - cH/2, cW, cH, 5);

  fill(25, 35, 45);
  rect(t.x - cW/2 + 7, t.y - cH/2 + 20, cW - 14, 15, 2);

  fill(25, 35, 45);
  rect(t.x - cW/2 + 7, t.y - cH/2 + 50, cW - 14, 10, 2);

  if (dist(cX, cY, t.x, t.y) < 60) {
        gameState = 'gameOver';
      }
  }
}