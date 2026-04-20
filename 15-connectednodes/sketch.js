// Connected Nodes

let nodes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  for (let node of nodes) {
    node.update();
    node.connect(nodes);
  }
  for (let node of nodes) {
    node.display();
  }
}

function mousePressed() {
  nodes.push(new MovingPoint(mouseX, mouseY));
}

class MovingPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xTime = random(1000);
    this.yTime = random(1000);
    this.deltaTime = 0.05;
    this.radius = 35;
    this.color = color(random(255), random(255), random(255));
    this.speed = 5;
    this.reach = 100;
    this.minR = 35;
    this.maxR = 50;
  }

  display() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.radius);
  }

  update() {
    this.move();
    this.wrap();
    this.expand();
  }

  move() {
    let dx = noise(this.xTime);
    let dy = noise(this.yTime);

    dx = map(dx, 0, 1, -this.speed, this.speed);
    dy = map(dy, 0, 1, -this.speed, this.speed);

    this.x += dx;
    this.y += dy;

    this.xTime += this.deltaTime;
    this.yTime += this.deltaTime;
  }

  wrap() {
    if (this.x < 0) {
      this.x = width;
    }
    if (this.x > width) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = height;
    }
    if (this.y > height) {
      this.y = 0;
    }
  }

  connect(nodesArray) {
    for (let node of nodesArray) {
      if (node !== this) {
        let distance = dist(this.x, this.y, node.x, node.y);
        if (distance < this.reach) {
          stroke(this.color);
          strokeWeight(5);
          line(this.x, this.y, node.x, node.y);
        }
      }
    }
  }

  expand() {
    let mouseDistance = dist(this.x, this.y, mouseX, mouseY);
    if (mouseDistance < this.reach) {
      let theSize = map(mouseDistance, 0, this.reach, this.maxR, this.minR);
      this.radius = theSize;
    } else {
      this.radius = this.minR;
    }
  }
}
