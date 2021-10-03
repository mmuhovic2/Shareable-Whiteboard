const socket = io();

function setup() {
  createCanvas(400, 400);
  background(0);
 
  socket.on('mouse', data => {
      console.log("Got: " + data.x + " " + data.y);
      fill(0,0,255);
      noStroke();
      ellipse(data.x, data.y, 20, 20);
    }
  );
}

function draw() {

}

function mouseDragged() {
  fill(255);
  noStroke();
  ellipse(mouseX,mouseY,20,20);
  sendmouse(mouseX,mouseY);
}

function sendmouse(xpos, ypos) {
  
  console.log("sendmouse: " + xpos + " " + ypos);
  
  var data = {
    x: xpos,
    y: ypos
  };

  socket.emit('mouse',data);
}