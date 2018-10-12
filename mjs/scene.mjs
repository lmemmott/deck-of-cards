import { el, mount } from 'redom';

export default class Scene {
  constructor () {
    this.el = el('.scene');
  }
  push (view) {
    mount(this.el, view.el);
  }
}
