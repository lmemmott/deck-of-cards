import { el, mount, unmount } from 'redom';

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
  dealTo (target, { side, delay, index = this.parent.cards.indexOf(this) }) {
    return this.parent.dealTo(target, { side, delay, index });
  }
}

Card.create = (index, z) => {
  return new Card(index, z);
};
