// collide 2d demo

function setup() {
  createCanvas(windowWidth, windowHeight);
}

let hit = false;

function draw() {
    background(255);
    rect(200, 200, 100, 150);
    circle(mouseX, mouseY, 100);

    hit = collideRectCircle(200, 200, 100, 150, mouseX, mouseY, 100);

    // Use vectors as input:
    // const mouse      = createVector(mouseX, mouseY);
    // const rect_start = createVector(200, 200);
    // const rect_size  = createVector(100, 150);
    // const radius     = 100;
    // hit = collideRectCircleVector(rect_start, rect_size, mouse, radius);

    stroke(hit ? color('red') : 0);
    print('colliding?', hit);
}