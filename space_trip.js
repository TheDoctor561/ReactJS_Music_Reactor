var cols, rows;
var scl = 40;
var w = 800;
var h = 900;
var song;
var amp;

var sunOn = true; 
var starsOn = true; 

let sun_img, stars;

var back; 

var flying = 0;
// Initialization of primary color
var pr = 226; 
var pg = 49; 
var pb = 232; 
// Initialization of background color  
var br = 4;
var bg = 0; 
var bb = 130; 

// placeholder variables for user to change color to their own
var upr = pr; 
var upg = pg; 
var upb = pb; 
var ubr = br; 
var ubg = bg; 
var ubb = bb; 

var uprInput; 
var upgInput; 
var upbInput; 

var terrain = [];

let button; 

function setup() {
  sun_img = loadImage('sun.png');
  stars = loadImage('stars.png');
  dim = width / 2;
  song = loadSound('eclipse.mp3');
  createCanvas(windowWidth, windowHeight, WEBGL);
  cols = w / scl;
  rows = h / scl;
  console.log(rows); 

  button = createButton('change background');
  button.position(19, 19);
  button.mousePressed(updateBackground);

  uprInput = createInput('Red', int); 
  uprInput.position(19, 38);
  upgInput = createInput('Green', int); 
  upgInput.position(19, 57);
  upbInput = createInput('Blue', int); 
  upbInput.position(19, 76);

  back = createImage(1, 200);
  back.loadPixels();
  for (let i = 0; i <  back.height; i++) {
    for (let j = 0; j <  back.width; j++) {
      back.set(j, i, color(pr, pg, pb));
      
      let per =  back.height * 9/10; 
      let perN =   back.height * 8/10; 
      
      if (i < perN){
        let r = map(i, 0, perN, br, pr, true);
        let g = map(i, 0, perN, bg, pg, true);
        let b = map(i, 0, perN, bb, pb, true);
        back.set(j, i, color(r, g, b));       
      } else if ( i < perN && i < per) {
        back.set(j, i, color(pr, pg, pb));
      } else {
        let r = map(i, (per),  back.height, pr, 0, true);
        let g = map(i, (per),  back.height, pg, 0, true);
        let b = map(i, (per),  back.height, pb, 0, true);
        back.set(j, i, color(r, g, b));
      }
    }
  }
  back.updatePixels();


  amp = new p5.Amplitude();

  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }
}


function mousePressed() {
  if (song.isPlaying()) {
    // .isPlaying() returns a boolean
    song.pause();

  } else {
    song.play();

  }
}

function updateBackground (){
  upr = uprInput.value(); 
  uprInput.value('Red');
  upg = upgInput.value(); 
  upgInput.value('Green');
  upb = upbInput.value(); 
  upbInput.value('blue');

  back = createImage(1, 200);
  back.loadPixels();
  for (let i = 0; i < back.height; i++) {
    for (let j = 0; j < back.width; j++) {
      back.set(j, i, color(upr, upg, upb));
    }
  }
  back.updatePixels();

}
function restoreDefaults(){
  for (let i = 0; i <  back.height; i++) {
    for (let j = 0; j <  back.width; j++) {
      back.set(j, i, color(pr, pg, pb));
      
      let per =  back.height * 9/10; 
      let perN =   back.height * 8/10; 
      
      if (i < perN){
        let r = map(i, 0, perN, br, pr, true);
        let g = map(i, 0, perN, bg, pg, true);
        let b = map(i, 0, perN, bb, pb, true);
        back.set(j, i, color(r, g, b));       
      } else if ( i < perN && i < per) {
        back.set(j, i, color(pr, pg, pb));
      } else {
        let r = map(i, (per),  back.height, pr, 0, true);
        let g = map(i, (per),  back.height, pg, 0, true);
        let b = map(i, (per),  back.height, pb, 0, true);
        back.set(j, i, color(r, g, b));
      }
    }
  }
  back.updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0); 
}

function draw() {
  imageMode(CENTER);

  let z = - 450; 

  let level = amp.getLevel();

  // Adjust terrain size
  let size = map(level, 0, 0.3, 0.05, 1);

  let circSize = map(level, 0, 0.3, 0, 1);
 

  background(0);

  fill(20, 0, 255);

  // Background 
  push();
  translate(0, 0, z);
  image(back, 0 , -400, 3000, 1350); 
  pop(); 
  

  // Stars image
  if (starsOn){
    push();
    translate(0, 0, z);
    //tint(255, 255 * circSize);
    image(stars, 0, 0, 3800, 3200);
    pop();
  } 

  // Sun image
  if (sunOn){
    push();
    translate(0, 0, z);
    image(sun_img, 0, -150, 1300, 1300);
    pop();
  }
  
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
  translate(0, 120);
  // Adjust rotation and position of rectangle 
  rotateX(PI / 2);


  noFill();

  // Adjust height of the floor
  translate(-w / 2, 300);
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
