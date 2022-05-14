class DrummerCam extends Cam {
  constructor(video,p5l) {
    super(video);
    this.p5l = p5l;
    
    this.height = height;
    this.width = (width * 2) / 3;
    // this.video.size(this.height, this.width);
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
    this.widthMultiplier;
    this.heightMultiplier;
  }

  draw(x, y) {
    this.widthMultiplier = (width * 2) / 3 / this.video.width;
    this.heightMultiplier = height / this.video.height;
    push();
    // move image by the width of image to the left
    translate(this.width, 0);
    // then scale it by -1 in the x-axis
    // to flip the image
    scale(-1 * this.widthMultiplier, 1 * this.heightMultiplier);
    image(this.video, x, y);
    // image(this.video, x, y);

    if (this.pose) {
      if (this.pose.leftWrist.confidence > 0.1) {
        this.oldLWrist.x = this.newLWrist.x;
        this.oldLWrist.y = this.newLWrist.y;

        // console.log(this.pose.leftWrist.confidence);
        this.newLWrist.x = this.pose.leftWrist.x;
        this.newLWrist.y = this.pose.leftWrist.y;
        // console.log(abs(this.newLWrist.y - this.oldLWrist.y));
        ellipse(this.newLWrist.x, this.newLWrist.y, 10, 10);

        // console.log(this.newLWrist.y - this.oldLWrist.y);
        if (this.newLWrist.y - this.oldLWrist.y > 100) {
          this.playSound(this.newLWrist.x);
        }
      }
      if (this.pose.rightWrist.confidence > 0.1) {
        this.oldRWrist.x = this.newRWrist.x;
        this.oldRWrist.y = this.newRWrist.y;

        // console.log(this.pose.rightWrist.confidence);
        this.newRWrist.x = this.pose.rightWrist.x;
        this.newRWrist.y = this.pose.rightWrist.y;
        // console.log(abs(this.newLWrist.y - this.oldLWrist.y));
        ellipse(this.newRWrist.x, this.newRWrist.y, 10, 10);
        // console.log(this.newLWrist.y - this.oldLWrist.y);
        if (this.newRWrist.y - this.oldRWrist.y > 75) {
          this.playSound(this.newRWrist.x);
        }
      }
    }

    pop();
  }

  playSound(xValue) {
    if (xValue < (this.video.width / 4) * 1) {
      print("hihat");
      hihat.play();
      this.p5l.send(JSON.stringify("hihat"));
    } else if (xValue < (this.video.width / 4) * 2) {
      print("snare");

      snare.play();
      this.p5l.send(JSON.stringify("snare"));
    } else if (xValue < (this.video.width / 4) * 3) {
      print("kick");

      kick.play();
      this.p5l.send(JSON.stringify("kick"));
    } else if (xValue < (this.video.width / 4) * 4) {
      print("crash");

      crash.play();
      this.p5l.send(JSON.stringify("crash"));
    }
  }
}
