import React, { useEffect, useRef, useState } from 'react';
import { DARK_MATTER_FRAGMENTS } from './mission.js';
import './dark-matter-encounter.css';

const noise = seed => { const n = Math.sin(seed * 127.1 + 23) * 43758.5453; return n - Math.floor(n); };
const field = Array.from({ length: 125 }, (_, i) => [noise(i + 1) * 1000, noise(i + 401) * 600, .4 + noise(i + 801)]);
const disc = Array.from({ length: 180 }, (_, i) => {
  const t = (i % 90) / 89;
  const a = t * Math.PI * 4 + (i < 90 ? 0 : Math.PI);
  return [500 + Math.cos(a) * (5 + t * 106), 300 + Math.sin(a) * (5 + t * 106) * .45, .5 + noise(i + 1201) * 1.3];
});
const regions = [[250, 215], [750, 370]];

export function DarkMatterEncounter({ observed, fragments, onObserve, onCollect, onRead, readings, motion }) {
  const [active, setActive] = useState(null);
  const [flight, setFlight] = useState(null);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const root = useRef(null);
  const targets = useRef([]);
  const quoteRef = useRef(null);
  const animate = motion && !reduced;
  const fragment = active === null ? null : DARK_MATTER_FRAGMENTS[active];

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(preference.matches);
    preference.addEventListener('change', change);
    return () => preference.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (!flight) return;
    const timeout = window.setTimeout(() => setFlight(null), animate ? 1250 : 0);
    return () => window.clearTimeout(timeout);
  }, [flight, animate]);

  function reveal(index) {
    setActive(index);
    window.requestAnimationFrame(() => {
      quoteRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      quoteRef.current?.focus({ preventScroll: true });
    });
  }
  function collect() {
    if (active === null || fragments.includes(active)) return;
    const origin = targets.current[active]?.getBoundingClientRect();
    const pocket = root.current?.closest('.ultraviolet-visit')?.querySelector('.visit-pocket-button')?.getBoundingClientRect();
    if (animate && origin && pocket) setFlight({ x: origin.x + origin.width / 2, y: origin.y + origin.height / 2, dx: pocket.x + pocket.width / 2 - origin.x - origin.width / 2, dy: pocket.y + pocket.height / 2 - origin.y - origin.height / 2 });
    onCollect(active);
  }

  return <section ref={root} className={`dark-matter-encounter ${observed ? 'is-observed' : ''} ${animate ? '' : 'dark-matter-still'}`} aria-labelledby="dark-matter-title">
    <h2 className="dark-matter-label" id="dark-matter-title">LO QUE SOSTIENE LA GALAXIA</h2>
    <p>En las galaxias hay estrellas, gas y polvo, pero gran parte de su masa corresponde a materia oscura. No emite ni refleja luz que podamos observar. La reconocemos por su gravedad: influye en el movimiento de las estrellas y puede desviar la luz que viene de más lejos. Todavía investigamos de qué está hecha. <a href="https://science.nasa.gov/dark-matter/" target="_blank" rel="noopener noreferrer">Más sobre materia oscura · NASA</a></p>
    <p>En esta historia, ese gran halo representa la potencia de los saberes locales y cotidianos que la academia no siempre reconoce. Hay mucho más sosteniendo este universo que lo que vemos brillar. Las dos frases de esta entrada serán los fragmentos que podrás llevar contigo.</p>
    <figure className="dark-matter-viewport">
      <svg viewBox="0 0 1000 600" role="group" aria-label={observed ? 'Halo de masa inferida alrededor de una galaxia. Dos huellas gravitacionales permiten descubrir frases.' : 'Estrellas girando alrededor de una galaxia; sus órbitas sugieren una masa que no vemos.'}>
        <defs>
          <radialGradient id="dark-galaxy-core"><stop stopColor="#fff2ce" /><stop offset=".2" stopColor="#fddd46" stopOpacity=".8" /><stop offset="1" stopColor="#fca4bc" stopOpacity="0" /></radialGradient>
          <radialGradient id="dark-halo"><stop stopColor="#8b6ec8" stopOpacity=".1" /><stop offset=".5" stopColor="#ad82d8" stopOpacity=".3" /><stop offset=".8" stopColor="#b8a0ed" stopOpacity=".19" /><stop offset="1" stopColor="#7d5aa1" stopOpacity="0" /></radialGradient>
          <radialGradient id="dark-fragment"><stop stopColor="#d8b2e5" stopOpacity=".65" /><stop offset=".35" stopColor="#ae7cc4" stopOpacity=".35" /><stop offset="1" stopColor="#795392" stopOpacity="0" /></radialGradient>
          <filter id="dark-halo-texture" x="-20%" y="-30%" width="140%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="2" seed="23" result="grain" /><feDisplacementMap in="SourceGraphic" in2="grain" scale="40" /><feGaussianBlur stdDeviation="4" /></filter>
        </defs>
        <g fill="#d4dcf3" aria-hidden="true">{field.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} opacity={.25 + noise(i + 1601) * .4} />)}</g>
        <g className="dark-halo-field" aria-hidden="true"><ellipse cx="500" cy="300" rx="425" ry="245" fill="url(#dark-halo)" filter="url(#dark-halo-texture)" /><ellipse cx="500" cy="300" rx="350" ry="210" /><ellipse cx="500" cy="300" rx="414" ry="241" /></g>
        <g className="dark-orbit-tracks" aria-hidden="true">{[190, 275, 360].map(r => <ellipse key={r} cx="500" cy="300" rx={r} ry={r * .57} />)}</g>
        <g aria-hidden="true" className="dark-visible-disc"><ellipse cx="500" cy="300" rx="125" ry="68" fill="url(#dark-galaxy-core)" opacity=".45" />{disc.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={i % 7 ? '#e6bbd7' : '#fff3cc'} opacity=".8" />)}<ellipse cx="500" cy="300" rx="30" ry="22" fill="url(#dark-galaxy-core)" /></g>
        <g className="dark-orbit-stars" transform="translate(500 300) scale(1 .57)" aria-hidden="true">{[0, 1, 2].map(i => <g key={i} className="dark-orbiter" style={{ '--orbit-duration': `${20 + i * 9}s`, '--orbit-start': `${i * -7}s` }}><circle cx={[190, 275, 360][i]} cy="0" r="4" fill={i === 1 ? '#fca4bc' : '#d4dcf3'} /><circle cx={[190, 275, 360][i]} cy="0" r="10" fill="#d4dcf317" /></g>)}</g>
        {observed && regions.map(([x, y], index) => <g
          key={index}
          className={`dark-matter-region ${fragments.includes(index) ? 'is-collected' : ''}`}
          role="button" tabIndex={0}
          aria-label={`Explorar fragmento ${index + 1} de materia oscura${fragments.includes(index) ? ', ya guardado' : ''}`}
          aria-pressed={active === index}
          onClick={() => reveal(index)}
          onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); reveal(index); } }}
        >
          <ellipse ref={node => { targets.current[index] = node; }} cx={x} cy={y} rx="95" ry="74" fill="url(#dark-fragment)" />
          <path className="dark-lensing-arc" d={`M${x - 53} ${y + 24}Q${x - 84} ${y - 44} ${x - 10} ${y - 51}M${x + 18} ${y + 53}Q${x + 84} ${y + 26} ${x + 52} ${y - 25}`} />
          <ellipse className="dark-region-target" cx={x} cy={y} rx="100" ry="84" fill="transparent" />
          <text x={x} y={y + 7} textAnchor="middle">{fragments.includes(index) ? '✓' : index + 1}</text>
        </g>)}
        <text className="dark-disc-label" x="500" y="392" textAnchor="middle">Estrellas, gas y polvo</text>
      </svg>
      <figcaption>{observed ? 'El halo coloreado representa materia inferida por su gravedad. Toca sus dos huellas.' : 'Vemos las estrellas. Sus movimientos nos invitan a buscar más allá de la luz.'}</figcaption>
    </figure>
    <div className="dark-matter-controls"><button type="button" className="cover-open" onClick={onObserve} disabled={observed}>{observed ? 'Halo localizado' : 'Seguir la gravedad'}<span aria-hidden="true">↗</span></button></div>
    {fragment && <div ref={quoteRef} tabIndex={-1} className="dark-matter-fragment" aria-labelledby="dark-fragment-title">
      <h3 id="dark-fragment-title">Fragmento {active + 1} de materia oscura</h3>
      <blockquote><p>{fragment.quote}</p><cite>— {fragment.source}</cite></blockquote>
      <a href={readings[fragment.reading]} target="_blank" rel="noopener noreferrer">Abrir la lectura de referencia</a>
      <div className="dark-matter-controls"><button type="button" className="cover-open" onClick={collect} disabled={fragments.includes(active)}>{fragments.includes(active) ? 'Fragmento en tu bolsillo' : 'Recoger este fragmento'}<span aria-hidden="true">↗</span></button></div>
    </div>}
    <p className="dark-matter-status" role="status" aria-live="polite">{fragments.length === 2 ? 'Los dos fragmentos de materia oscura están en tu bolsillo. Tu estrella ya brilla.' : `${fragments.length} de 2 fragmentos en tu bolsillo`}</p>
    <button type="button" className="primary" onClick={onRead}>Leer la bitácora</button>
    {flight && <span aria-hidden="true" className="dark-matter-flight" style={{ left: flight.x, top: flight.y, '--fragment-x': `${flight.dx}px`, '--fragment-y': `${flight.dy}px` }} />}
  </section>;
}
