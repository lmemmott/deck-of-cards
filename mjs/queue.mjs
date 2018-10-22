export default (target, handler) => {
  target._queue || (target._queue = []);
  target._queue.push(handler);

  serve(target);
};

const serve = (target) => {
  if (target._queueServing) {
    return;
  }

  if (!target._queue.length) {
    return;
  }

  target._queueServing = true;

  const action = target._queue.shift();

  const cb = () => {
    target._queueServing = false;
    serve(target);
  };

  action(cb);
};
