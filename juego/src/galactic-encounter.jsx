import React, { useEffect, useRef, useState } from 'react';
import { GAS_CONTACT, encounterPosition, encounterTrail, canCollectEncounterEnergy } from './galactic-encounter.js';
import './galactic-encounter.css';

const grain = seed => { const n = Math.sin(seed * 127.1 + 23) * 43758.5453; return n - Math.floor(n); };
const stars = Array.from({ length: 130 }, (_, i) => [grain(i + 1) * 1000, grain(i + 501) * 570, .5 + grain(i + 701) * 1.2]);
const dust = Array.from({ length: 190 }, (_, i) => {
  const t = (i % 95) / 94;
  const angle = t * Math.PI * 3.4 + (i < 95 ? 0 : Math.PI);
  const radius = 7 + t * 102;
  return [Math.cos(angle) * radius + (grain(i + 101) - .5) * 13, Math.sin(angle) * radius * .48 + (grain(i + 301) - .5) * 9, .6 + grain(i + 801) * 1.6];
});

function Galaxy({ name, kind, progress, onPointerDown, onPointerMove, onPointerUp, onKeyDown, interactive }) {
  const [x, y] = encounterPosition(kind, progress);
  return <g transform={`translate(${x} ${y})`} className={`encounter-galaxy ${interactive ? 'is-draggable' : ''}`} role={interactive ? 'button' : undefined} tabIndex={interactive ? 0 : undefined} aria-label={interactive ? 'Acercar Andrómeda a la Vía Láctea. Arrastra o pulsa Enter.' : undefined} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onKeyDown={onKeyDown}>
    <g transform={`rotate(${kind === 'milky' ? -18 + progress * 34 : 25 - progress * 42}) scale(${kind === 'milky' ? 1 : 1.12})`} aria-hidden="true">
      <ellipse rx="130" ry="63" fill={`url(#gas-${kind})`} />
      <ellipse rx="100" ry="44" fill={`url(#disc-${kind})`} />
      {dust.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={i % 7 ? kind === 'milky' ? '#c4b4ff' : '#fca4bc' : '#fff4d1'} opacity={.35 + grain(i + 901) * .6} />)}
      <ellipse rx="24" ry="16" fill="url(#encounter-core)" />
      <circle r="5" fill="#fff1d5" opacity=".9" />
    </g>
    <text y={kind === 'milky' ? 94 : -91} textAnchor="middle">{name}</text>
    {interactive && <><ellipse className="galaxy-drag-target" rx="139" ry="77" fill="transparent" /><text className="galaxy-drag-hint" y="108" textAnchor="middle">Arrastra para acercar</text></>}
  </g>;
}

export function GalacticEncounter({ collected, onCollect, onRead, motion }) {
  const [progress, setProgress] = useState(collected ? 1 : 0);
  const [running, setRunning] = useState(false);
  const [showQuestion, setShowQuestion] = useState(collected);
  const [flight, setFlight] = useState(null);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const dragStart = useRef(null);
  const heatRef = useRef(null);
  const rootRef = useRef(null);
  const contacted = progress >= GAS_CONTACT;
  const canCollect = canCollectEncounterEnergy(progress, collected);
  const animate = motion && !reduced;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!running) return;
    if (!animate) { setProgress(1); setRunning(false); return; }
    let frame;
    let previous;
    const tick = now => {
      const elapsed = previous === undefined ? 0 : Math.min(now - previous, 80);
      previous = now;
      setProgress(value => Math.min(1, value + elapsed / 8500));
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [running, animate]);

  useEffect(() => { if (progress >= 1 && running) setRunning(false); }, [progress, running]);
  useEffect(() => {
    if (collected && contacted && !flight) {
      const timeout = window.setTimeout(() => setShowQuestion(true), animate ? 1100 : 0);
      return () => window.clearTimeout(timeout);
    }
  }, [collected, contacted, flight, animate]);
  useEffect(() => {
    if (!flight) return;
    const timeout = window.setTimeout(() => setFlight(null), animate ? 1250 : 0);
    return () => window.clearTimeout(timeout);
  }, [flight, animate]);

  function start() {
    dragStart.current = null;
    setProgress(0);
    setShowQuestion(false);
    setRunning(true);
  }
  function beginDrag(event) {
    if (running || progress > 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = [event.clientX, event.clientY];
  }
  function drag(event) {
    if (!dragStart.current) return;
    const [x, y] = dragStart.current;
    // Andrómeda starts above and to the right of the Milky Way.
    if (x - event.clientX > 12 || event.clientY - y > 12) start();
  }
  function collect() {
    if (!canCollect) return;
    const origin = heatRef.current?.getBoundingClientRect();
    const target = rootRef.current?.closest('.ultraviolet-visit')?.querySelector('.visit-pocket-button')?.getBoundingClientRect();
    if (animate && origin && target) setFlight({ x: origin.x + origin.width / 2, y: origin.y + origin.height / 2, dx: target.x + target.width / 2 - origin.x - origin.width / 2, dy: target.y + target.height / 2 - origin.y - origin.height / 2 });
    onCollect();
  }
  const milky = encounterPosition('milky', progress);
  const andromeda = encounterPosition('andromeda', progress);
  const heat = [(milky[0] + andromeda[0]) / 2, (milky[1] + andromeda[1]) / 2];

  return <section ref={rootRef} className={`galactic-encounter ${animate ? '' : 'encounter-still'}`} aria-labelledby="encounter-title">
    <h2 id="encounter-title" className="encounter-label">ENCUENTRO CREADO PARA ESTA HISTORIA · ANDRÓMEDA Y VÍA LÁCTEA</h2>
    <p>¿Qué cambia cuando dos galaxias se encuentran? Acerca Andrómeda a la Vía Láctea y observa el rumbo de las dos.</p>
    <div className="encounter-viewport">
      <svg viewBox="0 0 1000 570" className="encounter-space" role="group" aria-label="Encuentro ilustrativo entre dos galaxias con atracción mutua y trayectorias curvas">
        <defs>
          {['milky', 'andromeda'].map(kind => <React.Fragment key={kind}>
            <radialGradient id={`gas-${kind}`}><stop stopColor={kind === 'milky' ? '#b294f5' : '#fca4bc'} stopOpacity=".3" /><stop offset=".7" stopColor={kind === 'milky' ? '#b294f5' : '#fca4bc'} stopOpacity=".15" /><stop offset="1" stopColor="#4a1b70" stopOpacity="0" /></radialGradient>
            <radialGradient id={`disc-${kind}`}><stop stopColor="#fff2d9" stopOpacity=".7" /><stop offset=".22" stopColor="#fca4bc" stopOpacity=".35" /><stop offset="1" stopColor="#a78ed2" stopOpacity="0" /></radialGradient>
          </React.Fragment>)}
          <radialGradient id="encounter-core"><stop stopColor="#fff7da" /><stop offset=".25" stopColor="#fddd46" stopOpacity=".7" /><stop offset="1" stopColor="#fca4bc" stopOpacity="0" /></radialGradient>
          <radialGradient id="encounter-heat"><stop stopColor="#fff2c0" /><stop offset=".2" stopColor="#fddd46" stopOpacity=".9" /><stop offset=".5" stopColor="#ff976f" stopOpacity=".65" /><stop offset="1" stopColor="#fca4bc" stopOpacity="0" /></radialGradient>
        </defs>
        <g aria-hidden="true" fill="#d4dcf3">{stars.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} opacity={.18 + grain(i + 1101) * .5} />)}</g>
        <g className="encounter-orbits" aria-hidden="true">
          <path d="M100 285Q156 322 215 350" /><path d="M795 52Q799 111 780 170" />
          {['milky', 'andromeda'].map(kind => <path key={kind} d={encounterTrail(kind, 1, 1)} className={`planned-orbit orbit-${kind}`} />)}
        </g>
        {progress > 0 && <g className="encounter-trails" aria-hidden="true"><path d={encounterTrail('milky', progress)} className="trail-milky" /><path d={encounterTrail('andromeda', progress)} className="trail-andromeda" /></g>}
        <Galaxy kind="milky" name="Vía Láctea" progress={progress} />
        <Galaxy kind="andromeda" name="Andrómeda" progress={progress} interactive={!running && progress === 0} onPointerDown={beginDrag} onPointerMove={drag} onPointerUp={() => { dragStart.current = null; }} onKeyDown={event => { if ((event.key === 'Enter' || event.key === ' ') && !running && progress === 0) { event.preventDefault(); start(); } }} />
        {contacted && <g
          className={`contact-heat ${collected ? 'heat-collected' : ''} ${canCollect ? 'heat-ready' : ''}`}
          role={canCollect ? 'button' : undefined}
          tabIndex={canCollect ? 0 : undefined}
          aria-label={canCollect ? 'Recoger energía disipada entre las dos galaxias' : undefined}
          aria-describedby={canCollect ? 'energy-warning' : undefined}
          aria-hidden={canCollect ? undefined : true}
          onClick={collect}
          onKeyDown={event => { if (canCollect && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); collect(); } }}
        >
          <ellipse ref={heatRef} cx={heat[0]} cy={heat[1]} rx="78" ry="53" fill="url(#encounter-heat)" transform={`rotate(-25 ${heat[0]} ${heat[1]})`} />
          <path d={`M${heat[0] - 30} ${heat[1] + 9}q18 -26 32 -5t29 -13`} />
          {canCollect && <ellipse className="heat-hit-area" cx={heat[0]} cy={heat[1]} rx="108" ry="90" fill="transparent" />}
        </g>}
      </svg>
      <span className="encounter-caption">Una exploración visual de un encuentro posible</span>
    </div>
    <div className="encounter-controls"><button type="button" className="cover-open" onClick={start} disabled={running}>{running ? 'Las dos galaxias se acercan…' : progress > 0 ? 'Volver a observar el encuentro' : 'Acercar las galaxias'}<span aria-hidden="true">↗</span></button></div>
    <div className="encounter-discovery" aria-live="polite">
      {contacted && <><p>Las nubes de gas de las dos galaxias chocan. Parte de la energía de su movimiento se transforma en energía térmica: el gas se calienta. En esta simulación puedes recoger parte de esa energía disipada.</p>{canCollect && <p id="energy-warning" className="energy-warning">Antes de que se pierda, recoge la energía disipada que se encuentra entre las dos galaxias.</p>}{collected && <p className="energy-confirmation" role="status">Energía disipada · Guardada en tu bolsillo</p>}</>}
    </div>
    {collected && showQuestion && <div className="encounter-question"><p>En este encuentro, las dos galaxias cambiaron de rumbo. Ahora imagina que tú y yo investigamos juntas. Yo llego con una pregunta y tú ves algo que a mí se me escapó. <strong>¿Qué podríamos decidir juntas para que tu observación cambie el rumbo del trabajo?</strong></p><button type="button" className="primary" onClick={onRead}>Leer la bitácora</button></div>}
    {flight && <span aria-hidden="true" className="energy-flight" style={{ left: flight.x, top: flight.y, '--flight-x': `${flight.dx}px`, '--flight-y': `${flight.dy}px` }} />}
  </section>;
}
