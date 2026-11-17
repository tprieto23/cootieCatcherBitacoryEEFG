export const STATION_ROUTES = ['ultraviolet', 'homeSignal', 'everyday', 'horizontal', 'darkMatter', 'ownVoice', 'radar'];

export const routes = {
  inicio: 'home', 'sobre-mi': 'about', introduccion: 'introduction', mision: 'mission',
  mapa: 'game', jugar: 'game', alias: 'alias', bolsillo: 'recap', cierre: 'recap',
  'orbita-hogar': 'farewell', 'agujero-de-gusano': 'wormhole', 'mision-completada': 'complete',
  'tunel-al-bolsillo': 'pocketTunnel', 'objetos-del-bolsillo': 'objects',
  ...Object.fromEntries(STATION_ROUTES.map((screen, index) => [`estacion-${index + 1}`, screen])),
};

export function screenForHash(hash) {
  return routes[hash.replace(/^#\/?/, '')] ?? 'home';
}

export function screenForJourney(route, alias, barrier) {
  if (['game', 'recap', 'farewell', 'wormhole', 'complete', 'pocketTunnel', 'objects', ...STATION_ROUTES].includes(route) && !alias) return 'alias';
  if (['wormhole', 'complete', 'pocketTunnel'].includes(route) && !barrier) return 'recap';
  return route;
}

export function stationIndexForScreen(screen) {
  const index = STATION_ROUTES.indexOf(screen);
  return index < 0 ? null : index;
}
