const socket = io();
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", {desynchronized: true, alpha: false});
let point;
let remotePoint;
let user = {
    id: null,
    color: "Black"
};

let activeUsers = new Map();

socket.on('connect',() => {
    user.id=socket.id;
})

socket.on('new user', data =>{
    activeUsers=new Map(data);
});

socket.on('mouse first click', data =>{
    activeUsers.get(data.id).point={
        x:data.x,
        y:data.y
    };
});

socket.on('mouse move', data =>{
    currentUser=activeUsers.get(data.id);
    ctx.beginPath();
    ctx.moveTo(currentUser.point.x, currentUser.point.y);
    ctx.lineTo(data.x, data.y);
    ctx.strokeStyle = "Red";
    ctx.stroke();
    currentUser.point = { x: data.x, y: data.y};
});

function getPoint(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.offsetX,
    y: e.offsetY 
    };
};


canvas.addEventListener("pointerdown", (e) => {
  point = getPoint(e);
  socket.emit('mouse first click',point);
});

canvas.addEventListener("pointermove", (e) => {
  if (!point)
    return;
  const events = e.getCoalescedEvents();
  events.forEach((e) => {
    const new_point = getPoint(e);
    console.log(new_point);
    socket.emit('mouse move',new_point);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(new_point.x, new_point.y);
    ctx.strokeStyle = user.color;
    ctx.stroke();
    point = new_point;
  });

});
canvas.addEventListener("pointerup", (e) => {
  point = null;
});

const angle = screen.orientation.angle % 360;

width = window.innerWidth * 0.9;
height = window.innerHeight * 0.8;
if (angle % 180 == 90) {
  canvas.width = height;
  canvas.height = width;
} else {
  canvas.width = width;
  canvas.height = height;
}

function clear_canvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);
}
clear_canvas();