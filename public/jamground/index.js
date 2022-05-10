// This is a test of the p5LiveMedia webrtc library and associated service.
let font;
let myVideo;
let p5l;
let clientId;
// let instrumentList;
let drumLabels = ["crash", "kick", "snare", "hihat"];
let pianistCamClient;
let drummerCamClient;
let guitaristCamClient;

// Open this sketch up 2 times to send video back and forth
window.addEventListener("load", () => {
  const changeButton = document.querySelector("#change");
  changeButton.addEventListener("click", () => {
    instrument = document.querySelector(
      'input[name="instrument"]:checked'
    ).value;
    if (instrument == "piano") {
      p5l.socket.emit("instrumentInfo", "Pianist");
      if (pianistCamClient) {
        videoStreams[0] = pianistCamClient;
      } else {
        pianistCamClient = new PianistCam(myVideo, clientId);
        videoStreams[0] = pianistCamClient;
      }
    } else if (instrument == "guitar") {
      p5l.socket.emit("instrumentInfo", "Guitarist");

      if (guitaristCamClient) {
        videoStreams[0] = guitaristCamClient;
      } else {
        guitaristCamClient = new GuitaristCam(myVideo, clientId);
        videoStreams[0] = guitaristCamClient;
      }
    } else if (instrument == "drums") {
      p5l.socket.emit("instrumentInfo", "Drummer");

      if (drummerCamClient) {
        videoStreams[0] = drummerCamClient;
      } else {
        drummerCamClient = new DrummerCam(myVideo, clientId);
        videoStreams[0] = drummerCamClient;
      }
    }
    videoStreams[0].p5l = p5l;
  });
});

roomCode = window.location.pathname;
roomCode = roomCode.substring(1, roomCode.length - 1);
//listen for confirmation
let p5lset = false;
let videoStreams = [];
let crash, hihat, snare, kick;

function preload() {
  crash = loadSound("assets/crash.wav");
  kick = loadSound("assets/kick.wav");
  snare = loadSound("assets/snare.wav");
  hihat = loadSound("assets/hihat.wav");

  c4 = loadSound("assets/c4.mp3");
  e4 = loadSound("assets/e4.mp3");
  g4 = loadSound("assets/g4.mp3");
  b5 = loadSound("assets/b5.mp3");
  d5 = loadSound("assets/d5.mp3");

  guitar1 = loadSound("assets/guitar1.m4a");
  guitar2 = loadSound("assets/guitar2.m4a");
  guitar3 = loadSound("assets/guitar3.m4a");
  guitar4 = loadSound("assets/guitar4.m4a");
  guitar5 = loadSound("assets/guitar5.m4a");
  font = loadFont("assets/raleway.ttf");
}

function setup() {
  createCanvas(window.innerWidth, 0.95 * window.innerHeight);
  // pixelDensity(1);

  // let constraints = {
  //   video: {
  //     mandatory: {
  //       minWidth: (width * 2) / 3,
  //       minHeight: height,
  //     },
  //   },
  //   audio: false,
  // };
  myVideo = createCapture(VIDEO, function (stream) {
    print(window.location.hostname);
    p5l = new p5LiveMedia(
      this,
      "CAPTURE",
      stream,
      roomCode,
      window.location.hostname
    );

    p5l.on("stream", gotStream);
    p5l.on("data", gotData);
    p5l.on("disconnect", gotDisconnect);
    p5l.socket.on("instrumentList", (data) => {
      // print(data);
      instrumentList = data;
      print(instrumentList);

      print(videoStreams.length);
      for (let i = 1; i < videoStreams.length; i++) {
        for (socketId in instrumentList) {
          // print(socketId);
          if (socketId == videoStreams[i].socketId) {
            videoStreams[i].instrumentName = instrumentList[socketId];
          }
        }
      }
    });
  });

  // p5l.socket.on("invalidRoom", () => {
  //   console.log("invalid room");
  // });
  myVideo.muted = true;
  myVideo.hide();
  // myVideo.size((window.innerWidth * 2) / 3, window.innerHeight);
  if (myVideo != null) {
    pianistCamClient = new PianistCam(myVideo, "temp");

    videoStreams.push(pianistCamClient);
    document.querySelector('input[value="piano"]').checked = true;
  }
}

function draw() {
  background("white");
  // rect(0, 0, myVideo.width, myVideo.height);

  // image(myVideo, 0, 0);
  // print(videoStreams);
  for (let i = 1; i < videoStreams.length; i++) {
    videoStreams[i].draw((width * 2) / 3, ((i - 1) * height) / 3);
    textFont(font);
    let textBox = font.textBounds(videoStreams[i].instrumentName, 0, 0, 20);
    fill("black");
    rect(
      (width * 2) / 3,
      ((i - 1) * height) / 3 + videoStreams[i].height - textBox.h - 10,
      textBox.w + 10,
      textBox.h + 10
    );
    fill("white");
    textSize(20);
    text(
      videoStreams[i].instrumentName,
      (width * 2) / 3,
      ((i - 1) * height) / 3 + videoStreams[i].height - 5
    );
    // videoStreams[i].draw();
    // videoStreams[i].move();
  }

  videoStreams[0].draw(0, 0);
  if (!p5lset) {
    videoStreams[0].p5l = p5l;
    if (videoStreams[0].p5l) {
      clientId = p5l.socket.id;
      videoStreams[0].socketId = clientId;
      p5lset = true;
    }
  }
  if (getInstrumentName(videoStreams[0]) == "Drummer") {
    let rectHeight =
      videoStreams[0].video.height * videoStreams[0].heightMultiplier;
    let rectWidth =
      videoStreams[0].video.width * videoStreams[0].widthMultiplier;

    for (let i = 0; i < 4; i++) {
      stroke("white");
      fill(i * 50, 100, 100, 100);

      rect((i * rectWidth) / 4, 0, rectWidth / 4, rectHeight);
      noStroke();
      fill("white");
      text(drumLabels[i], (i * rectWidth) / 4 + rectWidth / 10, rectHeight / 2);
    }
  }
  // videoStreams[0].move();
}

// We got a new stream!
function gotStream(stream, id) {
  // This is just like a video/stream from createCapture(VIDEO)
  stream.hide();
  videoStreams.push(new Cam(stream, id));
  for (let i = 1; i < videoStreams.length; i++) {
    for (socketId in instrumentList) {
      // print(socketId);
      if (socketId == videoStreams[i].socketId) {
        videoStreams[i].instrumentName = instrumentList[socketId];
      }
    }
  }
}
function gotData(data, id) {
  print(id + ":" + data);

  // If it is JSON, parse it
  let d = JSON.parse(data);
  print(d);
  if (d == "piano1") {
    c4.play();
  }
  if (d == "piano2") {
    e4.play();
  }
  if (d == "piano3") {
    g4.play();
  }
  if (d == "piano4") {
    b5.play();
  }
  if (d == "piano5") {
    d5.play();
  }
  if (d == "kick") {
    kick.play();
  }
  if (d == "crash") {
    crash.play();
  }
  if (d == "hihat") {
    hihat.play();
  }
  if (d == "snare") {
    snare.play();
  }
}
function gotDisconnect(id) {
  for (let i = 1; i < videoStreams.length; i++) {
    if (videoStreams[i].socketId == id) {
      videoStreams.splice(i, 1);
      break;
    }
  }
}

function gotInstrumentList(data) {
  console.log(data);
}
function getInstrumentName(instrumentVar) {
  if (instrumentVar instanceof DrummerCam) {
    return "Drummer";
  } else if (instrumentVar instanceof PianistCam) {
    return "Pianist";
  } else if (instrumentVar instanceof GuitaristCam) {
    return "Guitarist";
  }
}
