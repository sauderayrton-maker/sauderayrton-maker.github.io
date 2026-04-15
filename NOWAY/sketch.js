// walker oop demo

class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = "red";
    this.speed = 5;
    this.diameter = 2;
  }

  display() {
    stroke(this.color);
    fill(this.color);
    circle(this.x, this.y, this.diameter);
  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      this.x += this.speed;
    } else if (choice < 50) {
      this.x -= this.speed;
    } else if (choice < 75) {
      this.y += this.speed;
    } else if (choice < 100) {
      this.y -= this.speed;
    }
  }
}

// let tyler;
// let audrey;
// only 2 walkers

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   tyler = new Walker(width / 2, height / 2);
//   audrey = new Walker(300, 500);
// }

// function draw() {
//   tyler.move();
//   tyler.display();
//   audrey.color = "blue";
//   audrey.move();
//   audrey.display();
// }

let theWalkers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  for (let someWalker of theWalkers) {
    someWalker.move();
    someWalker.display();
  }
}

function mousePressed() {
  let theGuy = new Walker(mouseX, mouseY);
  theGuy.color = color(random(255), random(255), random(255));
  theWalkers.push(theGuy);
}
