import { el } from 'redom';

import Card from './card.mjs';
import shuffle from './shuffle.mjs';
import animate from './animate.mjs';
import deal from './deal.mjs';

export default class Deck {
  constructor ({ x = 0, y = 0, z = 0 } = {}) {
    this.el = el('.deck',
      el('.deck-bg'),
      this.$cards = el('.cards')
    );
    this.cards = [];
    this.generate(52);
    this.set({ x, y, z });
  }
  set ({ x = this.x, y = this.y, z = this.z }) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.el.style.transform = `translate(${x * 5 - z / 52}em, ${y * 7 - z / 52}em)`;
  }
  animateTo ({ x = this.x, y = this.y, z = this.z, delay = 0, duration = 400, easing = 'cubicInOut' }, cb, pcb) {
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
          cb && cb();
          resolve();
        }
      });
    });
  }
  generate (count) {
    for (let i = 0; i < count; i++) {
      const card = new Card(count - 1 - i);
      this.push(card);
    }
  }
  getPosition (index) {
    const x = 0;
    const y = 0;
    const z = index;

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
    card.parent = this;
    this.$cards.appendChild(card.el);

    for (let i = 0; i < this.cards.length; i++) {
      const { x, y, z } = this.getPosition(i);

      this.cards[i].set({ x, y, z });
    }
  }
  shuffle () {
    return shuffle(this);
  }
  dealTo (target, { side, delay = 0, index = this.cards.length - 1, moveDeck = false } = {}, cb) {
    if (!this.cards.length) {
      return;
    }
    return new Promise(async (resolve) => {
      if (moveDeck) {
        await this.animateTo({
          x: target.x + (target.rotate ? -1 : 1) * target.cards.length * target.spread,
          y: target.y + 1,
          duration: 250,
          delay
        });
      }
      await deal(this, this.cards[index], target, { duration: 200, side, delay: moveDeck ? 0 : delay }, cb);
      resolve();
    });
  }
}
