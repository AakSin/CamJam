class PianistCam extends Cam {
  constructor(video, p5l) {
    super(video);
    this.p5l = p5l;
    this.height = height;
    this.width = (width * 2) / 3;

    // this.widthMultiplier = 2;
    // this.heightMultiplier = 2;
    this.playFrame = 0;
    this.handpose = ml5.handpose(this.video, () => {
      print("model ready");
    });
    this.predictions = [];
    this.handpose.on("predict", (results) => {
      this.predictions = results;
    });
  }
  draw(x, y) {
    let widthMultiplier = (width * 2) / 3 / this.video.width;
    let heightMultiplier = height / this.video.height;
    push();
    // move image by the width of image to the left
    translate(this.width, 0);
    // then scale it by -1 in the x-axis
    // to flip the image
    scale(-1 * widthMultiplier, 1 * heightMultiplier);
    image(this.video, x, y);
    // image(this.video, x, y);
    if (this.predictions.length != 0) {
      this.drawKeypoints();
      //   print(frameCount - this.playFrame);
      if (millis() - this.playFrame >= 1000) {
        // print(frameRate());
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
        // text(j, keypoint[0], keypoint[1]);
      }
    }
  }
  playNote() {
    let notePlayed = false;
    if (
      this.predictions[0].landmarks[8][1] > this.predictions[0].landmarks[6][1]
    ) {
      notePlayed = true;
      piano1.play();
      // Send it
      this.p5l.send(JSON.stringify("piano1"));
    }
    if (
      this.predictions[0].landmarks[12][1] >
      this.predictions[0].landmarks[10][1]
    ) {
      notePlayed = true;

      piano2.play();
      this.p5l.send(JSON.stringify("piano2"));
    }
    if (
      this.predictions[0].landmarks[16][1] >
      this.predictions[0].landmarks[14][1]
    ) {
      notePlayed = true;

      piano3.play();
      this.p5l.send(JSON.stringify("piano3"));
    }
    if (
      this.predictions[0].landmarks[20][1] >
      this.predictions[0].landmarks[18][1]
    ) {
      notePlayed = true;

      piano4.play();
      this.p5l.send(JSON.stringify("piano4"));
    }
    if (
      this.predictions[0].landmarks[4][0] < this.predictions[0].landmarks[2][0]
    ) {
      notePlayed = true;

      piano5.play();
      this.p5l.send(JSON.stringify("piano5"));
    }
    if (notePlayed) {
      this.playFrame = millis();
    }
  }
}
