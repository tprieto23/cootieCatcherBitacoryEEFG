export const STATION_COUNT = 7;
export const REFLECTION_LIMIT = 4000;
export const ULTRAVIOLET = {
  title: 'Sintoniza Ultravioleta',
  question: 'En la empapelada de Ultravioleta, leer juntas las frases que habíamos escuchado en la carrera nos ayudó a reconocer algo que varias vivíamos por separado. ¿Qué te hizo pensar ese encuentro?',
  confirmation: 'Tu estrella de Ultravioleta ya está en tu bolsillo',
};

const validStation = index => Number.isInteger(index) && index >= 0 && index < STATION_COUNT;

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
  return { visited, reflections, drafts };
}
