// recursive circles demo

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  drawCircle(width / 2, width / 2);
}

function drawCircle(x, r) {
  let rc = random(255);
  let gc = random(255);
  let bc = random(255);

  fill(rc, gc, bc);
  circle(x, height / 2, r * 2);
  if (r > 1) {
    drawCircle(x - r / 2, r / 2);
    drawCircle(x + r / 2, r / 2);
  }
}
