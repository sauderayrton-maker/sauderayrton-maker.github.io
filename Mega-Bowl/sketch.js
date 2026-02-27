let speed = 2;
let speed2 = 2;
let speed3 = 3; 
let speedR = 4;

let deltaX, deltaY;
let ballX, ballY;
let playerX, playerY;
let defendX, defendY;
let recieverX, recieverY;
let radian;
let distance;
let gameStarted = false;
let hasBall = true;

function setup() {
  createCanvas(400, 700);
  noStroke();
  playerX = width / 2;
  playerY = height - 50;
  defendX = width / 2;
  defendY = height / 2;
  recieverX = width / 4;
  recieverY = height - 50;
}

function draw() {
  background(255);
  field();
  endzone();

  if (gameStarted) {
    tackle();
  } 
  else {
    showStartScreen();
  }
}


function showStartScreen() {
  fill(0);
  textAlign(CENTER);
  textSize(20);
  text("Press SPACE to Start", width / 2, height / 2);
}

function tackle() {
  distance = Math.sqrt((playerX - defendX) ** 2 + (playerY - defendY) ** 2);

  if (distance > 1 && playerY > 105) {
    player();
    defender();
    reciever();
  } 
  else if (distance < 1) {
    fill(0);
    textAlign(CENTER);
    textSize(20);
    text("Tackled!!!!", width / 2, height / 2);
  } 
  else {
    fill(0);
    textAlign(CENTER);
    textSize(20);
    text("Touchdown!!!!", width / 2, height / 2);
  }
}


function field() {
  fill(124, 252, 0); // Grass Green
  rect(10, 130, 380, 556);
}

function endzone() {
  fill(0, 0, 128);
  rect(10, 10, 380, 105);
  fill(255);
  textAlign(CENTER);
  textSize(50);
  textStyle("bold");
  text("MEGA BOWL", width / 2, 75);
}

function player() {
  fill(0, 0, 128);
  ellipse(playerX, playerY, 20, 15);
  fill(255);
  circle(playerX,playerY, 10);
  control();
}

function defender() {
  fill(255, 0, 0);
  ellipse(defendX, defendY, 25, 15);
  fill(255);
  circle(defendX, defendY, 12);
  track();
}

function reciever(){
  fill(0, 0, 255);
  rect(recieverX, recieverY, 15);
  rout();
}

function ball() {
  fill(150, 75, 0);
  rect(ballX, ballY, 5, 7.5);
}


function control() {
  if (keyIsDown(87)) {
    playerY -= speed;
  }
  if (keyIsDown(83)) {
    playerY += speed;
  }
  if (keyIsDown(65)) {
    playerX -= speed;
  }
  if (keyIsDown(68)) {
    playerX += speed;
  }
}

function track() {
  deltaX = playerX - defendX;
  deltaY = playerY - defendY;
  
  radian = Math.atan2(deltaY, deltaX); // pak math
  defendX += speed2 * Math.cos(radian);
  defendY += speed2 * Math.sin(radian);
}

function rout(){
  if (recieverY > 100){
    recieverY -= speedR;
  }
  else if (recieverX <= width - 20){
    recieverX += speedR;
  }
}

function keyPressed() {
  if (key === " ") {
    gameStarted = true;
  }
}
