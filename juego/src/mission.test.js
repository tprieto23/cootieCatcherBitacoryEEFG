import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanMission, REFLECTION_LIMIT, updateDraft, saveReflection } from './mission.js';
import { readJourney, writeJourney } from './journey.js';
import { readFileSync } from 'node:fs';
import { tuneSignal, tuneHomeSignal, completedStations, isStationComplete, ULTRAVIOLET_SIGNALS, connectStars, hasProtectiveBarrier } from './mission.js';

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
  assert.equal(mission.reflections[0], '  Mi voz  ');
  assert.equal(mission.reflections[1].length, REFLECTION_LIMIT);
  assert.deepEqual(Object.keys(mission.reflections), ['0', '1']);
  assert.deepEqual(cleanMission(null), { visited: [], reflections: {}, drafts: {}, ultravioletSignals: [], homeSignals: [], links: [] });
  assert.deepEqual(cleanMission({ visited: [], reflections: {} }, [0, 1]).visited, []);
});

test('the three received fragments are literal passages of the author’s first entry', () => {
  const text = readFileSync(new URL('./entries/entrada-1.md', import.meta.url), 'utf8');
  assert.equal(new Set(ULTRAVIOLET_SIGNALS).size, 3);
  for (const fragment of ULTRAVIOLET_SIGNALS) assert.ok(text.includes(fragment));
});

test('Ultravioleta completes with a saved reflection, independently of the archived receiver', () => {
  let mission = saveReflection(cleanMission(null), 0, 'Lo que reconocí.');
  assert.equal(isStationComplete(mission, 0), true);
  for (const index of [2, 2, 0, -1, 3]) mission = tuneSignal(mission, index);
  assert.deepEqual(mission.ultravioletSignals, [2, 0]);
  assert.equal(completedStations(mission).length, 1);
  mission = tuneSignal(mission, 1);
  assert.equal(completedStations(mission).length, 1);
  const edited = saveReflection(mission, 0, 'Otra mirada.');
  assert.equal(completedStations(edited).length, 1);
  assert.deepEqual(edited.ultravioletSignals, mission.ultravioletSignals);
  let reverse = cleanMission(null);
  for (const index of [0, 1, 2]) reverse = tuneSignal(reverse, index);
  assert.equal(completedStations(reverse).length, 0);
  assert.equal(completedStations(saveReflection(reverse, 0, 'Mi voz.')).length, 1);
  assert.equal(isStationComplete(cleanMission({ visited: [0], reflections: { 0: 'Mi estrella.' }, ultravioletSignals: [] }), 0), true);
});

test('the second station preserves its own draft and updates a single star across reloads', () => {
  let stored;
  const storage = { getItem: () => stored, setItem: (_, value) => { stored = value; } };
  const first = saveReflection(cleanMission(null), 0, 'Mi primera estrella');
  const draft = '  De voz en voz.\n\nUna conversación en casa.  ';
  writeJourney(storage, { alias: 'Luna', mission: updateDraft(first, 1, draft) });
  const restored = readJourney(storage).mission;
  assert.equal(restored.drafts[1], draft);
  assert.equal(isStationComplete(restored, 1), false);
  const saved = saveReflection(tuneHomeSignal(tuneHomeSignal(restored, 0), 1), 1, draft);
  assert.deepEqual(completedStations(saved), [0, 1]);
  writeJourney(storage, { alias: 'Luna', mission: saveReflection(saved, 1, 'Otra conexión.\n\nCon mis propias palabras.') });
  const edited = readJourney(storage).mission;
  assert.equal(edited.reflections[0], first.reflections[0]);
  assert.equal(edited.reflections[1], 'Otra conexión.\n\nCon mis propias palabras.');
  assert.equal(Object.keys(edited.reflections).length, 2);
});

test('the second receiver needs two distinct signals and a reflection, without affecting station one', () => {
  let mission = saveReflection(cleanMission(null), 0, 'Mi estrella de Ultravioleta.');
  mission = saveReflection(mission, 1, '  Mi reflexión de casa.\n\nDe voz en voz.  ');
  assert.equal(isStationComplete(mission, 0), true);
  assert.equal(isStationComplete(mission, 1), false);
  for (const index of [1, 1, -1, 2, '0']) mission = tuneHomeSignal(mission, index);
  assert.deepEqual(mission.homeSignals, [1]);
  assert.deepEqual(mission.ultravioletSignals, []);
  assert.equal(isStationComplete(mission, 1), false);
  mission = tuneHomeSignal(mission, 0);
  assert.deepEqual(completedStations(mission), [0, 1]);
  assert.equal(mission.reflections[1], '  Mi reflexión de casa.\n\nDe voz en voz.  ');
  const signalsFirst = tuneHomeSignal(tuneHomeSignal(cleanMission(null), 0), 1);
  assert.equal(isStationComplete(signalsFirst, 1), false);
  assert.equal(isStationComplete(saveReflection(signalsFirst, 1, 'Otra mirada.'), 1), true);
});

test('second receiver progress persists and older second stars keep their progress and barrier links', () => {
  let stored;
  const storage = { getItem: () => stored, setItem: (_, value) => { stored = value; } };
  const partial = tuneHomeSignal(updateDraft(cleanMission(null), 1, 'Mi borrador intacto.'), 0);
  writeJourney(storage, { alias: 'Luna', mission: partial });
  const restored = readJourney(storage).mission;
  assert.deepEqual(restored.homeSignals, [0]);
  assert.equal(restored.drafts[1], 'Mi borrador intacto.');
  assert.equal(isStationComplete(restored, 1), false);
  const old = cleanMission({ visited: [0,1,2,3,4,5,6], reflections: Object.fromEntries(Array.from({ length: 7 }, (_, i) => [i, `Reflexión ${i}`])), links: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]] });
  assert.deepEqual(old.homeSignals, [0, 1]);
  assert.equal(hasProtectiveBarrier(old), true);
  assert.equal(isStationComplete(cleanMission({ visited: [1], reflections: { 1: 'Guardada antes de sintonizar.' }, homeSignals: [] }), 1), false);
  assert.deepEqual(cleanMission({ homeSignals: [0,0,1,2,-1,'1'] }).homeSignals, [0, 1]);
});

test('receiver progress survives reload and earned stars migrate without losing reflections', () => {
  let stored;
  const storage = { getItem: () => stored, setItem: (_, value) => { stored = value; } };
  const mission = tuneSignal(updateDraft(cleanMission(null), 0, 'Borrador sin guardar'), 1);
  writeJourney(storage, { alias: 'Luna', mission });
  const restored = readJourney(storage).mission;
  assert.deepEqual(restored.ultravioletSignals, [1]);
  assert.equal(restored.drafts[0], 'Borrador sin guardar');
  assert.equal(isStationComplete(restored, 0), false);
  const old = cleanMission({ visited: [0], reflections: { 0: 'Mi estrella anterior.' } });
  assert.equal(isStationComplete(old, 0), true);
  assert.equal(old.reflections[0], 'Mi estrella anterior.');
  const invalid = cleanMission({ visited: [0], reflections: { 0: 'Mi voz.' }, ultravioletSignals: ['0', 0, 0, 3], links: [[0, 8]] });
  assert.deepEqual(invalid.ultravioletSignals, [0]);
  assert.deepEqual(invalid.links, []);
});

test('the protective barrier needs all seven stars in one connected network and persists', () => {
  let mission = cleanMission(null);
  assert.strictEqual(connectStars(mission, 0, 1), mission);
  for (let index = 0; index < 7; index++) mission = saveReflection(mission, index, `Reflexión ${index + 1}`);
  assert.equal(hasProtectiveBarrier(mission), false);
  for (const index of [0, 1, 2]) mission = tuneSignal(mission, index);
  for (const index of [0, 1]) mission = tuneHomeSignal(mission, index);
  for (const [a, b] of [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 6]]) mission = connectStars(mission, a, b);
  assert.equal(hasProtectiveBarrier(mission), false);
  mission = connectStars(mission, 2, 3);
  assert.equal(hasProtectiveBarrier(mission), true);
  assert.strictEqual(connectStars(mission, 3, 2), mission);
  assert.strictEqual(connectStars(mission, 0, 0), mission);
  assert.strictEqual(connectStars(mission, 0, 7), mission);
  const restored = cleanMission(JSON.parse(JSON.stringify(mission)));
  assert.equal(hasProtectiveBarrier(restored), true);
  assert.deepEqual(restored.links, mission.links);
});

test('a draft survives reload without creating a star, including a deliberately empty edit', () => {
  let stored;
  const storage = { getItem: () => stored, setItem: (_, value) => { stored = value; } };
  const text = '  Una palabra propia.\n\nOtro párrafo.  ';
  const mission = updateDraft(cleanMission(null), 0, text);
  writeJourney(storage, { alias: 'Luna', mission });
  let restored = readJourney(storage);
  assert.deepEqual(restored.mission.visited, [0]);
  assert.equal(restored.mission.drafts[0], text);
  assert.deepEqual(restored.mission.reflections, {});
  const saved = saveReflection(restored.mission, 0, text);
  writeJourney(storage, { ...restored, mission: updateDraft(saved, 0, '') });
  restored = readJourney(storage);
  assert.equal(restored.mission.drafts[0], '');
  assert.equal(restored.mission.reflections[0], text);
});

test('saving and editing Ultravioleta keeps exact words and updates one star without touching others', () => {
  const initial = saveReflection(cleanMission(null), 1, 'Otra estación');
  const first = saveReflection(initial, 0, '  Mi voz\n\ncon más de un párrafo.  ');
  assert.equal(first.reflections[0], '  Mi voz\n\ncon más de un párrafo.  ');
  const edited = saveReflection(first, 0, 'Escucharnos.\n\nVolver a pensar juntas.');
  assert.deepEqual(edited.visited, [1, 0]);
  assert.equal(Object.keys(edited.reflections).length, 2);
  assert.equal(edited.reflections[1], 'Otra estación');
  assert.equal(edited.reflections[0], 'Escucharnos.\n\nVolver a pensar juntas.');
  assert.equal(edited.drafts[0], edited.reflections[0]);
  assert.strictEqual(saveReflection(edited, 0, ' \n '), edited);
  assert.strictEqual(saveReflection(edited, 7, 'Fuera del mapa'), edited);
});
