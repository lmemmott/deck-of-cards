import { el, mount } from 'redom';

export default class Scene {
  constructor () {
    this.el = el('.scene');
  }
  append (view) {
    mount(this.el, view.el);
  }
}
