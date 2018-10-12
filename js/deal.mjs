import animate from './animate.mjs';

export default async (source, card, target, { side, duration = 300, delay = 0 }, cb) => {
  const oldPos = { x: card.x, y: card.y, z: card.z };

  const newPos = target.getPosition(target.cards.length);

  const cardDiff = {
    x: (oldPos.x - newPos.x),
    y: (oldPos.y - newPos.y),
    z: (oldPos.z - newPos.z)
  };

  const pileDiff = {
    x: (source.x - target.x),
    y: (source.y - target.y),
    z: (source.z - target.z)
  };

  const to = {
    x: card.x - pileDiff.x / 2 - cardDiff.x / 2,
    y: card.y - pileDiff.y / 2 - cardDiff.y / 2
  };

  await new Promise((resolve) => {
    animate({
      from: {
        x: card.x,
        y: card.y
      },
      to,
      easing: 'quartIn',
      delay,
      duration: duration / 2
    }, ({ x, y }, t) => {
      card.set({ x, y });

      if (t === 1) {
        resolve();
      }
    });
  });

  source.remove(card);
  target.push(card);

  const from = {
    x: card.x + pileDiff.x / 2 + cardDiff.x / 2,
    y: card.y + pileDiff.y / 2 + cardDiff.y / 2,
    z: card.z + pileDiff.z + cardDiff.z
  };

  card._set(from);

  animate({
    from,
    to: {
      z: card.z
    },
    delay: 0,
    duration: duration / 2,
    easing: 'quadIn'
  }, ({ z }) => {
    card.z = z;
  });

  await new Promise((resolve) => {
    animate({
      from,
      to: {
        x: card.x,
        y: card.y
      },
      delay: 0,
      duration: duration / 2,
      easing: 'quartOut'
    }, ({ x, y }, t) => {
      card.set({ x, y });

      if (t > 0.55) {
        if (side && card.side !== side) {
          card.side = side;
        }
      }

      if (t === 1) {
        cb && cb();
        resolve();
      }
    });
  });
};
