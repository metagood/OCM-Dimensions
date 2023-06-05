let z;

function setup() {
  createCanvas(720, 400);
  stroke(255);
  noLoop();
  z = height * 0.5;
}

function draw() {
  background(0);
  z = z - 4;
  if (z < 0) {
    z = height;
  }
  line(0, z, width, z);
}

function mousePressed() {
  redraw();
}