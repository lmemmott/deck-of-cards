import { el } from 'redom';

import animate from './animate.mjs';
import deal from './deal.mjs';

export default class Hand {
  constructor ({ x = 0, y = 0, z = 0, rotate = false, spread = 1 / 6 } = {}) {
    this.el = el('.hand',
      el('.hand-bg'),
      this.$cards = el('.cards')
    );
    this.cards = [];
    this.rotate = rotate;
    this.spread = spread;
    this.set({ x, y, z });
  }
  set ({ x = this.x, y = this.y, z = this.z, r = this.r }) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.el.style.transform = `translate(${x * 5 - z / 52}em, ${y * 7 - z / 52}em)`;
  }
  animateTo ({ x = this.x, y = this.y, z = this.z, delay = 0, duration = 500, easing = 'quartInOut' }, pcb) {
    return new Promise((resolve) => {
      animate({
        from: {
          x: this.x,
          y: this.y,
          z: this.z
        },
        to: {
          x,
          y,
          z
        },
        delay,
        duration,
        easing
      }, ({ x, y, z }, t) => {
        this.set({ x, y, z });

        if (pcb) {
          pcb(t);
        }

        if (t === 1) {
          resolve();
        }
      });
    });
  }
  getPosition (i) {
    const x = (this.rotate ? -1 : 1) * i * this.spread;
    const y = 0;
    const z = i;

    return { x, y, z };
  }
  remove (card) {
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i] === card) {
        this.cards.splice(i--, 1);
      }
    }
  }
  push (card) {
    if (card.parent) {
      card.parent.remove(card);
    }
    this.cards.push(card);
    this.$cards.appendChild(card.el);
    card.parent = this;
    for (let i = 0; i < this.cards.length; i++) {
      const { x, y, z } = this.getPosition(i);

      this.cards[i].set({ x, y, z });
    }
  }
  dealTo (target, { side, delay = 0, index = this.cards.length - 1, moveDeck = false } = {}, cb) {
    return new Promise(async (resolve) => {
      if (moveDeck) {
        await this.animateTo({
          x: target.x + (target.rotate ? -1 : 1) * target.cards.length * target.spread,
          y: target.y + 1,
          duration: 250,
          delay
        });
      }
      await deal(this, this.cards[index], target, { duration: 250, side, delay: moveDeck ? 0 : delay }, cb);
      resolve();
    });
  }
  flip (index, target, { side, delay = 0 }, cb) {
    return this.cards[index].flipTo(target, { side, delay }, cb);
  }
}
