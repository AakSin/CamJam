// We need the file system here
let fs = require("fs");

// Express is a node module for building HTTP servers
let express = require("express");
let app = express();
const { instrument } = require("@socket.io/admin-ui");

// CORS middleware
let cors = require("cors");
app.use(
  cors({
    origin: /p5js\.org$/,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, letious SmartTVs) choke on 204
  })
);

const maxPlayers = 4;

// Tell Express to look in the "public" folder for any files first
app.use("/", express.static("public"));


app.use("/:roomName", express.static("public/jamground"));
app.use("/:roomName/roomFull", (req,res)=>{
  res.send("This room is at it's full 4 player capacity")
});

// If the user just goes to the "route" / then run this function
// app.get("/", function (req, res) {
//   //res.send('Hello World!')
//   res.redirect("https://github.com/vanevery/p5.simplesimplepeer");
// });

// Here is the actual HTTP server
// In this case, HTTPS (secure) server
let http= require("http");



// We pass in the Express object and the options object
let httpServer = http.createServer(app);

let port = process.env.PORT || 3000;
// Default HTTPS port
httpServer.listen(port, ()=>{
  // console.log('Server listening on port ', port);
});

// WebSocket Portion
// WebSockets work with the HTTP server
let io = require("socket.io");

io = new io.Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
}); // use socket.io on the http app

instrument(io, {
  auth: false,
});

let rooms = {};

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on("connection", (socket) => {
  // console.log("We have a new client", socket.id);

  socket.on("room_connect", function (room) {
    // // console.log(Date.now(), socket.id, room, "room_connect");

    if (!rooms.hasOwnProperty(room)) {
      // console.log(Date.now(), socket.id, "room doesn't exist, creating it");
      rooms[room] = [];
    }
    console.log(rooms[room].length)
  if(rooms[room].length<4){
    rooms[room].push(socket);
    socket.room = room;

    // console.log(Date.now(), socket.id, rooms);

    let ids = [];
    for (let i = 0; i < rooms[socket.room].length; i++) {
      ids.push(rooms[socket.room][i].id);
    }
  
    // console.log(Date.now(), socket.id, "ids length: " + ids.length);
    socket.emit("listresults", ids);
    }else{
      io.to(socket.id).emit("redirect");
    }
  });

  socket.on("list", function () {
    let ids = [];
    for (let i = 0; i < rooms[socket.room].length; i++) {
      ids.push(rooms[socket.room][i].id);
    }
    // console.log(Date.now(), socket.id, "ids length: " + ids.length);
    socket.emit("listresults", ids);
  });

  // Relay signals back and forth
  socket.on("signal", (to, from, data) => {
    //console.log("SIGNAL", to, data);
    let found = false;
    for (let i = 0; i < rooms[socket.room].length; i++) {
      //console.log(rooms[socket.room][i].id, to);
      if (rooms[socket.room][i].id == to) {
        //console.log("Found Peer, sending signal");
        rooms[socket.room][i].emit("signal", to, from, data);
        found = true;
        break;
      }
    }
    // if (!found) {
    // 	console.log("never found peer");
    // }
  });
  socket.on("instrumentInfo", (data) => {
    if (rooms[socket.room]) {
      // Check on this
      // Tell everyone first
      instrumentTracker = {};

      for (let i = 0; i < rooms[socket.room].length; i++) {
        if (rooms[socket.room][i].id == socket.id) {
          rooms[socket.room][i].instrumentInfo = data;
        }
        instrumentTracker[rooms[socket.room][i].id] =
          rooms[socket.room][i].instrumentInfo;
      }
    }

    io.sockets.emit("instrumentList", instrumentTracker);
  });
  socket.on("disconnect", function () {
    // console.log(Date.now(), socket.id, "Client has disconnected");
    if (rooms[socket.room]) {
      // Check on this
      // Tell everyone first
      let which = -1;
      for (let i = 0; i < rooms[socket.room].length; i++) {
        if (rooms[socket.room][i].id != socket.id) {
          rooms[socket.room][i].emit("peer_disconnect", socket.id);
        } else {
          which = i;
        }
      }
      // Now remove from array
      if (rooms[socket.room][which].id == socket.id) {
        rooms[socket.room].splice(which, 1);
      }

      // This could fail if someone joins while the loops are in progress
      // Should be using associative arrays all the way around here
    }
  });
});
