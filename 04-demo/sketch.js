// ball array demo

let ballArray = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(ball.r, ball.g, ball.b);
  for (let ball of ballArray) {
    //move
    ball.x += ball.dx;
    ball.y += ball.dy;

    //display
    fill(ball.r, ball.g, ball.b);
    circle(ball.x, ball.y, ball.radius *2);

    //teleport
    if (ball.x - ball.radius > width) {
      ball.x -= width - ball.radius;
    }
    if (ball.x + ball.radius < 0){
      ball.x += width + ball.radius;
    }
    if (ball.y - ball.radius > height)  {
      ball.y -= height - ball.radius;
    }
    if (ball.y + ball.radius < 0) {
      ball.y += height + ball.radius;
    }

  }
}

function mousePressed() {
  spawnBall(mouseX, mouseY);
}


function spawnBall(_x, _y) {
  let someBall = {
    x: _x,
    y: _y,
    dx: random(-5, 5),
    dy: random(-5, 5),
    radius: random(10, 30),
    r: random(0, 255),
    g: random(0, 255),
    b: random(0, 255),
  };
  ballArray.push(someBall);
}