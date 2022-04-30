// This is a test of the p5LiveMedia webrtc library and associated service.
// Open this sketch up 2 times to send video back and forth

let myVideo;
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
    let p5l = new p5LiveMedia(this, "CAPTURE", stream, "jZQ64AMJc_TESTTEST");
    p5l.on("stream", gotStream);
  });
  myVideo.muted = true;
  myVideo.hide();
  if (myVideo != null) {
    videoStreams.push(new PianistCam(myVideo));
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
  // videoStreams[0].move();
}

// We got a new stream!
function gotStream(stream, id) {
  // This is just like a video/stream from createCapture(VIDEO)
  stream.hide();
  videoStreams.push(new Cam(stream));
}
