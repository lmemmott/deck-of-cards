import { el } from 'redom';

import queue from './queue.mjs';

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
  queue (handler) {
    queue(this, handler);
  }
  set ({ x = this.x, y = this.y, z = this.z, r = this.r }) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.el.style.transform = `translate(${x * 5 - z / 52}em, ${y * 7 - z / 52}em)`;
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
  flip (index, target, { side, delay = 0 }, cb) {
    return this.cards[index].flipTo(target, { side, delay }, cb);
  }
}
