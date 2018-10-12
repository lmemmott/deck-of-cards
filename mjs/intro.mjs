import animate from './animate.mjs';

export default (deck, { delay = 300 } = {}) => {
  return new Promise((resolve) => {
    deck.cards.forEach((card, i) => {
      card.el.style.opacity = 0;
      animate({
        delay: (delay + i / deck.cards.length * 750),
        duration: 400,
        from: {
          opacity: 0,
          y: -2,
          x: 0
        },
        to: {
          opacity: 1,
          y: 0,
          x: 0
        },
        easing: 'cubicInOut'
      }, ({ x, y, opacity }, t) => {
        card.el.style.opacity = opacity === 1 ? '' : opacity;
        card.set({ x, y });

        if (t > 0.55) {
          if (card.side === 'front') {
            card.side = 'back';
          }
        }

        if (t === 1) {
          if (i === deck.cards.length - 1) {
            resolve();
          }
        }
      });
    });
  });
};
