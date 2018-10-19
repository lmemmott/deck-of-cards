export default (target, handler) => {
  target._queue || (target._queue = []);
  target._queue.push(handler);

  serve(target);
};

const serve = (target) => {
  if (target._queueServing) {
    return;
  }

  target._queueServing = true;

  const action = target._queue.unshift();

  const cb = () => {
    this._queueServing = false;
    serve();
  };

  action(cb);
};
