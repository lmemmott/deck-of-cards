import animate from './animate.mjs';
import fisheryates from './fisheryates.mjs';

export default async (deck, cb) => {
  await doShuffle(deck);
  await doShuffle(deck);
  await doShuffle(deck);
};

const doShuffle = (deck) => {
  if (deck.shuffling) {
    return;
  }
  deck.shuffling = true;

  if (!deck.cards.length) {
    return;
  }

  const indexes = deck.cards.map(card => card.index);

  fisheryates(indexes);

  return new Promise(async (resolve, reject) => {
    const left = [];
    const right = [];

    while (deck.cards.length) {
      const card = deck.cards.shift();

      if (Math.random() > 0.5) {
        left.push(card);
      } else {
        right.push(card);
      }
    }

    const shuffles = [];

    while (left.length || right.length) {
      const to = { x: 0.4 + Math.random() * 0.3 };
      let card;

      if (left[0] && right[0]) {
        if (Math.random() > 0.5) {
          card = left.shift();
          to.x *= -1;
        } else {
          card = right.shift();
        }
      } else if (left[0]) {
        card = left.shift();
        to.x *= -1;
      } else if (right[0]) {
        card = right.shift();
      }

      deck.cards.push(card);

      shuffles.push({
        card,
        to
      });
    }

    shuffles.forEach(async ({ card, to }, i) => {
      const { x } = to;

      animate({
        delay: i / shuffles.length * 175,
        duration: 275,
        from: {
          z: card.z
        },
        to: {
          z: i
        },
        easing: 'linear'
      }, ({ z }, t) => {
        card.z = z;

        if (t === 1) {
          card.setIndex(indexes[i]);
        }
      });

      await new Promise((resolve) => {
        animate({
          delay: i / shuffles.length * 175,
          duration: 175,
          easing: 'cubicOut',
          from: {
            x: card.x
          },
          to: {
            x
          }
        }, ({ x }, t) => {
          card.set({ x });

          if (t === 1) {
            if (i === 0) {
              const next = deck.$cards.firstChild;

              if (card.el !== next.previousSibling) {
                deck.$cards.insertBefore(card.el, next);
              }
            } else {
              const next = shuffles[i - 1].card.el.nextSibling;

              if (next) {
                if (next.previousSibling !== card.el) {
                  deck.$cards.insertBefore(card.el, next);
                }
              } else {
                deck.$cards.appendChild(card.el);
              }
            }
            resolve();
          }
        });
      });

      animate({
        delay: 0,
        duration: 200,
        easing: 'cubicInOut',
        from: {
          x: card.x
        },
        to: {
          x: 0
        }
      }, ({ x }, t) => {
        card.set({ x });

        if (t === 1) {
          if (i === shuffles.length - 1) {
            deck.shuffling = false;
            resolve();
          }
        }
      });
    });
  });
};
