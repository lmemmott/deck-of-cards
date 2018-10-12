import { el, list, mount, unmount } from 'redom';

import animate from './animate.mjs';
import { suitpos, suits, ranks } from './card-properties.mjs';

export default class Card {
  constructor (index) {
    this.el = el('.card',
      this.container = el('.card-container',
        this.front = el(`.card-front`,
          this.suits = list('.card-suits', Suit),
          el('.card-tl',
            this.rank1 = el('.card-rank'),
            this.suit1 = el('.card-suit')
          ),
          el('.card-br',
            this.rank2 = el('.card-rank'),
            this.suit2 = el('.card-suit')
          )
        ),
        this.back = el('.card-back',
          this.backTexture = el('.card-back-texture')
        )
      )
    );
    this.setIndex(index % 52);
    this.side = 'front';
  }
  setIndex (index) {
    if (index == null) {
      this.front.className = 'card-front';
      this.suits.update([]);
      this.rank1.textContent = '';
      this.rank2.textContent = '';
      this.suit1.textContent = '';
      this.suit2.textContent = '';
      return;
    }
    this.index = index;

    const suit = Math.floor(index / 13) % 4;
    const value = index % 13;
    const color = Math.floor(index / 13) % 2 ? 'red' : 'black';

    const ace = value === 0;
    const royal = value > 9;

    if (color === 'red') {
      this.front.classList.add('red');
      this.front.classList.remove('black');
    } else {
      this.front.classList.add('black');
      this.front.classList.remove('red');
    }

    this.value = value + 1;
    this.suits.update(suitpos[value], { suit, value, color, ace, royal });
    this.rank1.textContent = ranks[value];
    this.rank2.textContent = ranks[value];
    this.suit1.style.backgroundImage = `url(img/${suits[suit]}.svg)`;
    this.suit2.style.backgroundImage = `url(img/${suits[suit]}.svg)`;
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
      from: { x, y, z },
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

class Suit {
  constructor () {
    this.el = el('.card-suit');
  }
  update (pos, index, data, { value, suit, ace, royal }) {
    if (royal) {
      this.el.textContent = ranks[value];
      this.el.style.backgroundImage = '';
    } else {
      this.el.textContent = '';
      this.el.style.backgroundImage = `url(img/${suits[suit]}.svg)`;
    }
    this.el.className = ace ? 'card-suit ace' : royal ? 'card-suit royal' : 'card-suit';
    this.el.style.left = `${pos[0] * 100}%`;
    this.el.style.top = `${pos[1] * 100}%`;
    this.el.style.transform = `translate(-50%, -50%) rotate(${!!pos[2] * 180}deg)`;
    this.el.style.fontWeight = royal ? '300' : '';
  }
}
