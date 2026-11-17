import test from 'node:test';
import assert from 'node:assert/strict';
import { routes, STATION_ROUTES, screenForHash, screenForJourney, stationIndexForScreen } from './navigation.js';
import { cleanMission, saveReflection, tuneHomeSignal, connectStars, hasProtectiveBarrier } from './mission.js';

test('all seven landings have their own route, including six and seven after a reload', () => {
  assert.equal(new Set(STATION_ROUTES).size, 7);
  for (let index = 0; index < 7; index++) {
    const screen = STATION_ROUTES[index];
    assert.equal(screenForHash(`#/estacion-${index + 1}`), screen);
    assert.equal(screenForHash(`#estacion-${index + 1}`), screen);
    assert.equal(stationIndexForScreen(screen), index);
    assert.notEqual(screen, 'game');
  }
  assert.equal(screenForHash('#/estacion-6'), 'ownVoice');
  assert.equal(screenForHash('#/estacion-7'), 'radar');
});

test('homecoming requires a connected seven-star network, including after reload', () => {
  let mission = cleanMission(null);
  for (const hash of ['#/agujero-de-gusano', '#/mision-completada', '#/tunel-al-bolsillo']) {
    const route = screenForHash(hash);
    assert.equal(screenForJourney(route, '', false), 'alias');
    assert.equal(screenForJourney(route, 'Luna', hasProtectiveBarrier(mission)), 'recap');
  }
  for (let index = 0; index < 7; index++) mission = saveReflection(mission, index, `Recuerdo ${index + 1}`);
  for (const index of [0, 1]) mission = tuneHomeSignal(mission, index);
  assert.equal(screenForJourney('complete', 'Luna', hasProtectiveBarrier(mission)), 'recap');
  for (let index = 0; index < 6; index++) mission = connectStars(mission, index, index + 1);
  const restored = cleanMission(JSON.parse(JSON.stringify(mission)));
  assert.equal(screenForJourney('wormhole', 'Luna', hasProtectiveBarrier(restored)), 'wormhole');
  assert.equal(screenForJourney(screenForHash('#/mision-completada'), 'Luna', hasProtectiveBarrier(restored)), 'complete');
  assert.equal(screenForJourney(screenForHash('#/tunel-al-bolsillo'), 'Luna', hasProtectiveBarrier(restored)), 'pocketTunnel');
  assert.equal(screenForJourney(screenForHash('#/objetos-del-bolsillo'), 'Luna', hasProtectiveBarrier(restored)), 'objects');
  assert.equal(screenForJourney('objects', '', true), 'alias');
  assert.equal(screenForJourney('objects', 'Luna', false), 'objects');
  assert.equal(screenForJourney('farewell', 'Luna', false), 'farewell');
  assert.equal(screenForJourney('home', '', false), 'home');
});

test('the map, homecoming and legacy routes keep their existing behavior', () => {
  assert.equal(screenForHash('#/mapa'), 'game');
  assert.equal(screenForHash('#/jugar'), 'game');
  assert.equal(screenForHash('#/orbita-hogar'), 'farewell');
  assert.equal(screenForHash('#/agujero-de-gusano'), 'wormhole');
  assert.equal(screenForHash('#/bolsillo'), 'recap');
  assert.equal(screenForHash('#/cierre'), 'recap');
  assert.equal(screenForHash(''), 'home');
  assert.equal(screenForHash('#/unknown'), 'home');
  assert.equal(stationIndexForScreen('game'), null);
  assert.equal(Object.keys(routes).find(key => routes[key] === 'game'), 'mapa');
});
