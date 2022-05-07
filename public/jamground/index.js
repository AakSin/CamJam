// This is a test of the p5LiveMedia webrtc library and associated service.

let myVideo;
let p5l;

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
      if (pianistCamClient) {
        videoStreams[0] = pianistCamClient;
      } else {
        pianistCamClient = new PianistCam(myVideo);
        videoStreams[0] = pianistCamClient;
      }
    } else if (instrument == "guitar") {
      if (guitaristCamClient) {
        videoStreams[0] = guitaristCamClient;
      } else {
        guitaristCamClient = new GuitaristCam(myVideo);
        videoStreams[0] = guitaristCamClient;
      }
    } else if (instrument == "drums") {
      if (drummerCamClient) {
        videoStreams[0] = drummerCamClient;
      } else {
        drummerCamClient = new DrummerCam(myVideo);
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
let monkey;
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
  createCanvas(window.innerWidth, 0.95 * window.innerHeight);
  pixelDensity(1);

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
    p5l = new p5LiveMedia(this, "CAPTURE", stream, roomCode);
    p5l.on("stream", gotStream);
    p5l.on("data", gotData);
  });

  // p5l.socket.on("invalidRoom", () => {
  //   console.log("invalid room");
  // });
  myVideo.muted = true;
  myVideo.hide();
  // myVideo.size((window.innerWidth * 2) / 3, window.innerHeight);
  if (myVideo != null) {
    pianistCamClient = new PianistCam(myVideo);

    videoStreams.push(pianistCamClient);
    document.querySelector('input[value="piano"]').checked = true;
  }
}

function draw() {
  background("white");
  // rect(0, 0, myVideo.width, myVideo.height);

  // image(myVideo, 0, 0);

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
  if (videoStreams[0] instanceof DrummerCam) {
    let rectHeight =
      videoStreams[0].video.height * videoStreams[0].heightMultiplier;
    let rectWidth =
      videoStreams[0].video.width * videoStreams[0].widthMultiplier;
    print(rectHeight, rectWidth);

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
