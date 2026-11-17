import React, { useEffect, useRef, useState } from 'react';
import './wormhole-passage.css';

export function WormholePassage({ motion, onArrive }) {
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

  return <section className={`wormhole-passage ${animated ? '' : 'is-still'}`} aria-label="Viaje por el agujero de gusano">
    <div className="wormhole-tunnel" aria-hidden="true">
      <div className="wormhole-depth">{Array.from({ length: 18 }, (_, index) => <span className="wormhole-ring" key={index} style={{ '--i': index }} />)}</div>
      <div className="wormhole-dust">{Array.from({ length: 36 }, (_, index) => <span key={index} style={{ '--angle': `${index * 137.5}deg`, '--delay': `${-(index % 13) * .18}s`, '--distance': `${25 + index % 5 * 8}vmax` }} />)}</div>
      <div className="wormhole-heart" />
    </div>
  </section>;
}
