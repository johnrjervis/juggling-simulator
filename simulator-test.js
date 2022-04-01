const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const body = document.querySelector('body');
body.style.margin = 0;

const WIDTH = canvas.width = 800; //window.innerWidth;
const HEIGHT = canvas.height = 600; //window.innerHeight;

ctx.translate(WIDTH / 2, HEIGHT /2);

const BALL_RADIUS = 30;
const BASE_LEVEL = HEIGHT / 4;
const THROW_FROM_RIGHT = 100;
const THROW_FROM_LEFT = -THROW_FROM_RIGHT;
const CATCH_RIGHT = 300;
const CATCH_LEFT = -CATCH_RIGHT;

class Hand {

  HAND_MOVE = 7;
  height = 40;
  width = 80;

  constructor(right) {
    this.x = (right) ? THROW_FROM_RIGHT - (this.width / 2): THROW_FROM_LEFT - (this.width / 2);
    this.y = BASE_LEVEL + BALL_RADIUS;
  }

  draw() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    for (const ball of balls) {
      if (ball.isCaught && ball.isVisible && Math.sign(ball.x) === Math.sign(this.x)) {
        this.x = ball.x - this.width / 2;
      } else {
        if (Math.abs(this.x) < CATCH_RIGHT - (Math.sign(this.x) * this.width / 2)) {
          this.x += this.HAND_MOVE * Math.sign(this.x);
        } 
      }
    }
  }

}

class Ball {

  GRAVITY = 0.5;
  x;
  y;
  velX;
  velY;
  color;
  radius = BALL_RADIUS;

  constructor(x, y, color) {
    this.x = x;
    this.y = BASE_LEVEL;
    this.color = color;
    this.velX = 0;
    this.velY = 0;
    this.GRAVITY;
    this.isCaught = true;
    this.isVisible = true;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  catchAndCarry() {
    this.isCaught = true;
    this.velX = (this.x < 0) ? 7 : -7;
    this.velY = 0;
    this.y = BASE_LEVEL;
  }

  throw() {
    (this.x < 0) ? this.velX = 5 : this.velX = -5;
    this.isCaught = false;
    this.velY += -20;
  }

  update() {
    if (!this.isCaught) {
      this.y += this.velY;
      this.velY += this.GRAVITY;
    }
    if (this.y >= BASE_LEVEL & !this.isCaught) {
      this.catchAndCarry();
    }

    this.x += this.velX;

    if (this.isCaught && this.x < 0 && this.x > THROW_FROM_LEFT) {
      this.velX = 0;
      this.x = THROW_FROM_LEFT;
    } else if (this.isCaught && this.x > 0 && this.x < THROW_FROM_RIGHT) {
      this.velX = 0;
      this.x = THROW_FROM_RIGHT;
    }
  }
}

const b1 = new Ball(-100, 0, 'red');
const b2 = new Ball(THROW_FROM_RIGHT, 0, 'darkgreen');
const b3 = new Ball(THROW_FROM_LEFT, 0, 'blue');

const balls = [b1, b2, b3];

let thrownFromLeft = b1;
let thrownFromRight = b2;

const hands = [new Hand(false), new Hand(true)];

function loop() {

  ctx.fillStyle = 'rgba(200, 200, 200, 0.7)';
  ctx.fillRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);

  for (const ball of balls) {
    if (ball.isCaught && ball.x === THROW_FROM_LEFT && thrownFromRight.y < -250) {
      thrownFromLeft = ball;
      ball.throw();
    } else if (ball.isCaught && ball.x === THROW_FROM_RIGHT && thrownFromLeft.y < -250) {
      ball.throw();
      thrownFromRight = ball;
    }
    if (ball.isVisible) {
      ball.draw();
    }
    ball.update();
  }

  for (const hand of hands) {
    hand.draw();
    hand.update();
  }

  requestAnimationFrame(loop);
}

b1.throw();
loop();