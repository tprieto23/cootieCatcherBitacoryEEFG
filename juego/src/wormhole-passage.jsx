import React, { useEffect, useRef, useState } from 'react';
import './wormhole-passage.css';

export function WormholePassage({ motion, onArrive, toPocket = false }) {
  const arrive = useRef(onArrive);
  const finished = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  arrive.current = onArrive;
  const animated = motion && !reducedMotion;

  function finish() {
    if (finished.current) return;
    finished.current = true;
    arrive.current();
  }

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(finish, animated ? 3600 : 600);
    return () => window.clearTimeout(timeout);
  }, [animated]);

  return <section className={`wormhole-passage ${animated ? '' : 'is-still'}`} aria-label={toPocket ? 'Viaje por el agujero de gusano' : undefined} aria-labelledby={toPocket ? undefined : 'wormhole-title'}>
    <div className="wormhole-tunnel" aria-hidden="true">
      <div className="wormhole-depth">{Array.from({ length: 18 }, (_, index) => <span className="wormhole-ring" key={index} style={{ '--i': index }} />)}</div>
      <div className="wormhole-dust">{Array.from({ length: 36 }, (_, index) => <span key={index} style={{ '--angle': `${index * 137.5}deg`, '--delay': `${-(index % 13) * .18}s`, '--distance': `${25 + index % 5 * 8}vmax` }} />)}</div>
      <div className="wormhole-heart" />
    </div>
    {!toPocket && <>
      <div className="wormhole-copy"><span className="eyebrow">DE VUELTA A TU ÓRBITA</span><h1 id="wormhole-title">Lo que descubriste<br /><em>viaja contigo</em></h1><p role="status">Atravesando el agujero de gusano hacia tu órbita hogar…</p></div>
      <button type="button" className="text-button wormhole-skip" onClick={finish}>Ver mi misión completada</button>
    </>}
  </section>;
}
