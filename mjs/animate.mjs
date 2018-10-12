import ease from './ease.mjs';

const { requestAnimationFrame } = window;

const animating = [];

const factor = 1;

const tick = () => {
  if (!animating.length) {
    return;
  }

  const now = Date.now();

  for (let i = 0; i < animating.length; i++) {
    const animation = animating[i];
    const { start, end, duration, easing, props } = animation;
    const { current } = props;

    if (now < start) {
      continue;
    }
    const t = (now > end) ? 1 : (now - start) / duration;

    animation.tick(easing(t));

    if (t === 1) {
      animating.splice(i--, 1);
    }

    animation.handler && animation.handler(current, t);
  }

  if (animating.length) {
    requestAnimationFrame(tick);
  }
};

export default ({ from, to, easing, duration, delay = 0 }, handler) => {
  const now = Date.now();
  const start = now + delay * factor;
  const end = start + duration * factor;

  if (!animating.length) {
    requestAnimationFrame(tick);
  }

  animating.push(new Animation({ from, to, start, end, duration, easing, handler }));
};

class Animation {
  constructor ({ from, to, start, end, duration, easing, handler }) {
    this.from = from;
    this.to = to;
    this.start = start;
    this.end = end;
    this.duration = duration * factor;
    this.easing = ease[easing || 'quadOut'];
    this.handler = handler;
    this.started = false;
    this.props = {
      from: {},
      to: {},
      current: {},
      delta: {}
    };
  }
  parseProps () {
    const { from, to, props } = this;

    for (const key in from) {
      if (key in to) {
        const fromValue = from[key];
        const toValue = to[key];

        if (typeof fromValue === 'function') {
          props.from[key] = fromValue();
        } else {
          props.from[key] = fromValue;
        }
        if (typeof toValue === 'function') {
          props.to[key] = toValue();
        } else {
          props.to[key] = toValue;
        }

        props.delta[key] = props.to[key] - props.from[key];
      }
    }
  }
  tick (t) {
    const { started, props } = this;
    const { current, to, delta } = props;

    if (!started) {
      this.parseProps();
    }

    for (const key in to) {
      current[key] = to[key] - delta[key] * (1 - t);
    }
  }
}
