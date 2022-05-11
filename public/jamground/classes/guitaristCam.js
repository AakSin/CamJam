class GuitaristCam extends Cam {
  constructor(video) {
    super(video);
    this.height = height;
    this.width = (width * 2) / 3;
    // this.video.size(this.height, this.width);
    this.speed = 1;
    this.oldPlayFrame = 0;
    this.newPlayFrame = 31;

    this.handpose = ml5.handpose(this.video, () => {
      print("model ready");
    });
    this.predictions = [];
    this.handpose.on("predict", (results) => {
      this.predictions = results;
    });

    this.poseNet = ml5.poseNet(this.video, () => {
      console.log("model ready");
    });

    this.pose;
    this.poseNet.on("pose", (poses) => {
      if (poses.length > 0) {
        this.pose = poses[0].pose;
      }
    });
    this.oldrightWrist = { x: 0, y: 0 };
    this.newrightWrist = { x: 0, y: 0 };
  }
  draw(x, y) {
    let strum = false;
    let widthMultiplier = (width * 2) / 3 / this.video.width;
    let heightMultiplier = height / this.video.height;
    push();
    // move image by the width of image to the left
    translate(this.width, 0);
    // then scale it by -1 in the x-axis
    // to flip the image
    scale(-1 * widthMultiplier, 1 * heightMultiplier);
    image(this.video, x, y);

    if (this.pose) {
      if (this.pose.rightWrist.confidence > 0.7) {
        this.oldrightWrist.x = this.newrightWrist.x;
        this.oldrightWrist.y = this.newrightWrist.y;

        this.newrightWrist.x = this.pose.rightWrist.x;
        this.newrightWrist.y = this.pose.rightWrist.y;

        ellipse(this.newrightWrist.x, this.newrightWrist.y, 10, 10);
        // console.log(this.newrightWrist.y - this.oldrightWrist.y);
        if (this.newrightWrist.y - this.oldrightWrist.y > 5) {
          this.oldPlayFrame = this.newPlayFrame;
          this.newPlayFrame = frameCount;
          if (this.newPlayFrame - this.oldPlayFrame > 15) {
            console.log("hit");

            strum = true;
          }
        }
      }
    }
    if (this.predictions.length != 0) {
      this.drawKeypoints();
      if (strum) {
        this.playNote();
      }
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
  }
  playNote() {
    if (
      this.predictions[0].landmarks[8][1] > this.predictions[0].landmarks[6][1]
    ) {
      print("guitar1");
      guitar1.play();
    }
    if (
      this.predictions[0].landmarks[12][1] >
      this.predictions[0].landmarks[10][1]
    ) {
      print("guitar2");

      guitar2.play();
    }
    if (
      this.predictions[0].landmarks[16][1] >
      this.predictions[0].landmarks[14][1]
    ) {
      print("guitar3");

      guitar3.play();
    }
    if (
      this.predictions[0].landmarks[20][1] >
      this.predictions[0].landmarks[18][1]
    ) {
      print("guitar4");

      guitar4.play();
    }
    if (
      this.predictions[0].landmarks[4][0] > this.predictions[0].landmarks[2][0]
    ) {
      print("guitar5");

      guitar5.play();
    }
  }
}
