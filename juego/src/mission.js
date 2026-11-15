export const STATION_COUNT = 7;
export const REFLECTION_LIMIT = 4000;

// Station numbers keep the author's original class order, including the paused fifth entry.
export function cleanMission(value, legacyDiscovered = []) {
  const visited = [...new Set((Array.isArray(value?.visited) ? value.visited : legacyDiscovered)
    .filter(index => Number.isInteger(index) && index >= 0 && index < STATION_COUNT))];
  const reflections = {};
  for (const index of visited) {
    const text = value?.reflections?.[index];
    if (typeof text === 'string' && text.trim()) reflections[index] = text.trim().slice(0, REFLECTION_LIMIT);
  }
  return { visited, reflections };
}
