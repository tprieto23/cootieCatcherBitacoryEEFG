import { initialState } from './game.js';

export const STORAGE_KEY = 'bitacory.journey.v1';
export const WORD_POOL = ['Asombro', 'Semilla', 'Memoria', 'Voz', 'Abrazo', 'Confianza', 'Escucha', 'Horizonte', 'Compañía', 'Encuentro', 'Juego', 'Curiosidad'];
const storyPositions = [0, 1, 2, 3, 5, 6];

export function cleanJourney(value) {
  const source = value?.version === 1 ? value : {};
  const game = source.game ?? {};
  const position = Number.isInteger(game.position) && game.position >= -1 && game.position < 8 ? game.position : -1;
  const discovered = Array.isArray(game.discovered) ? [...new Set(game.discovered.filter(index => Number.isInteger(index) && index >= 0 && index < 8))] : [];
  const words = {};
  for (const index of storyPositions) {
    if (WORD_POOL.includes(source.words?.[index]) && discovered.includes(index)) words[index] = source.words[index];
  }
  const alias = typeof source.alias === 'string' ? source.alias.trim().slice(0, 40) : '';
  if (!alias) return { version: 1, alias: '', game: { ...initialState, discovered: [] }, words: {} };
  return { version: 1, alias, words, game: { ...initialState, position, discovered, phase: position >= 0 ? 'ready' : 'idle', die: Number.isInteger(game.die) && game.die >= 1 && game.die <= 6 ? game.die : null } };
}

export function readJourney(storage) {
  try { return cleanJourney(JSON.parse(storage?.getItem(STORAGE_KEY) ?? 'null')); }
  catch { return cleanJourney(null); }
}

export function writeJourney(storage, journey) {
  if (!storage) return false;
  try { storage.setItem(STORAGE_KEY, JSON.stringify(cleanJourney({ ...journey, version: 1 }))); return true; }
  catch { return false; }
}

export function eraseJourney(storage) {
  try { storage?.removeItem(STORAGE_KEY); return true; }
  catch { return false; }
}

export function wordChoices(selected) {
  const pool = [...WORD_POOL];
  for (let index = pool.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[other]] = [pool[other], pool[index]];
  }
  const choices = pool.slice(0, 3);
  if (WORD_POOL.includes(selected) && !choices.includes(selected)) choices[0] = selected;
  return choices;
}
