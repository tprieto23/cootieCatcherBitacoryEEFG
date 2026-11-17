import React, { useId } from 'react';
import './mission-farewell.css';

export function BlackHole({ className = '' }) {
  const id = useId();
  return <span className={`black-hole ${className}`} aria-hidden="true"><svg viewBox="0 0 240 190">
    <defs>
      <radialGradient id={`${id}-halo`}><stop stopColor="#fca4bc" stopOpacity=".25" /><stop offset=".55" stopColor="#fca4bc" stopOpacity=".18" /><stop offset="1" stopColor="#ae81d0" stopOpacity="0" /></radialGradient>
      <linearGradient id={`${id}-disc`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d4dcf3" stopOpacity=".3" /><stop offset=".35" stopColor="#FCA4BC" /><stop offset=".63" stopColor="#FDDD46" /><stop offset="1" stopColor="#FCA4BC" stopOpacity=".4" /></linearGradient>
      <filter id={`${id}-soft`} x="-50%" y="-60%" width="200%" height="220%"><feGaussianBlur stdDeviation="4" /></filter>
    </defs>
    <ellipse cx="120" cy="95" rx="116" ry="88" fill={`url(#${id}-halo)`} />
    <g className="black-hole-disc">
      <ellipse cx="120" cy="100" rx="102" ry="25" transform="rotate(-15 120 100)" fill="none" stroke={`url(#${id}-disc)`} strokeWidth="12" opacity=".4" filter={`url(#${id}-soft)`} />
      <ellipse cx="120" cy="100" rx="98" ry="23" transform="rotate(-15 120 100)" fill="none" stroke={`url(#${id}-disc)`} strokeWidth="3" />
      <path d="M66 99C62 18 166 16 175 85" stroke={`url(#${id}-disc)`} strokeWidth="7" fill="none" opacity=".5" filter={`url(#${id}-soft)`} />
      <path d="M69 98C66 26 163 22 171 86" stroke={`url(#${id}-disc)`} strokeWidth="2" fill="none" opacity=".8" />
    </g>
    <circle cx="120" cy="95" r="39" fill="#08070f" />
    <circle cx="120" cy="95" r="40" fill="none" stroke="#f5c5d9" strokeWidth="1" opacity=".5" />
    <path d="M22 126C77 145 170 118 217 73" fill="none" stroke={`url(#${id}-disc)`} strokeWidth="4" strokeLinecap="round" />
    <path d="M27 124C79 139 173 116 211 77" fill="none" stroke="#fff0c9" strokeWidth=".9" opacity=".75" />
  </svg></span>;
}

export function MissionFarewell({ children, onMap, onPocket, onNetwork }) {
  return <section className="mission-farewell" aria-labelledby="conclusion-title">
    <nav className="visit-toolbar" aria-label="Acciones de regreso a casa">
      <button type="button" className="text-button" onClick={onMap}>Volver al mapa</button>
      <span className="visit-location">ÓRBITA HOGAR</span>
      <button type="button" className="visit-pocket-button" onClick={onPocket} aria-haspopup="dialog">Mi bolsillo</button>
    </nav>
    <article className="farewell-page">
      <section className="farewell-conclusion" aria-labelledby="conclusion-title"><h1 id="conclusion-title">Mi conclusión</h1>{children}</section>
      <div className="farewell-thanks"><p>Gracias por leerme y por darle un lugar a estas preguntas</p></div>
      <div className="farewell-actions"><button type="button" className="cover-open" onClick={onNetwork}>Abrir la red de mis estrellas <span aria-hidden="true">↗</span></button></div>
    </article>
  </section>;
}
