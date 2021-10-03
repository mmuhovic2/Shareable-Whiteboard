const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

let activeUsers = new Map();

io.on("connection", function (socket) {
  console.log("Made socket connection " + io.engine.clientsCount + ". - " + socket.id);
  
  activeUsers.set(socket.id, {
    color:"Black",
    point: null 
  });

  io.emit('new user', [... activeUsers]);

  socket.on('mouse first click', data => {
        activeUsers.get(socket.id).point=data;
        data={...data, id:socket.id};
        socket.broadcast.emit('mouse first click', data);
      }
    );
  
  socket.on('mouse move', data => {
        data={...data,id:socket.id};
        socket.broadcast.emit('mouse move', data);
      }
    );

  socket.on("disconnect", () => {
    activeUsers.delete(socket.id);
  });

});
