// speed variables
let speed = 2;
let speed2 = 2.67;
let speed3 = 3; 
let speedR = 3;

//variables
let deltaX, deltaY;
let ballX, ballY;
let playerX, playerY;
let defendX, defendY;
let recieverX, recieverY;
let radian;
let distance;
let gameStarted = false;
let ballFlying = false;
let targetX, targetY;
let ballSpeed = 10;
let caught = false;

//setting the stage
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

//win or loose logic
function tackle() {
  distance = Math.sqrt((playerX - defendX) ** 2 + (playerY - defendY) ** 2);

  if (caught) {
    fill(0);
    textAlign(CENTER);
    textSize(20);
    text("CAUGHT!!!!", width / 2, height / 2);
  }
  else if (distance > 1 && playerY > 105) {
    player();
    defender();
    reciever();
    moveBall();
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
  
  stroke(255); //yard lines
  strokeWeight(2);
  for (let y = 130; y < 700; y += 50) {
    line(10, y, 390, y);
  }
  noStroke();
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
  ellipse(defendX, defendY, 20, 15);
  fill(255);
  circle(defendX, defendY, 10);
  track();
}

//person to run routs 
function reciever(){
  fill(0, 0, 128);
  ellipse(recieverX, recieverY, 20, 15);
  fill(255);
  circle(recieverX, recieverY, 10);
  rout();
}

//making a ball
function ball() {
  fill(150, 75, 0);
  ellipse(ballX, ballY, 7, 10);
}

// wasd controls
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

//defender logic
function track() {
  deltaX = playerX - defendX;
  deltaY = playerY - defendY;
  
  radian = Math.atan2(deltaY, deltaX); // pak math
  defendX += speed2 * Math.cos(radian);
  defendY += speed2 * Math.sin(radian);
}

//tells reciever where to go
function rout(){
  if (recieverY > 100){
    recieverY -= speedR;
  }
  else if (recieverX <= width - 20){
    recieverX += speedR;
  }
}

// starts game 
function keyPressed() {
  if (key === " ") {
    gameStarted = true;
  }
}

//throw ball control
function mousePressed() {
  if (gameStarted && !ballFlying) {
    ballX = playerX;
    ballY = playerY;
    targetX = mouseX;
    targetY = mouseY;
    ballFlying = true;
  }
}

// logic for ball catch
function moveBall() { // pak math
  if (ballFlying) {
    ball();
    let ballDeltaX = targetX - ballX; 
    let ballDeltaY = targetY - ballY;
    let ballRadian = Math.atan2(ballDeltaY, ballDeltaX);
    
    ballX += ballSpeed * Math.cos(ballRadian);
    ballY += ballSpeed * Math.sin(ballRadian);
    
    // Check if receiver catches ball
    let catchDist = dist(ballX, ballY, recieverX, recieverY);
    if (catchDist < 15) {
      caught = true;
      ballFlying = false;
    }
    
    // Stop ball if it reaches target
    if (dist(ballX, ballY, targetX, targetY) < 5) {
      ballFlying = false;
    }
  }
}
