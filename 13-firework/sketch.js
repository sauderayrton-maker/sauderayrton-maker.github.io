// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.radius = random(5, 10);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.opacity = 255;
  }

  update() {
    this.opacity -= 5;
    this.x += this.dx;
    this.y += this.dy;
  }

  clean() {
    if (this.opacity <= 0) {
      theFireworks.splice(theFireworks.indexOf(this), 1);
    }
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.opacity);
    circle(this.x, this.y, this.radius * 2);
  }
}

let theFireworks = [];
const NUM_FIREWORKS = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  for (let firework of theFireworks) {
    firework.update();
    firework.display();
    firework.clean();
  }
}

function mousePressed() {
  for (let i = 0; i < NUM_FIREWORKS; i++) {
    let fireworks = new Particle(mouseX, mouseY);
    theFireworks.push(fireworks);
  }
}
