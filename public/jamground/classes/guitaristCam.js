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
    this.oldNose = { x: 0, y: 0 };
    this.newNose = { x: 0, y: 0 };
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
