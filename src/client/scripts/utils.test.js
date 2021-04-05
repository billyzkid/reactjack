import { test } from 'uvu';
import * as assert from 'uvu/assert'; // see assert docs: https://github.com/lukeed/uvu/blob/next/docs/api.assert.md
import * as utils from './utils.js';

test('getNumberOrString returns number from integer', () => {
  const result = utils.getNumberOrString(123);
  assert.is(result, 123);
});

test('getNumberOrString returns number from integer string', () => {
  const result = utils.getNumberOrString('123');
  assert.is(result, 123);
});

test('getNumberOrString returns number from decimal', () => {
  const result = utils.getNumberOrString(12.3);
  assert.is(result, 12.3);
});

test('getNumberOrString returns number from decimal string', () => {
  const result = utils.getNumberOrString('12.3');
  assert.is(result, 12.3);
});

test('getNumberOrString returns string from non-numeric string', () => {
  const result = utils.getNumberOrString('42px');
  assert.is(result, '42px');
});

test('getPlayerPositions is calculated correctly for 0 players', () => {
  const result = utils.getPlayerPositions([]);

  assert.equal(result, [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ]);
});

test('getPlayerPositions is calculated correctly for primary player', () => {
  const result = utils.getPlayerPositions([
    { name: 'Will', primary: true }
  ]);

  assert.equal(result, [
    undefined,
    undefined,
    { name: 'Will', primary: true },
    undefined,
    undefined
  ]);
});

test('getPlayerPositions is calculated correctly for 1 player', () => {
  const result = utils.getPlayerPositions([
    { name: 'Will' }
  ]);

  assert.equal(result, [
    { name: 'Will' },
    undefined,
    undefined,
    undefined,
    undefined
  ]);
});

test('getPlayerPositions is calculated correctly for 2 players', () => {
  const result = utils.getPlayerPositions([
    { name: 'Will' },
    { name: 'Lisa' }
  ]);

  assert.equal(result, [
    { name: 'Will' },
    undefined,
    undefined,
    undefined,
    { name: 'Lisa' }
  ]);
});

test('getPlayerPositions is calculated correctly for 3 players', () => {
  const result = utils.getPlayerPositions([
    { name: 'Will' },
    { name: 'Lisa' },
    { name: 'Tyler' }
  ]);

  assert.equal(result, [
    { name: 'Will' },
    undefined,
    { name: 'Tyler' },
    undefined,
    { name: 'Lisa' }
  ]);
});

test('getPlayerPositions is calculated correctly for 4 players', () => {
  const result = utils.getPlayerPositions([
    { name: 'Will' },
    { name: 'Lisa' },
    { name: 'Tyler' },
    { name: 'Dan' }
  ]);

  assert.equal(result, [
    { name: 'Will' },
    { name: 'Dan' },
    { name: 'Tyler' },
    undefined,
    { name: 'Lisa' }
  ]);
});

test('getPlayerPositions is calculated correctly for 5 players', () => {
  const result = utils.getPlayerPositions([
    { name: 'Will' },
    { name: 'Lisa' },
    { name: 'Tyler' },
    { name: 'Dan' },
    { name: 'Avery' }
  ]);

  assert.equal(result, [
    { name: 'Will' },
    { name: 'Dan' },
    { name: 'Tyler' },
    { name: 'Avery' },
    { name: 'Lisa' }
  ]);
});

test('getPlayerPositions throws for 6+ players', () => {
  const fn = () => utils.getPlayerPositions([
    { name: 'Will' },
    { name: 'Lisa' },
    { name: 'Tyler' },
    { name: 'Dan' },
    { name: 'Avery' },
    { name: 'Foo' }
  ]);

  assert.throws(fn, /Table is full./);
});

test('getHandPositions is calculated correctly for 0 hands', () => {
  const result = utils.getHandPositions([]);
  assert.equal(result, []);
});

test('getHandPositions is calculated correctly for 1 hand', () => {
  const result = utils.getHandPositions([1]);
  assert.equal(result, [{ x: 0, y: 0 }]);
});

test('getHandPositions is calculated correctly for 2 hands', () => {
  const result = utils.getHandPositions([1, 2]);
  assert.equal(result, [
    { x: -2.5, y: -0.625 },
    { x: 2.5, y: 0.625 }
  ]);
});

test('getHandPositions is calculated correctly for 3 hands', () => {
  const result = utils.getHandPositions([1, 2, 3]);
  assert.equal(result, [
    { x: -5, y: -1.25 },
    { x: 0, y: 0 },
    { x: 5, y: 1.25 }
  ]);
});

test('getHandPositions is calculated correctly for 4 hands', () => {
  const result = utils.getHandPositions([1, 2, 3, 4]);
  assert.equal(result, [
    { x: -7.5, y: -1.875 },
    { x: -2.5, y: -0.625 },
    { x: 2.5, y: 0.625 },
    { x: 7.5, y: 1.875 }
  ]);
});

test('getHandTotal is calculated correctly for 0 cards', () => {
  const hand = { active: false, bet: 10, cards: []};
  const result = utils.getHandTotal(hand);

  assert.is(result.total, 0);
  assert.is(result.displayTotal, '');
});

test('getHandTotal is calculated correctly for 1 card', () => {
  const hand = { active: false, bet: 10, cards: [
    { rank: 'two', suit: 'spades' }
  ]};
  const result = utils.getHandTotal(hand);

  assert.is(result.total, 2);
  assert.is(result.displayTotal, '2');
});

test('getHandTotal is calculated correctly for 2 cards', () => {
  const hand = { active: false, bet: 10, cards: [
    { rank: 'two', suit: 'spades' },
    { rank: 'five', suit: 'hearts' }
  ]};
  const result = utils.getHandTotal(hand);

  assert.is(result.total, 7);
  assert.is(result.displayTotal, '7');
});

test('getHandTotal is calculated correctly for 3 cards', () => {
  const hand = { active: false, bet: 10, cards: [
    { rank: 'two', suit: 'spades' },
    { rank: 'five', suit: 'hearts' },
    { rank: 'eight', suit: 'diamonds' }
  ]};
  const result = utils.getHandTotal(hand);

  assert.is(result.total, 15);
  assert.is(result.displayTotal, '15');
});

test('getHandTotal is calculated correctly for 4 cards', () => {
  const hand = { active: false, bet: 10, cards: [
    { rank: 'two', suit: 'spades' },
    { rank: 'five', suit: 'hearts' },
    { rank: 'eight', suit: 'diamonds' },
    { rank: 'ten', suit: 'clubs' },
  ]};
  const result = utils.getHandTotal(hand);

  assert.is(result.total, 25);
  assert.is(result.displayTotal, '25');
});

test('getHandTotal is calculated correctly for an ace', () => {
  const hand = { active: false, bet: 10, cards: [
    { rank: 'ace', suit: 'spades' }
  ]};
  const result = utils.getHandTotal(hand);

  assert.is(result.total, 11);
  assert.is(result.displayTotal, '1 or 11');
});

test('getHandTotal is calculated correctly for an ace plus 1 card', () => {
  const hand = { active: false, bet: 10, cards: [
    { rank: 'ace', suit: 'spades' },
    { rank: 'six', suit: 'hearts' }
  ]};
  const result = utils.getHandTotal(hand);

  assert.is(result.total, 17);
  assert.is(result.displayTotal, '7 or 17');
});

test('getHandTotal is calculated correctly for an ace plus 2 cards', () => {
  const hand = { active: false, bet: 10, cards: [
    { rank: 'ace', suit: 'spades' },
    { rank: 'six', suit: 'hearts' },
    { rank: 'ten', suit: 'diamonds' },
  ]};
  const result = utils.getHandTotal(hand);

  assert.is(result.total, 17);
  assert.is(result.displayTotal, '17');
});

test('getHandTotal is calculated correctly for an ace plus 3 cards', () => {
  const hand = { active: false, bet: 10, cards: [
    { rank: 'ace', suit: 'spades' },
    { rank: 'six', suit: 'hearts' },
    { rank: 'ten', suit: 'diamonds' },
    { rank: 'five', suit: 'clubs' },
  ]};
  const result = utils.getHandTotal(hand);

  assert.is(result.total, 22);
  assert.is(result.displayTotal, '22');
});

test('getHandTotal is calculated correctly for blackjack', () => {
  const hand = { active: false, bet: 10, cards: [
    { rank: 'ace', suit: 'spades' },
    { rank: 'king', suit: 'hearts' }
  ]};
  const result = utils.getHandTotal(hand);

  assert.is(result.total, 21);
  assert.is(result.displayTotal, '11 or 21');
});

test('formatMoney formats whole numbers', () => {
  const result = utils.formatMoney(10);
  assert.is(result, '$10');
});

test('formatMoney formats decimals', () => {
  const result = utils.formatMoney(0.5);
  assert.is(result, '$0.50');
});

test.run();
