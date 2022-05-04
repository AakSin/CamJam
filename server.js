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

// initialize database
let Datastore = require("nedb");
let db = new Datastore({
  filename: "rooms.db",
}); //creates a new one if needed
db.loadDatabase(); //loads the db with the data

const maxPlayers = 4;

// Tell Express to look in the "public" folder for any files first
app.use("/", express.static("public"));
app.use("/:roomName", express.static("public/jamground"));

// If the user just goes to the "route" / then run this function
// app.get("/", function (req, res) {
//   //res.send('Hello World!')
//   res.redirect("https://github.com/vanevery/p5.simplesimplepeer");
// });

// Here is the actual HTTP server
// In this case, HTTPS (secure) server
let https = require("https");

// Security options - key and certificate
let options = {
  key: fs.readFileSync("local.key"),
  cert: fs.readFileSync("local.cert"),
};

// We pass in the Express object and the options object
let httpServer = https.createServer(options, app);

// Default HTTPS port
httpServer.listen(443);

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

let testRoom = {
  roomCode: "test",
  currentUsers: 0,
  playersInfo: {},
};

db.insert(testRoom, function (err, newDoc) {
  // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined
});
let rooms = {};
// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on("connection", (socket) => {
  console.log("We have a new client", socket.id);
  socket.on("createRoom", (roomCode) => {
    db.findOne({ roomCode: roomCode }, function (err, doc) {
      console.log(doc);
      if (doc == null) {
        let newRoom = {
          roomCode: roomCode,
          currentUsers: 1,
          playersInfo: {
            [socket.id]: "pianist",
          },
        };
        db.insert(newRoom, function (err, newDoc) {
          // Callback is optional
          // newDoc is the newly inserted document, including its _id
          console.log(newDoc);
          // newDoc has no key called notToBeSaved since its value was undefined
        });
        io.to(socket.id).emit("roomCreated", roomCode);
      } else {
        io.to(socket.id).emit("roomCreated", roomCode);
      }
    });
  });

  socket.on("room_connect", function (room) {
    console.log(Date.now(), socket.id, room, "room_connect");
    db.findOne({ roomCode: room }, function (err, doc) {
      console.log(doc);
      if (doc == null) {
        console.log("aaaaaaaaa");
        socket.emit("invalidRoom");
      }
    });
    if (!rooms.hasOwnProperty(room)) {
      console.log(Date.now(), socket.id, "room doesn't exist, creating it");
      rooms[room] = [];
    }

    rooms[room].push(socket);
    socket.room = room;

    console.log(Date.now(), socket.id, rooms);

    let ids = [];
    for (let i = 0; i < rooms[socket.room].length; i++) {
      ids.push(rooms[socket.room][i].id);
    }
    console.log(Date.now(), socket.id, "ids length: " + ids.length);
    socket.emit("listresults", ids);
  });

  socket.on("list", function () {
    let ids = [];
    for (let i = 0; i < rooms[socket.room].length; i++) {
      ids.push(rooms[socket.room][i].id);
    }
    console.log(Date.now(), socket.id, "ids length: " + ids.length);
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

  socket.on("disconnect", function () {
    console.log(Date.now(), socket.id, "Client has disconnected");
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
