var cols, rows;
var scl = 60;
var w = 2200;
var h = 1100;
var song;
var amp;

let img, sun_img, stars;

var flying = 0;

var terrain = [];

function setup() {
  img = loadImage('background.jpg');
  sun_img = loadImage('sun.png');
  stars = loadImage('stars.png'); 
  dim = width / 2;
  song = loadSound('beyond.mp3');
  createCanvas(windowWidth, windowHeight, WEBGL);
  cols = w / scl;
  rows = h / scl;



  background(255);

  amp = new p5.Amplitude();

  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; 
    }
  }
}


function mousePressed() {
  if (song.isPlaying()) {
    song.pause();

  } else {
    song.play();

  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

}


function draw() {
  imageMode(CENTER);

  let level = amp.getLevel();

  // Adjust terrain size
  let size = map(level, 0, 0.3, 0.05, 1);

  let circSize = map(level, 0, 0.3, 0, 1);

  background(0);

  fill(20, 0, 255);
  // Background image
  push();
  translate(0, 0, -450);
  image(img, 0, -50, windowWidth + 1100, windowHeight + 500);
  pop();

  // Stars image
  push();
  translate(0, 0, -450);
  tint(255, 255 * circSize);
  image(stars, 0, -1500, windowWidth + 1000, windowHeight + 2000);
  pop();

  // Sun image
  push();
  translate(0, 0, -450);
  image(sun_img, 0, -110, 1000, 1000);
  pop();


  flying -= 0.05;
  var yoff = flying;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {

      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 100);
      xoff += 0.2;
    }
    yoff += 0.2;
  }


  // Adjust height of camera 
  translate(0, 140);
  // Adjust rotation and position of rectangle 
  rotateX(PI / 2);


  noFill();

  // Adjust height of the floor
  translate(-w/2 + 10, -130);
  stroke(242, 0, 255);
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {

      vertex(x * scl, y * scl, terrain[x][y] * size);
      vertex(x * scl, (y + 1) * scl, terrain[x][y] * size);
    }
    endShape();

  }


}
