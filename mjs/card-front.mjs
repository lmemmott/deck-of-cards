import { el, list } from 'redom';
import { suitpos, suits, ranks } from './card-properties.mjs';

export default class Front {
  constructor () {
    this.el = el(`.card-front`,
      this.suits = list('.card-suits', Suit),
      el('.card-tl',
        this.rank1 = el('.card-rank'),
        this.suit1 = el('.card-suit')
      ),
      el('.card-br',
        this.rank2 = el('.card-rank'),
        this.suit2 = el('.card-suit')
      )
    );
  }
  update (index) {
    if (index == null) {
      this.el.className = 'card-front';
      this.suits.update([]);
      this.rank1.textContent = '';
      this.rank2.textContent = '';
      this.suit1.textContent = '';
      this.suit2.textContent = '';
      return;
    }

    const suit = Math.floor(index / 13) % 4;
    const value = index % 13;
    const color = Math.floor(index / 13) % 2 ? 'red' : 'black';

    const ace = value === 0;
    const royal = value > 9;

    if (color === 'red') {
      this.el.classList.add('red');
      this.el.classList.remove('black');
    } else {
      this.el.classList.add('black');
      this.el.classList.remove('red');
    }

    this.value = value + 1;
    this.suits.update(suitpos[value], { suit, value, color, ace, royal });
    this.rank1.textContent = ranks[value];
    this.rank2.textContent = ranks[value];
    this.suit1.style.backgroundImage = `url(img/${suits[suit]}.svg)`;
    this.suit2.style.backgroundImage = `url(img/${suits[suit]}.svg)`;
  }
}

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
