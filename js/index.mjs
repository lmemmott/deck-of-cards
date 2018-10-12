/* global io */

import { mount } from 'redom';

import Scene from './scene.mjs';
import Deck from './deck.mjs';
import Hand from './hand.mjs';
import intro from './intro.mjs';

const scene = new Scene();
const desk = new Hand({ x: -2.25, spread: 1 + 1 / 8 });
const opponent = new Hand({ y: -1.5, x: 0, rotate: true, spread: 1 + 1 / 8 });
const opponentFlipped = new Hand({ y: -1.5, x: 0, rotate: true, spread: 1 + 1 / 8 });
const you = new Hand({ y: 1.5, x: 0, spread: 1 + 1 / 8 });
const deck = new Deck();

mount(scene, desk);
mount(scene, opponent);
mount(scene, opponentFlipped);
mount(scene, you);
mount(scene, deck);
mount(document.body, scene);

const start = async () => {
  await deck.shuffle();
  await deck.dealTo(opponent, { side: 'back', moveDeck: true });
  await deck.dealTo(you, { side: 'front', moveDeck: true });
  await deck.dealTo(opponent, { side: 'back', moveDeck: true });
  await deck.dealTo(you, { side: 'front', moveDeck: true });
  await deck.dealTo(desk, { side: 'front', moveDeck: true });
  await deck.dealTo(desk, { side: 'front', moveDeck: true });
  await deck.dealTo(desk, { side: 'front', moveDeck: true });
  await deck.animateTo({ x: -3.5, y: 0 });
  await deck.dealTo(desk, { side: 'front', delay: 1000, moveDeck: true });
  await deck.animateTo({ x: -3.5, y: 0 });
  await deck.dealTo(desk, { side: 'front', delay: 1000, moveDeck: true });
  await deck.animateTo({ x: -3.5, y: 0 });
  await opponent.flip(0, opponentFlipped, { side: 'front' });
  await opponent.flip(0, opponentFlipped, { side: 'front' });

  await Promise.all(opponentFlipped.cards.concat(desk.cards).concat(you.cards).map((card, i) => new Promise(async (resolve) => {
    await card.dealTo(deck, { side: 'back', delay: i * 100 + 1000 });
    resolve();
  })));

  await deck.animateTo({ x: 0, y: 0 });

  await start();
};

(async () => {
  await intro(deck);
  await start();
})();

const socket = io('/');

socket.on('hello', () => {
  console.log('Hello!');
});
