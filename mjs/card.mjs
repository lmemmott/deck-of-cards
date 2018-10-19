import { el, mount, unmount } from 'redom';

import animate from './animate.mjs';

import Front from './card-front.mjs';

export default class Card {
  constructor (index, side = 'front') {
    this.el = el('.card',
      this.container = el('.card-container',
        this.front = new Front(),
        this.back = el('.card-back',
          this.backTexture = el('.card-back-texture')
        )
      )
    );
    this.setIndex(index % 52);
    this.side = side;
  }
  setIndex (index) {
    this.index = index;
    this.front.update(index);
  }
  set ({ x = this.x, y = this.y, z = this.z }) {
    this.x = x;
    this.y = y;
    this.z = z;
    this._set({ x, y, z });
  }
  _set ({ x = this.x, y = this.y, z = this.z }) {
    this.el.style.transform = `translate(${x * 5 - z / 52}em, ${y * 7 - z / 52}em)`;
  }
  animateTo ({ x, y, z, delay = 0, duration = 200, easing = 'quartInOut' }, cb, pcb) {
    animate({
      from: { x: this.x, y: this.y, z: this.z },
      to: { x, y, z },
      delay,
      duration,
      easing
    }, ({ x, y, z }, t) => {
      this.set({ x, y, z });

      if (pcb) {
        pcb(t);
      }

      if (cb && t === 1) {
        cb();
      }
    });
  }
  get side () {
    return this._side;
  }
  set side (side) {
    if (side === this._side) {
      return;
    }
    if (side === 'front') {
      this.back.style.display = 'none';
      mount(this.container, this.front);
    } else {
      unmount(this.container, this.front);
      this.back.style.display = '';
    }
    this._side = side;
  }
  flipTo (target, { side, delay = 0 }) {
    return new Promise(async (resolve) => {
      if (this.side === side) {
        return;
      }
      const y = this.y;
      await new Promise((resolve) => {
        animate({
          from: {
            y
          },
          to: {
            y: y + 1
          },
          delay,
          duration: 150,
          easing: 'cubicInOut'
        }, ({ y }, t) => {
          this.set({ y });

          if (t === 1) {
            resolve();
          }
        });
      });
      target.push(this);
      this.set({ y: y + 1 });

      await new Promise((resolve) => {
        animate({
          from: {
            y: y + 1
          },
          to: {
            y
          },
          duration: 150,
          easing: 'cubicInOut'
        }, ({ y }, t) => {
          this.set({ y });

          if (t > 0.45) {
            if (this.side !== side) {
              this.side = side;
            }
          }

          if (t === 1) {
            resolve();
          }
        });
      });
      this.side = side;
      resolve();
    });
  }
  dealTo (target, { side, delay, index = this.parent.cards.indexOf(this) }) {
    return this.parent.dealTo(target, { side, delay, index });
  }
}

Card.create = (index, z) => {
  return new Card(index, z);
};
