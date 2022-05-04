// This is a test of the p5LiveMedia webrtc library and associated service.

let myVideo;
let p5l;

// Open this sketch up 2 times to send video back and forth
window.addEventListener("load", () => {
  const changeButton = document.querySelector("#change");
  changeButton.addEventListener("click", () => {
    instrument = document.querySelector(
      'input[name="instrument"]:checked'
    ).value;
    if (instrument == "piano") {
      videoStreams[0] = new PianistCam(myVideo);
    } else if (instrument == "guitar") {
      videoStreams[0] = new GuitaristCam(myVideo);
    } else if (instrument == "drums") {
      videoStreams[0] = new DrummerCam(myVideo);
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
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  myVideo = createCapture(VIDEO, function (stream) {
    p5l = new p5LiveMedia(this, "CAPTURE", stream, roomCode);
    p5l.on("stream", gotStream);
    p5l.on("data", gotData);
  });

  // p5l.socket.on("invalidRoom", () => {
  //   console.log("invalid room");
  // });
  myVideo.muted = true;
  myVideo.hide();
  if (myVideo != null) {
    videoStreams.push(new PianistCam(myVideo));
    document.querySelector('input[value="piano"]').checked = true;
  }
}

function draw() {
  background("white");
  // videoStreams[0].draw(0, 0);
  for (let i = videoStreams.length - 1; i >= 1; i--) {
    videoStreams[i].draw((width * 2) / 3, ((i - 1) * height) / 3);
    // videoStreams[i].draw();
    // videoStreams[i].move();
  }
  videoStreams[0].draw(0, 0);
  if (!p5lset) {
    videoStreams[0].p5l = p5l;
    if (videoStreams[0].p5l) {
      p5lset = true;
    }
  }
  // videoStreams[0].move();
}

// We got a new stream!
function gotStream(stream, id) {
  // This is just like a video/stream from createCapture(VIDEO)
  stream.hide();
  videoStreams.push(new Cam(stream));
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
