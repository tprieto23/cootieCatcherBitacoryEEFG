import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Experience } from './experience.jsx';
import { notes } from './notes.js';
import './styles.css';

function Flower({ className = '' }) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.5">{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="50" cy="29" rx="10" ry="20" transform={`rotate(${i * 45} 50 50)`} />)}<circle cx="50" cy="50" r="10" /></g></svg>;
}

const pipPositions = {
  1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
};

function Die({ value, rolling }) {
  return <div className={`die ${rolling ? 'is-rolling' : ''}`} aria-hidden="true">
    {Array.from({ length: 9 }, (_, i) => <span key={i} className={pipPositions[value || 1].includes(i) ? 'pip visible' : 'pip'} />)}
  </div>;
}

const ring = [[300, 40], [430, 170], [560, 300], [430, 430], [300, 560], [170, 430], [40, 300], [170, 170]];
const colors = ['#FCA4BC', '#FDDD46', '#4A1B70', '#4A1B70', '#c5cee5', '#4A1B70', '#FCA4BC', '#FDDD46'];

function Paper({ state, onOpen }) {
  const activeRef = useRef(null);
  useEffect(() => {
    if (state.phase === 'ready') activeRef.current?.focus({ preventScroll: true });
  }, [state.phase]);
  return <div className={`paper ${state.phase === 'moving' ? 'is-moving' : state.phase === 'rolling' ? 'is-folding' : ''}`}>
    <svg viewBox="0 0 600 600" className="paper-shape" aria-hidden="true">
      <defs>
        <filter id="paper-shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="12" stdDeviation="17" floodColor="#FDDD46" floodOpacity=".35" /></filter>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope=".035" /></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply" /></filter>
        <linearGradient id="fold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".55" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#301148" stopOpacity=".3" /></linearGradient>
      </defs>
      <g filter="url(#paper-shadow)">
        {ring.map((point, i) => <g key={i}>
          <polygon points={`300,300 ${point.join(',')} ${ring[(i + 1) % 8].join(',')}`} fill={colors[i]} filter="url(#grain)" />
          <polygon points={`300,300 ${point.join(',')} ${ring[(i + 1) % 8].join(',')}`} fill="url(#fold)" />
          <path d={`M300 300 L${point.join(' ')}`} stroke="#e6e7ff" strokeOpacity=".65" strokeWidth="1.5" />
        </g>)}
        <path d="M300 40 L560 300 L300 560 L40 300 Z" fill="none" stroke="#dde3ff" strokeOpacity=".55" />
      </g>
    </svg>
    {notes.map((note, i) => {
      const angle = (-67.5 + i * 45) * Math.PI / 180;
      const active = state.position === i;
      const canOpen = active && state.phase === 'ready';
      return <button key={i} ref={canOpen ? activeRef : null} className={`flap ${active ? 'active' : ''} ${state.discovered.includes(i) ? 'visited' : ''}`} style={{ left: `${50 + Math.cos(angle) * 29}%`, top: `${50 + Math.sin(angle) * 29}%` }} disabled={!canOpen} onClick={onOpen} aria-label={`Pestaña ${i + 1}${state.discovered.includes(i) ? ', ya descubierta' : ''}${canOpen ? ': abrir nota' : ''}`}>
        <span>{i + 1}</span>{state.discovered.includes(i) && <small aria-hidden="true">✦</small>}
      </button>;
    })}
    <div className="paper-center" aria-hidden="true"><span>✳</span><em>entre<br />pliegues</em></div>
    <span className="start-marker">empieza aquí ↗</span>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><Experience Paper={Paper} Die={Die} Flower={Flower} /></React.StrictMode>);
