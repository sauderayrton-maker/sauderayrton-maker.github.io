// sierpinski triangle

let triI = [
  { x: 800, y: 50 },
  { x: 50, y: 910 },
  { x: 1550, y: 910 },
];

let theDepth = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  sierpinski(triI, theDepth);
}

function draw() {}

function sierpinski(points, depth) {
  triangle(
    points[0].x,
    points[0].y,
    points[1].x,
    points[1].y,
    points[2].x,
    points[2].y,
  );

  if (depth > 0) {
    sierpinski(
      [
        points[0],
        midPoint(points[0], points[1]),
        midPoint(points[0], points[2]),
      ],
      depth - 1,
    );
    sierpinski(
      [
        points[1],
        midPoint(points[0], points[1]),
        midPoint(points[1], points[2]),
      ],
      depth - 1,
    );
    sierpinski(
      [
        points[2],
        midPoint(points[0], points[2]),
        midPoint(points[1], points[2]),
      ],
      depth - 1,
    );
  }
}

function midPoint(point1, point2) {
  let midx = (point1.x + point2.x) / 2;
  let midy = (point1.y + point2.y) / 2;
  return { x: midx, y: midy };
}

function mousePressed() {
  if (theDepth < 8) {
    theDepth++;
    background("white");
    sierpinski(triI, theDepth);
  }
}
