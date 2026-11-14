import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanJourney, readJourney, writeJourney, eraseJourney, STORAGE_KEY, wordChoices } from './journey.js';

test('a saved journey restores an alias, opened entries and selected words', () => {
  const data = cleanJourney({ version: 1, alias: ' Luna ', game: { position: 2, phase: 'ready', die: 3, discovered: [2, 0, 2] }, words: { 2: 'Confianza', 0: 'Voz' } });
  assert.equal(data.alias, 'Luna');
  assert.deepEqual(data.game.discovered, [2, 0]);
  assert.deepEqual(data.words, { 0: 'Voz', 2: 'Confianza' });
  assert.equal(data.game.phase, 'ready');
});

test('malformed storage and unsupported data cannot invent a completed journey', () => {
  assert.equal(readJourney({ getItem: () => '{broken' }).alias, '');
  const data = cleanJourney({ version: 1, alias: 'Luna', game: { position: 50, discovered: ['2', -1, 80, 0, 0] }, words: { 0: 'Voz', 2: 'Confianza', 4: 'Asombro', 99: 'Memoria' } });
  assert.equal(data.game.position, -1);
  assert.deepEqual(data.game.discovered, [0]);
  assert.deepEqual(data.words, { 0: 'Voz' });
  assert.deepEqual(cleanJourney({ version: 2, alias: 'Luna' }).words, {});
});

test('an interrupted animation is restored to a stable position', () => {
  const data = cleanJourney({ version: 1, alias: 'Luna', game: { position: 3, phase: 'moving', remaining: 4 } });
  assert.equal(data.game.phase, 'ready');
  assert.equal(data.game.remaining, 0);
});

test('storage can be saved and erased, and blocked storage fails gracefully', () => {
  const memory = new Map();
  const storage = { getItem: key => memory.get(key), setItem: (key, value) => memory.set(key, value), removeItem: key => memory.delete(key) };
  assert.equal(writeJourney(storage, { alias: 'Luna', game: { position: 0, discovered: [0] }, words: { 0: 'Voz' } }), true);
  assert.equal(readJourney(storage).words[0], 'Voz');
  assert.equal(eraseJourney(storage), true);
  assert.equal(memory.has(STORAGE_KEY), false);
  assert.equal(writeJourney(null, {}), false);
  assert.equal(writeJourney({ setItem() { throw Error('denied'); } }, {}), false);
});

test('word suggestions are unique and always include a previous selection', () => {
  const choices = wordChoices('Memoria');
  assert.equal(new Set(choices).size, 3);
  assert.ok(choices.includes('Memoria'));
});
