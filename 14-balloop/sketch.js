// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = random(15, 30);
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x - this.radius < 0 || this.x + this.radius > width) {
      this.dx *= -1;
    }
    if (this.y - this.radius < 0 || this.y + this.radius > height) {
      this.dy *= -1;
    }
  }
  bounceOff(otherBall) {
    let radiisum = this.radius + otherBall.radius;
    let diistanceApart = dist(this.x, this.y, otherBall.x, otherBall.y);
    if (diistanceApart < radiisum) {
      let angle = atan2(otherBall.y - this.y, otherBall.x - this.x);
      let cosA = cos(angle);
      let sinA = sin(angle);
      let vx1 = this.dx * cosA + this.dy * sinA;
      let vy1 = this.dy * cosA - this.dx * sinA;
      let vx2 = otherBall.dx * cosA + otherBall.dy * sinA;
      let vy2 = otherBall.dy * cosA - otherBall.dx * sinA;
      this.dx = vx2 * cosA - vy2 * sinA;
      this.dy = vy2 * cosA + vx2 * sinA;
      otherBall.dx = vx1 * cosA - vy1 * sinA;
      otherBall.dy = vy1 * cosA + vx1 * sinA;
    }
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, this.radius * 2);
  }
}

let balls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  for (let ball of balls) {
    ball.move();
    for (let otherBall of balls) {
      if (ball !== otherBall) {
        ball.bounceOff(otherBall);
      }
    }
    ball.display();
  }
}

function mousePressed() {
  balls.push(new Ball(mouseX, mouseY));
}
