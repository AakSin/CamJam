
let font;
let myVideo;
let p5l;
let clientId;

// labels that will be written over the various screen sections of drum or bass
let drumLabels = ["crash", "kick", "snare", "hihat"];
let bassLabels = ["D", "E", "A", "F", "G"];

let pianistCamClient;
let drummerCamClient;
let guitaristCamClient;
let bassistCamClient;


window.addEventListener("load", () => {
  const radioButtons = document.querySelectorAll('input[type="radio"');
  const helpText = document.querySelector("#help")
  for (let i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener("click", () => {
      instrument = document.querySelector(
        'input[name="instrument"]:checked'
      ).value;
      console.log(
        document.querySelector('input[name="instrument"]:checked').value
      );
      if (instrument == "piano") {
        helpText.innerHTML= "Piano Instructions: Bring your right hand up. Bend one finger down to play one note. You can bend multiple fingers down to play chords."
        p5l.socket.emit("instrumentInfo", "Pianist");
//       these conditionals basically check if the object for that instrument already exists or not, if it does assign it, if it doesn't then make a new one
        
        if (pianistCamClient) {
          videoStreams[0] = pianistCamClient;
        } else {
          pianistCamClient = new PianistCam(myVideo, clientId);
          videoStreams[0] = pianistCamClient;
        }
      } else if (instrument == "guitar") {
        helpText.innerHTML= "Guitar Instructions: Bring your left hand up. Bend one finger down to hold that chord. Now bring your right hand up and move it down to strum."
        
        p5l.socket.emit("instrumentInfo", "Guitarist");

        if (guitaristCamClient) {
          videoStreams[0] = guitaristCamClient;
        } else {
          guitaristCamClient = new GuitaristCam(myVideo, clientId);
          videoStreams[0] = guitaristCamClient;
        }
      } else if (instrument == "drums") {
        helpText.innerHTML= "Drums Instructions: Bend camera down to focus on your waist. You can play drum with both hands! Bring your hands down from high up to play the drum sound on that part of the screen."
        
        p5l.socket.emit("instrumentInfo", "Drummer");

        if (drummerCamClient) {
          videoStreams[0] = drummerCamClient;
        } else {
          drummerCamClient = new DrummerCam(myVideo, clientId);
          videoStreams[0] = drummerCamClient;
        }
      } else if (instrument == "bass") {
        p5l.socket.emit("instrumentInfo", "Bassist");
        helpText.innerHTML= "Bass Instructions: Bend camera down to focus on your waist. You can play bass with both hands! Slap in a highlighted region to play a note."
        
        if (bassistCamClient) {
          videoStreams[0] = bassistCamClient;
        } else {
          bassistCamClient = new BassistCam(myVideo, clientId);
          videoStreams[0] = bassistCamClient;
        }
      }
      videoStreams[0].p5l = p5l;
    });
  }
});

// access room code from url which will be passed down to p5 live media
roomCode = window.location.pathname;
roomCode = roomCode.substring(1, roomCode.length - 1);


let p5lset = false;
let videoStreams = [];

// initiliaze them here so they can be used outside of pre load as well
let font;
let crash, hihat, snare, kick, piano1, piano2, piano3, piano4, piano5, guitar1, guitar2, guitar3, guitar4, guitar5, bass1, bass2, bass3, bass4, bass5;

function preload() {
  crash = loadSound("assets/crash.wav");
  kick = loadSound("assets/kick.wav");
  snare = loadSound("assets/snare.wav");
  hihat = loadSound("assets/hihat.wav");

  piano1 = loadSound("assets/piano1.wav");
  piano2 = loadSound("assets/piano2.wav");
  piano3 = loadSound("assets/piano3.wav");
  piano4 = loadSound("assets/piano4.wav");
  piano5 = loadSound("assets/piano5.wav");

  guitar1 = loadSound("assets/guitar1.m4a");
  guitar2 = loadSound("assets/guitar2.m4a");
  guitar3 = loadSound("assets/guitar3.m4a");
  guitar4 = loadSound("assets/guitar4.m4a");
  guitar5 = loadSound("assets/guitar5.m4a");

  
  
  bass1 = loadSound("assets/bass1.wav");
  bass2 = loadSound("assets/bass2.wav");
  bass3 = loadSound("assets/bass3.wav");
  bass4 = loadSound("assets/bass4.wav");
  bass5 = loadSound("assets/bass5.wav");

  font = loadFont("assets/raleway.ttf");
}

function setup() {
  textFont(font);
  
  guitar1.setVolume(2)
  guitar2.setVolume(2)
  guitar3.setVolume(2)
  guitar4.setVolume(2)
  guitar5.setVolume(2)
  createCanvas(window.innerWidth, 0.9 * window.innerHeight);

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
//     on redirect event take the client to the roomFull page
    p5l.socket.on("redirect",()=>{
      window.location.href="roomFull"
    })
    p5l.socket.on("instrumentList", (data) => {
      // keep updating instrument list upon receiving this event
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
    let textBox = font.textBounds(videoStreams[i].instrumentName, 0, 0, 20);
    
    fill("#494949");
    rect(
      (width * 2) / 3,
      ((i - 1) * height) / 3 + videoStreams[i].height - textBox.h - 10,
      textBox.w + 10,
      textBox.h + 10
    );
    fill("white");
    textSize(20);
//     write the name of instrument a person is playing
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
      textSize(30);
      text(drumLabels[i], (i * rectWidth) / 4 + rectWidth / 10 - 10 , rectHeight / 2 + 10);
    }
  } else if (getInstrumentName(videoStreams[0]) == "Bassist") {
    let rectHeight =
      videoStreams[0].video.height * videoStreams[0].heightMultiplier;
    let rectWidth =
      videoStreams[0].video.width * videoStreams[0].widthMultiplier;

    for (let i = 0; i < 5; i++) {
      stroke("white");
      fill(i * 50, 100, 100, 100);

      rect(0, (i * rectHeight) / 5, rectWidth, rectHeight / 5);
      noStroke();
      fill("white");
       textSize(30);
      text(
        bassLabels[i],
        rectWidth / 2,
        (i * rectHeight) / 5 + rectHeight / 10 + 15
      );
    }
  }
  // videoStreams[0].move();
}

// We got a new stream!
function gotStream(stream, id) {
  // This is just like a video/stream from createCapture(VIDEO)
  stream.hide();
  videoStreams.push(new Cam(stream, id));
//   upon getting a new client check it's instrument from instruemntList
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
  switch (d) {
    case "piano1":
      piano1.play();
      break;
    case "piano2":
      piano2.play();

      break;
    case "piano3":
      piano3.play();

      break;
    case "piano4":
      piano4.play();

      break;
    case "piano5":
      piano5.play();

      break;
    case "guitar1":
      guitar1.play();
      break;
    case "guitar2":
      guitar2.play();
      break;
    case "guitar3":
      guitar3.play();

      break;
    case "guitar4":
      guitar4.play();

      break;
    case "guitar5":
      guitar5.play();
      break;
    case "bass1":
      bass1.play();
      break;
    case "bass2":
      bass2.play();
      break;
    case "bass3":
      bass3.play();
      break;
    case "bass4":
      bass4.play();
      break;
    case "bass5":
      bass5.play();
      break;
    case "snare":
      snare.play();
      break;
    case "hihat":
      hihat.play();
      break;
    case "kick":
      kick.play();
      break;
    case "crash":
      crash.play();
      break;
  }
}
function gotDisconnect(id) {
//   remove person from displaying list when they disconnect
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
// helper function to basically get the instrument name from the class name
function getInstrumentName(instrumentVar) {
  if (instrumentVar instanceof DrummerCam) {
    return "Drummer";
  } else if (instrumentVar instanceof PianistCam) {
    return "Pianist";
  } else if (instrumentVar instanceof GuitaristCam) {
    return "Guitarist";
  } else if (instrumentVar instanceof BassistCam) {
    return "Bassist";
  }
}
