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
