import test from 'node:test';
import assert from 'node:assert/strict';
import { GAS_CONTACT, encounterPosition, canCollectEncounterEnergy } from './galactic-encounter.js';

test('both galaxies move on curved paths and their gas envelopes meet during the encounter', () => {
  const initial = ['milky', 'andromeda'].map(kind => encounterPosition(kind, 0));
  for (const kind of ['milky', 'andromeda']) {
    const start = encounterPosition(kind, 0);
    const middle = encounterPosition(kind, .5);
    const end = encounterPosition(kind, 1);
    assert.ok(Math.hypot(end[0] - start[0], end[1] - start[1]) > 150);
    // The midpoint deviates visibly from a straight journey between the endpoints.
    assert.ok(Math.abs(middle[1] - (start[1] + end[1]) / 2) > 40);
  }
  const [a, b] = ['milky', 'andromeda'].map(kind => encounterPosition(kind, GAS_CONTACT));
  assert.ok(Math.hypot(initial[1][0] - initial[0][0], initial[1][1] - initial[0][1]) > 500);
  assert.ok(Math.hypot(b[0] - a[0], b[1] - a[1]) < 250);
});

test('the energy hotspot is collectible only after the encounter finishes and never twice', () => {
  for (const progress of [0, GAS_CONTACT, .999]) assert.equal(canCollectEncounterEnergy(progress, false), false);
  assert.equal(canCollectEncounterEnergy(1, false), true);
  assert.equal(canCollectEncounterEnergy(1, true), false);
});
