export const STATION_COUNT = 7;
export const REFLECTION_LIMIT = 4000;
export const DESTINATIONS = [
  { title: 'Sintoniza Ultravioleta', hint: 'Sintoniza las voces de la colectiva y recupera un pulso de energía ultravioleta.', objective: 'Recupera un pulso de energía ultravioleta', material: 'Pulso de energía ultravioleta', silhouette: 'antenna' },
  { title: 'Sigue la señal de casa', hint: 'Sigue una transmisión de voz en voz y recoge la antena de relevo.', objective: 'Recoge la antena de relevo', material: 'Antena de relevo', silhouette: 'relay' },
  { title: 'Aterriza en lo cotidiano', hint: 'Acércate a la mesa de encuentro y encuentra un hilo para la red de apoyo.', objective: 'Encuentra un hilo para la red de apoyo', material: 'Hilo para la red de apoyo', silhouette: 'table' },
  { title: 'Deja que otra voz cambie el rumbo', hint: 'Acerca Andrómeda y la Vía Láctea y observa cómo cambia el rumbo de ambas.', objective: 'Recoge energía disipada en un encuentro galáctico', material: 'Energía disipada', silhouette: 'thermal' },
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
  prompt: 'Comparte una palabra o una reflexión después de haber leído este pasaje',
  confirmation: 'Tu estrella de Ultravioleta ya está en tu bolsillo',
};
export const HOME_SIGNAL = {
  introduction: 'A veces, algo que converso con mi mamá en casa vuelve a aparecer cuando ella habla con sus amigas. Sintoniza las dos señales pensando en ese recorrido. ¿Qué aporta cada mujer a la conversación?',
  prompt: 'Piensa en algo que aprendiste de otra persona y que después le contaste a alguien más. ¿Qué entendiste de otra manera al escuchar lo que esa persona tenía para decir?',
  signals: [
    { title: 'Señal 1 · ¿Desde dónde conocemos?', quote: 'Los feminismos plantean la necesidad de reconocer que todo conocimiento está situado', source: 'María Falconí Abad, pp. 107–108', href: 'https://revistacoatepec.uaemex.mx/article/download/19565/14506/' },
    { title: 'Señal 2 · ¿Hasta dónde llega lo que compartimos?', introduction: 'Al hablar de los intercambios afectivos, las autoras proponen que', quote: 'no necesariamente tienen que ser bidireccionales, sino que dicha reciprocidad pueda circular', source: 'Osorio-Cabrera, Gandarias y Fulladosa, p. 61', href: 'https://dialnet.unirioja.es/descarga/articulo/7847906.pdf' },
  ],
};
export const FABRIC_WORDS = ['Encuentros', 'Etnografía feminista', 'Pensamiento con cuidado', 'Reflexividad', 'Confianza', 'Escuchar', 'Afecto'];
export const AUTHOR_FABRIC_WORD = 'Emociones situadas';
export const OWN_VOICE_PROMPT = 'La clase nos dejó la siguiente pregunta para nuestro ejercicio de escritura: ¿Qué partes de nuestra experiencia hemos tenido que callar, traducir o dejar fuera para ser reconocidas como productoras de conocimiento? Quiero compartirla contigo para que escribas algo muy corto. Recuerda que tus palabras son energía para darle brillo a nuestras estrellas.';

const cleanFabric = value => [...new Set((Array.isArray(value) ? value : []).filter(index => Number.isInteger(index) && index >= 0 && index < FABRIC_WORDS.length))].slice(0, 2);

export function chooseFabric(mission, index) {
  if (!Number.isInteger(index) || index < 0 || index >= FABRIC_WORDS.length) return mission;
  const selected = mission.fabricDraft ?? [];
  if (selected.length === 2 && !selected.includes(index)) return mission;
  const fabricDraft = selected.includes(index) ? selected.filter(value => value !== index) : [...selected, index];
  return { ...mission, visited: [...new Set([...mission.visited, 2])], fabricDraft };
}

export function saveFabric(mission) {
  const fabricPatch = cleanFabric(mission.fabricDraft);
  if (!fabricPatch.length) return mission;
  return { ...mission, visited: [...new Set([...mission.visited, 2])], fabricPatch };
}

export function collectedStations(mission) {
  return DESTINATIONS.map((_, index) => index).filter(index => Boolean(mission.reflections[index]) || (index === 2 && cleanFabric(mission.fabricPatch).length > 0) || (index === 3 && mission.dissipatedEnergy === true));
}

// One persistent item; collecting it completes this station without writing.
export function collectDissipatedEnergy(mission) {
  if (mission.dissipatedEnergy === true) return mission;
  return { ...mission, visited: [...new Set([...mission.visited, 3])], dissipatedEnergy: true };
}

const validStation = index => Number.isInteger(index) && index >= 0 && index < STATION_COUNT;

export function tuneSignal(mission, index) {
  if (!Number.isInteger(index) || index < 0 || index >= ULTRAVIOLET_SIGNALS.length) return mission;
  return { ...mission, visited: [...new Set([...mission.visited, 0])], ultravioletSignals: [...new Set([...mission.ultravioletSignals, index])] };
}

export function tuneHomeSignal(mission, index) {
  if (!Number.isInteger(index) || index < 0 || index >= HOME_SIGNAL.signals.length) return mission;
  return { ...mission, visited: [...new Set([...mission.visited, 1])], homeSignals: [...new Set([...(mission.homeSignals ?? []), index])] };
}

export function isStationComplete(mission, index) {
  if (index === 2 && cleanFabric(mission.fabricPatch).length > 0) return true;
  if (index === 3 && mission.dissipatedEnergy === true) return true;
  return validStation(index) && Boolean(mission.reflections[index]?.trim()) && (index !== 1 || mission.homeSignals?.length === HOME_SIGNAL.signals.length);
}

export function completedStations(mission) {
  return DESTINATIONS.map((_, index) => index).filter(index => isStationComplete(mission, index));
}

export function hasStationMaterial(mission, index) {
  return index === 3 ? mission.dissipatedEnergy === true : isStationComplete(mission, index);
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
  // Stars earned before the second receiver was added remain complete.
  const homeSignals = Array.isArray(value?.homeSignals)
    ? [...new Set(value.homeSignals.filter(index => Number.isInteger(index) && index >= 0 && index < HOME_SIGNAL.signals.length))]
    : value && Object.hasOwn(value, 'homeSignals') ? [] : reflections[1] ? [0, 1] : [];
  const savedFabric = cleanFabric(value?.fabricPatch);
  const fabricPatch = savedFabric;
  const fabricDraft = cleanFabric(value?.fabricDraft ?? fabricPatch);
  if ((fabricPatch.length || fabricDraft.length) && !visited.includes(2)) visited.push(2);
  const dissipatedEnergy = value?.dissipatedEnergy === true;
  if (dissipatedEnergy && !visited.includes(3)) visited.push(3);
  let mission = { visited, reflections, drafts, ultravioletSignals, homeSignals, fabricDraft, fabricPatch, dissipatedEnergy, links: [] };
  for (const pair of Array.isArray(value?.links) ? value.links : []) {
    if (Array.isArray(pair) && pair.length === 2) mission = connectStars(mission, pair[0], pair[1]);
  }
  return mission;
}
