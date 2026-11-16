export const STATION_ROUTES = ['ultraviolet', 'homeSignal', 'everyday', 'horizontal', 'darkMatter', 'ownVoice', 'radar'];

export const routes = {
  inicio: 'home', 'sobre-mi': 'about', introduccion: 'introduction', mision: 'mission',
  mapa: 'game', jugar: 'game', alias: 'alias', bolsillo: 'recap', cierre: 'recap',
  'orbita-hogar': 'farewell', 'agujero-de-gusano': 'wormhole',
  ...Object.fromEntries(STATION_ROUTES.map((screen, index) => [`estacion-${index + 1}`, screen])),
};

export function screenForHash(hash) {
  return routes[hash.replace(/^#\/?/, '')] ?? 'home';
}

export function stationIndexForScreen(screen) {
  const index = STATION_ROUTES.indexOf(screen);
  return index < 0 ? null : index;
}
