import test from 'node:test';
import assert from 'node:assert/strict';
import { routes, STATION_ROUTES, screenForHash, stationIndexForScreen } from './navigation.js';

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

test('the map, homecoming and legacy routes keep their existing behavior', () => {
  assert.equal(screenForHash('#/mapa'), 'game');
  assert.equal(screenForHash('#/jugar'), 'game');
  assert.equal(screenForHash('#/orbita-hogar'), 'farewell');
  assert.equal(screenForHash('#/cierre'), 'recap');
  assert.equal(screenForHash(''), 'home');
  assert.equal(screenForHash('#/unknown'), 'home');
  assert.equal(stationIndexForScreen('game'), null);
  assert.equal(Object.keys(routes).find(key => routes[key] === 'game'), 'mapa');
});
