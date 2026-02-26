// image demo

let cheetosImg;

function preload() {
  cheetosImg = loadImage("cheetos.jpg");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  image(cheetosImg, mouseX, mouseY, cheetosImg.width*0.5, cheetosImg.height*0.5);
}
