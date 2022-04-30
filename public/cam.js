class Cam {
  constructor(video) {
    this.video = video;
    this.width = width / 3;
    this.height = height / 3;
    // this.x = random(0, width - this.width);
    // this.x = x;
    // this.y = random(0, height - this.height);
    // this.y = y;
    this.xOrientation = 1;
    this.yOrientation = 1;
    this.speed = random(2, 3);
  }
  draw(x, y) {
    image(this.video, x, y, this.width, this.height);
  }
  //   move() {
  //     if (this.x >= width - this.width || this.x <= 0) {
  //       this.xOrientation *= -1;
  //     }
  //     if (this.y >= height - this.height || this.y <= 0) {
  //       this.yOrientation *= -1;
  //     }
  //     this.x += this.speed * this.xOrientation;
  //     this.y += this.speed * this.yOrientation;
  //   }
}

class DrummerCam extends Cam {
  constructor(video) {
    super(video);
    this.height = height;
    this.width = (width * 2) / 3;
    this.video.size(this.height, this.width);
    this.speed = 1;
    this.poseNet = ml5.poseNet(video, () => {
      console.log("model ready");
    });

    this.pose;
    this.poseNet.on("pose", (poses) => {
      if (poses.length > 0) {
        this.pose = poses[0].pose;
      }
    });
    this.oldLWrist = { x: 0, y: 0 };
    this.oldRWrist = { x: 0, y: 0 };
    this.newLWrist = { x: 0, y: 0 };
    this.newRWrist = { x: 0, y: 0 };
  }

  draw(x, y) {
    push();
    translate(0, 0);

    image(this.video, x, y, this.width, this.height);
    let drumLabels = ["hihat", "snare", "kick", "crash"];

    if (this.pose) {
      if (this.pose.leftWrist.confidence > 0.7) {
        this.oldLWrist.x = this.newLWrist.x;
        this.oldLWrist.y = this.newLWrist.y;

        // console.log(this.pose.leftWrist.confidence);
        this.newLWrist.x = this.pose.leftWrist.x;
        this.newLWrist.y = this.pose.leftWrist.y;
        // console.log(abs(this.newLWrist.y - this.oldLWrist.y));
        ellipse(this.newLWrist.x, this.newLWrist.y, 10, 10);

        // console.log(this.newLWrist.y - this.oldLWrist.y);
        if (abs(this.newLWrist.y - this.oldLWrist.y > 30)) {
          this.playSound(this.newLWrist.x);
        }
      }
      if (this.pose.rightWrist.confidence > 0.7) {
        this.oldRWrist.x = this.newRWrist.x;
        this.oldRWrist.y = this.newRWrist.y;

        // console.log(this.pose.rightWrist.confidence);
        this.newRWrist.x = this.pose.rightWrist.x;
        this.newRWrist.y = this.pose.rightWrist.y;
        // console.log(abs(this.newLWrist.y - this.oldLWrist.y));
        ellipse(this.newRWrist.x, this.newRWrist.y, 10, 10);
        // console.log(this.newLWrist.y - this.oldLWrist.y);
        if (abs(this.newRWrist.y - this.oldRWrist.y > 30)) {
          this.playSound(this.newRWrist.x);
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      stroke("white");
      fill(i * 50, 100, 100, 100);

      rect((i * this.width) / 4, 0, this.width / 4, this.height);
      noStroke();
      fill("white");
      text(
        drumLabels[i],
        (i * this.width) / 4 + this.width / 10,
        this.width / 2
      );
    }
    pop();
  }

  playSound(xValue) {
    if (xValue < (this.width / 4) * 1) {
      hihat.play();
    } else if (xValue < (this.width / 4) * 2) {
      snare.play();
    } else if (xValue < (this.width / 4) * 3) {
      kick.play();
    } else if (xValue < (this.width / 4) * 4) {
      crash.play();
    }
  }
}

class PianistCam extends Cam {
  constructor(video) {
    super(video);
    this.height = height;
    this.width = (width * 2) / 3;
    this.video.size(this.height, this.width);
    this.speed = 1;

    this.handpose = ml5.handpose(video, () => {
      print("model ready");
    });
    this.predictions = [];
    this.handpose.on("predict", (results) => {
      this.predictions = results;
    });
  }
  draw(x, y) {
    push();
    translate(x, y);
    image(this.video, 0, 0, this.width, this.height);
    if (this.predictions.length != 0 && frameCount % 60 == 0) {
      this.drawKeypoints();
    }
    pop();
  }
  drawKeypoints() {
    for (let i = 0; i < this.predictions.length; i += 1) {
      const prediction = this.predictions[i];
      for (let j = 0; j < prediction.landmarks.length; j += 1) {
        const keypoint = prediction.landmarks[j];
        fill(0, 255, 0);
        noStroke();
        ellipse(keypoint[0], keypoint[1], 10, 10);
        fill("white");
        text(j, keypoint[0], keypoint[1]);
      }
    }

    if (
      this.predictions[0].landmarks[8][1] > this.predictions[0].landmarks[6][1]
    ) {
      c4.play();
    }
    if (
      this.predictions[0].landmarks[12][1] >
      this.predictions[0].landmarks[10][1]
    ) {
      e4.play();
    }
    if (
      this.predictions[0].landmarks[16][1] >
      this.predictions[0].landmarks[14][1]
    ) {
      g4.play();
    }
    if (
      this.predictions[0].landmarks[20][1] >
      this.predictions[0].landmarks[18][1]
    ) {
      b5.play();
    }
    if (
      this.predictions[0].landmarks[4][0] < this.predictions[0].landmarks[2][0]
    ) {
      d5.play();
    }
  }
}

class GuitaristCam extends Cam {
  constructor(video) {
    super(video);
    this.height = height;
    this.width = (width * 2) / 3;
    this.video.size(this.height, this.width);
    this.speed = 1;
    this.oldPlayFrame = 0;
    this.newPlayFrame = 31;

    this.handpose = ml5.handpose(video, () => {
      print("model ready");
    });
    this.predictions = [];
    this.handpose.on("predict", (results) => {
      this.predictions = results;
    });

    this.poseNet = ml5.poseNet(video, () => {
      console.log("model ready");
    });

    this.pose;
    this.poseNet.on("pose", (poses) => {
      if (poses.length > 0) {
        this.pose = poses[0].pose;
      }
    });
    this.oldNose = { x: 0, y: 0 };
    this.newNose = { x: 0, y: 0 };
  }
  draw(x, y) {
    let strum = false;
    push();
    translate(x, y);
    image(this.video, 0, 0, this.width, this.height);

    if (this.pose) {
      if (this.pose.nose.confidence > 0.7) {
        this.oldNose.x = this.newNose.x;
        this.oldNose.y = this.newNose.y;

        this.newNose.x = this.pose.nose.x;
        this.newNose.y = this.pose.nose.y;

        ellipse(this.newNose.x, this.newNose.y, 10, 10);
        // console.log(this.newNose.y - this.oldNose.y);
        if (this.newNose.y - this.oldNose.y > 10) {
          this.oldPlayFrame = this.newPlayFrame;
          this.newPlayFrame = frameCount;
          if (this.newPlayFrame - this.oldPlayFrame > 15) {
            console.log("hit");

            strum = true;
          }
        }
      }
    }
    if (this.predictions.length != 0 && strum) {
      this.drawKeypoints();
    }
    pop();
  }
  drawKeypoints() {
    for (let i = 0; i < this.predictions.length; i += 1) {
      const prediction = this.predictions[i];
      for (let j = 0; j < prediction.landmarks.length; j += 1) {
        const keypoint = prediction.landmarks[j];
        fill(0, 255, 0);
        noStroke();
        ellipse(keypoint[0], keypoint[1], 10, 10);
        fill("white");
        text(j, keypoint[0], keypoint[1]);
      }
    }

    if (
      this.predictions[0].landmarks[8][1] > this.predictions[0].landmarks[6][1]
    ) {
      c4.play();
    }
    if (
      this.predictions[0].landmarks[12][1] >
      this.predictions[0].landmarks[10][1]
    ) {
      e4.play();
    }
    if (
      this.predictions[0].landmarks[16][1] >
      this.predictions[0].landmarks[14][1]
    ) {
      g4.play();
    }
    if (
      this.predictions[0].landmarks[20][1] >
      this.predictions[0].landmarks[18][1]
    ) {
      b5.play();
    }
    if (
      this.predictions[0].landmarks[4][0] < this.predictions[0].landmarks[2][0]
    ) {
      d5.play();
    }
  }
}
