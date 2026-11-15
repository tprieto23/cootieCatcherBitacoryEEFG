import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanMission, REFLECTION_LIMIT } from './mission.js';
import { readJourney, writeJourney } from './journey.js';

test('old visits and words survive the transition to the seven-station map', () => {
  let stored = JSON.stringify({ version: 1, alias: 'Luna', game: { position: 6, discovered: [0, 5, 6, 7] }, words: { 0: 'Voz', 5: 'Escucha' } });
  const storage = { getItem: () => stored, setItem: (_, value) => { stored = value; } };
  const journey = readJourney(storage);
  assert.deepEqual(journey.mission.visited, [0, 5, 6]);
  assert.deepEqual(journey.mission.reflections, {});
  assert.deepEqual(journey.game.discovered, [0, 5, 6, 7]);
  journey.mission.reflections[5] = 'Mi reflexión\ncon otra línea.';
  assert.equal(writeJourney(storage, journey), true);
  const restored = readJourney(storage);
  assert.equal(restored.mission.reflections[5], 'Mi reflexión\ncon otra línea.');
  assert.equal(restored.words[5], 'Escucha');
  assert.deepEqual(restored.game.discovered, [0, 5, 6, 7]);
});

test('a new map keeps only valid visited stations and bounded reflections', () => {
  const mission = cleanMission({ visited: [0, 0, 1, 6, 7, -1, '2'], reflections: { 0: '  Mi voz  ', 1: 'x'.repeat(REFLECTION_LIMIT + 1), 2: 'Sin visitar', 6: '   ', 7: 'Octava' } });
  assert.deepEqual(mission.visited, [0, 1, 6]);
  assert.equal(mission.reflections[0], 'Mi voz');
  assert.equal(mission.reflections[1].length, REFLECTION_LIMIT);
  assert.deepEqual(Object.keys(mission.reflections), ['0', '1']);
  assert.deepEqual(cleanMission(null), { visited: [], reflections: {} });
  assert.deepEqual(cleanMission({ visited: [], reflections: {} }, [0, 1]).visited, []);
});
