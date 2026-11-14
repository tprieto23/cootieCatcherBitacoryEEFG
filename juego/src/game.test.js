import test from 'node:test';
import assert from 'node:assert/strict';
import { advance, gameReducer, initialState } from './game.js';

function finishRoll(state, value) {
  let result = gameReducer(state, { type: 'roll' });
  result = gameReducer(result, { type: 'land', value });
  for (let i = 0; i < value; i++) result = gameReducer(result, { type: 'step' });
  return result;
}

test('the first roll lands on the numbered flap and later rolls accumulate', () => {
  for (let die = 1; die <= 6; die++) {
    const first = finishRoll(initialState, die);
    assert.equal(first.position, die - 1);
    assert.equal(first.phase, 'ready');
    assert.equal(first.remaining, 0);
    for (let second = 1; second <= 6; second++) {
      const next = finishRoll(first, second);
      assert.equal(next.position, (die - 1 + second) % 8);
    }
  }
  assert.equal(advance(7, 1), 0);
  assert.equal(advance(6, 6), 4);
});

test('a busy game ignores repeated throws and cannot reveal a note early', () => {
  const rolling = gameReducer(initialState, { type: 'roll' });
  assert.equal(gameReducer(rolling, { type: 'roll' }), rolling);
  assert.equal(gameReducer(rolling, { type: 'read' }), rolling);
  const moving = gameReducer(rolling, { type: 'land', value: 4 });
  assert.equal(gameReducer(moving, { type: 'roll' }), moving);
  assert.equal(gameReducer(moving, { type: 'read' }), moving);
  for (const value of [0, 7, 2.5, undefined]) assert.equal(gameReducer(rolling, { type: 'land', value }), rolling);
});

test('only opening a landed note records discovery, without duplicates; reset clears it', () => {
  const landed = finishRoll(initialState, 3);
  assert.deepEqual(landed.discovered, []);
  const opened = gameReducer(landed, { type: 'read' });
  assert.deepEqual(opened.discovered, [2]);
  assert.equal(gameReducer(opened, { type: 'read' }), opened);
  const another = gameReducer(finishRoll(opened, 2), { type: 'read' });
  assert.deepEqual(another.discovered, [2, 4]);
  assert.deepEqual(gameReducer(another, { type: 'reset' }), initialState);
});
