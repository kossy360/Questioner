/* eslint-disable no-unused-expressions */
/* eslint-env browser */
/* eslint-disable max-len */
class Slide {
  constructor(window, strip, count, duration, callback) {
    this.window = window;
    this.strip = strip;
    this.callback = callback;
    this.defT = duration;
    this.countMax = count;
    this.count = 0;
    this.current = 0;
    this.pos = 0;
    this.dir = 0;
    this.active = false;
    this.queue = [];
    this.touch = {
      initial: null,
      final: null,
      active: false,
    };
    this.stop = false;
    this.offsetLeft = 0;
    this.offsetWidth = 0;
    this.offsetHeight = 0;
  }

  resize(t1) {
    this.offsetHeight = this.strip.offsetHeight;
    const left = (Math.abs(this.strip.offsetLeft) - (this.strip.offsetWidth * this.count)) + this.strip.offsetLeft;
    this.offsetWidth = this.strip.offsetWidth;
    this.strip.style.left = `${left}px`;
    this.offsetLeft = left;
    if (t1) return;
    window.requestAnimationFrame(t => this.resize(t));
  }

  check1() {
    if ((this.offsetLeft % this.offsetWidth) > 0) {
      this.resize();
      console.log('here');
    }
  }

  setMove(x) {
    window.requestAnimationFrame(() => this.shiftTouch(x));
  }

  shiftTouch(x) {
    this.offsetLeft += x;
    this.strip.style.left = `${this.offsetLeft}px`;
  }

  checkMove(x) {
    if (this.count === 0 || this.count === this.countMax) {
      if (x === 0) {
        this.dir = x;
        this.count += 1;
      } else {
        this.dir = x;
        this.count -= 1;
      }
      window.requestAnimationFrame(() => this.restart(1));
    }
  }

  shift() {
    if (this.active) return;
    this.active = true;
    const distance = Math.abs(this.offsetLeft) - (this.offsetWidth * this.count);
    const callback = () => {
      this.active = false;
      if (!this.stop) this.check();
    };
    window.requestAnimationFrame(currTime => this.animate(currTime, this.defT, distance, callback));
  }

  restart(x) {
    if (this.dir === 0) {
      this.strip.insertBefore(this.strip.lastChild, this.strip.firstChild);
      this.offsetLeft -= this.offsetWidth;
    } else {
      this.strip.appendChild(this.strip.firstChild);
      this.offsetLeft += this.offsetWidth;
    }
    this.strip.style.left = `${this.offsetLeft}px`;
    if (!x) this.shift();
  }

  check() {
    const a = this.queue;
    if (a.length > 0) {
      if (a[0] === 0) {
        if (this.count === 0) {
          this.dir = 0;
          window.requestAnimationFrame(() => this.restart());
        } else {
          this.count -= 1;
          this.shift();
        }
        this.currPos(0);
      } else {
        if (this.count === this.countMax) {
          this.dir = 1;
          window.requestAnimationFrame(() => this.restart());
        } else {
          this.count += 1;
          this.shift();
        }
        this.currPos(1);
      }
      this.queue.splice(0);
    } else this.active = false;
  }

  currPos(x, set) {
    if (!set) {
      if (x === 0) {
        if (this.current === 0) this.current = this.countMax;
        else this.current -= 1;
      } else if (this.current === this.countMax) this.current = 0;
      else this.current += 1;
    } else this.current = x;
    this.callback(this.current);
  }

  move(x) {
    if (this.countMax === 0) return;
    if (this.stop) return;
    if (x === 0) {
      if (this.queue[0] === 1) {
        this.queue = [x];
        this.queue = this.queue.slice(0, 1);
      } else {
        this.queue.push(x);
      }
    } else if (this.queue[0] === 0) {
      this.queue[1] = [x];
      this.queue = this.queue.slice(0, 1);
    } else {
      this.queue.push(x);
    }
    if (this.active === false) this.check();
  }

  completeMove() {
    if (!this.touch.active) return;
    const remMove = (this.offsetWidth * this.count) + this.offsetLeft;
    this.stop = false;
    if (remMove === 0) return;
    if (Math.abs(remMove) > (this.offsetWidth / 4)) {
      this.count += remMove > 0 ? -1 : 1;
      if ((remMove < 0 && this.count > 0) || (remMove < 0 && this.count === this.countMax) || (remMove > 0 && this.count === this.countMax)) this.currPos(1);
      else this.currPos(0);
    }
    this.shift();
  }

  resetTouch() {
    this.completeMove();
    this.touch = {
      initial: null,
      final: null,
      active: false,
    };
  }

  touchMove(e) {
    if (this.countMax === 0) return;
    const touches = e.targetTouches[0];


    const rect = this.window.getBoundingClientRect();
    if (!(touches.clientX > rect.left && touches.clientX < rect.right)) {
      this.resetTouch();
      return;
    }
    this.stop = true;
    this.touch.active = true;
    this.touch.final = touches.clientX;
    const diff = this.touch.final - this.touch.initial;
    if (this.touch.initial === null) this.touch.initial = touches.clientX;
    if (this.touch.initial - this.touch.final) {
      this.setMove(diff);
      if (this.count === 0 && diff > 0 && this.offsetLeft >= -(this.offsetWidth * (this.countMax - 1))) this.checkMove(0);
      if (this.count === this.countMax && diff < 0 && this.offsetLeft <= -this.offsetWidth) this.checkMove(1);
      this.touch.initial = this.touch.final;
    }
  }

  animate(timestamp, period, distance, callback, lastTime, adjust) {
    let adj = adjust || 0;
    let time = period;
    let dist = distance;
    if (lastTime) {
      adj = Math.round((dist / time) * (timestamp - lastTime));
    } else {
      adj = Math.round((dist / time) * (1000 / 60));
    }
    if (time <= (1000 / 60)) {
      time = 0;
      this.offsetLeft += dist;
      dist = 0;
    } else {
      time -= (!lastTime ? 17 : (timestamp - lastTime));
      this.offsetLeft += adj;
      dist -= adj;
    }
    this.strip.style.left = `${this.offsetLeft}px`;
    if (this.stop || time === 0) {
      callback();
      return;
    }
    window.requestAnimationFrame(currTime => this.animate(currTime, time, dist, callback, timestamp, adj));
  }

  jump(number) {
    if (number > this.countMax) return;
    const num = number;

    let diff = this.current - num;
    if (diff === 1 || diff === -1) {
      diff > 0 ? this.move(0) : this.move(1);
      return;
    }
    if (Math.abs(diff) === this.countMax) {
      diff < 0 ? this.move(0) : this.move(1);
      return;
    }
    console.log(typeof this.currPos);
    this.currPos(num, 1);

    let i = 0;
    while (diff !== 0) {
      if (i !== 0) {
        if (this.count >= this.countMax) this.count = 0;
        else if (this.count <= 0) this.count = this.countMax;
      }
      if (diff < 0) {
        this.count += 1;
        diff += 1;
      } else {
        this.count -= 1;
        diff -= 1;
      }
      i += 1;
    }
    this.shift();
  }

  initialize() {
    window.addEventListener('resize', () => {
      this.resize();
    });

    this.window.addEventListener('resize', () => console.log('resized'));

    window.addEventListener('touchmove', e => this.touchMove(e));

    window.addEventListener('touchend', () => this.resetTouch());

    this.window.addEventListener('touchcancel', () => this.resetTouch());

    this.resize();

    this.callback(this.current);
  }
}

export default Slide;
