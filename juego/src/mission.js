export const STATION_COUNT = 7;
export const REFLECTION_LIMIT = 4000;
export const DESTINATIONS = [
  { title: 'Sintoniza Ultravioleta', hint: 'Sintoniza las voces de la colectiva y recupera un pulso de energía ultravioleta.', objective: 'Recupera un pulso de energía ultravioleta', material: 'Pulso de energía ultravioleta', silhouette: 'antenna' },
  { title: 'Sigue la señal de casa', hint: 'Sigue una transmisión de voz en voz y recoge la antena de relevo.', objective: 'Recoge la antena de relevo', material: 'Antena de relevo', silhouette: 'relay' },
  { title: 'Aterriza en lo cotidiano', hint: 'Acércate a la mesa de encuentro y encuentra un hilo para la red de apoyo.', objective: 'Encuentra un hilo para la red de apoyo', material: 'Hilo para la red de apoyo', silhouette: 'table' },
  { title: 'Deja que otra voz cambie el rumbo', hint: 'Gira un prisma, cambia el ángulo de la luz y recoge el prisma de navegación.', objective: 'Recoge el prisma de navegación', material: 'Prisma de navegación', silhouette: 'prism' },
  { title: 'Comparte el timón', hint: 'Reúne las dos mitades de una brújula que se orienta entre dos personas.', objective: 'Reúne las dos mitades de una brújula compartida', material: 'Brújula compartida', silhouette: 'compass' },
  { title: 'Transmite con tu propia voz', hint: 'Registra una señal con tus propias palabras y llévate la cápsula de transmisión.', objective: 'Recoge la cápsula de transmisión', material: 'Cápsula de transmisión', silhouette: 'capsule' },
  { title: 'Busca a las que faltan en mi radar', hint: 'Ajusta el radar y localiza, por el rastro que deja, un filamento de materia oscura.', objective: 'Localiza un filamento de materia oscura', material: 'Filamento de materia oscura', silhouette: 'radar' },
];
export const ULTRAVIOLET_SIGNALS = [
  'Con mis compañeras pude hablar de lo que eso significaba para mí y escuchar cómo lo vivían ellas.',
  'Al leer esa frase junto a mis compañeras, pude ver que hasta un buen resultado daba pie a que alguien pusiera en duda lo que sabíamos.',
  'Cuando hoy escribo «yo tenía miedo», en ese «yo» también están las conversaciones con las mujeres que me ayudaron a preguntarme de dónde venía ese miedo.',
];
export const ULTRAVIOLET = {
  title: DESTINATIONS[0].title,
  question: '¿Qué pudiste reconocer al escuchar juntas las experiencias de las mujeres de Ultravioleta?',
  confirmation: 'Tu estrella de Ultravioleta ya está en tu bolsillo',
};

const validStation = index => Number.isInteger(index) && index >= 0 && index < STATION_COUNT;

export function tuneSignal(mission, index) {
  if (!Number.isInteger(index) || index < 0 || index >= ULTRAVIOLET_SIGNALS.length) return mission;
  return { ...mission, visited: [...new Set([...mission.visited, 0])], ultravioletSignals: [...new Set([...mission.ultravioletSignals, index])] };
}

export function isStationComplete(mission, index) {
  return Boolean(mission.reflections[index]) && (index !== 0 || mission.ultravioletSignals.length === 3);
}

export function completedStations(mission) {
  return DESTINATIONS.map((_, index) => index).filter(index => isStationComplete(mission, index));
}

export function connectStars(mission, first, second) {
  if (!validStation(first) || !validStation(second) || first === second || completedStations(mission).length !== STATION_COUNT) return mission;
  const pair = [first, second].sort((a, b) => a - b);
  if (mission.links.some(([a, b]) => a === pair[0] && b === pair[1])) return mission;
  return { ...mission, links: [...mission.links, pair] };
}

export function hasProtectiveBarrier(mission) {
  if (completedStations(mission).length !== STATION_COUNT) return false;
  const reached = new Set([0]);
  for (let pass = 0; pass < STATION_COUNT; pass++) {
    for (const [a, b] of mission.links) {
      if (reached.has(a)) reached.add(b);
      if (reached.has(b)) reached.add(a);
    }
  }
  return reached.size === STATION_COUNT;
}

export function updateDraft(mission, index, text) {
  if (!validStation(index) || typeof text !== 'string') return mission;
  return { ...mission, visited: [...new Set([...mission.visited, index])], drafts: { ...mission.drafts, [index]: text.slice(0, REFLECTION_LIMIT) } };
}

export function saveReflection(mission, index, text) {
  if (typeof text !== 'string' || !text.trim() || !validStation(index)) return mission;
  const next = updateDraft(mission, index, text);
  return { ...next, reflections: { ...next.reflections, [index]: next.drafts[index] } };
}

// Station numbers keep the author's original class order, including the paused fifth entry.
export function cleanMission(value, legacyDiscovered = []) {
  const visited = [...new Set((Array.isArray(value?.visited) ? value.visited : legacyDiscovered)
    .filter(validStation))];
  const reflections = {};
  const drafts = {};
  for (const index of visited) {
    const text = value?.reflections?.[index];
    // Preserve the astronaut's exact spacing and paragraphs; trim only for emptiness checks.
    if (typeof text === 'string' && text.trim()) reflections[index] = text.slice(0, REFLECTION_LIMIT);
    if (typeof value?.drafts?.[index] === 'string') drafts[index] = value.drafts[index].slice(0, REFLECTION_LIMIT);
  }
  // Already-saved stars from before the receiver retain their earned progress.
  const ultravioletSignals = Array.isArray(value?.ultravioletSignals)
    ? [...new Set(value.ultravioletSignals.filter(index => Number.isInteger(index) && index >= 0 && index < 3))]
    : value && Object.hasOwn(value, 'ultravioletSignals') ? [] : reflections[0] ? [0, 1, 2] : [];
  let mission = { visited, reflections, drafts, ultravioletSignals, links: [] };
  for (const pair of Array.isArray(value?.links) ? value.links : []) {
    if (Array.isArray(pair) && pair.length === 2) mission = connectStars(mission, pair[0], pair[1]);
  }
  return mission;
}
