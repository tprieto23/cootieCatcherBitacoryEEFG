// An illustrative encounter, not a prediction or a numerical orbit calculation.
export const GAS_CONTACT = .8;
const routes = {
  milky: [[215, 350], [335, 410], [420, 390], [480, 325]],
  andromeda: [[780, 170], [750, 300], [670, 340], [590, 280]],
};

export function encounterPosition(galaxy, progress) {
  const [a, b, c, d] = routes[galaxy];
  const t = Math.max(0, Math.min(1, progress));
  const u = 1 - t;
  return [0, 1].map(axis => u ** 3 * a[axis] + 3 * u ** 2 * t * b[axis] + 3 * u * t ** 2 * c[axis] + t ** 3 * d[axis]);
}

export function encounterTrail(galaxy, progress, length = .3) {
  const start = Math.max(0, progress - length);
  return Array.from({ length: 22 }, (_, index) => {
    const [x, y] = encounterPosition(galaxy, start + (progress - start) * index / 21);
    return `${index ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
}
