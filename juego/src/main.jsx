import React, { useEffect, useReducer, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gameReducer, initialState } from './game.js';
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
const colors = ['#d9bfd8', '#c9b0ce', '#c0cbdc', '#b2c3d4', '#c8d2b5', '#b7c5a2', '#e7bcb2', '#e0aaa0'];

function Paper({ state, onOpen }) {
  const activeRef = useRef(null);
  useEffect(() => {
    if (state.phase === 'ready') activeRef.current?.focus({ preventScroll: true });
  }, [state.phase]);
  return <div className={`paper ${state.phase === 'moving' ? 'is-moving' : ''}`}>
    <svg viewBox="0 0 600 600" className="paper-shape" aria-hidden="true">
      <defs>
        <filter id="paper-shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="3" dy="16" stdDeviation="12" floodColor="#493728" floodOpacity=".18" /></filter>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope=".12" /></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply" /></filter>
        <linearGradient id="fold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".36" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#4b3535" stopOpacity=".14" /></linearGradient>
      </defs>
      <g filter="url(#paper-shadow)">
        {ring.map((point, i) => <g key={i}>
          <polygon points={`300,300 ${point.join(',')} ${ring[(i + 1) % 8].join(',')}`} fill={colors[i]} filter="url(#grain)" />
          <polygon points={`300,300 ${point.join(',')} ${ring[(i + 1) % 8].join(',')}`} fill="url(#fold)" />
          <path d={`M300 300 L${point.join(' ')}`} stroke="#fff9ef" strokeOpacity=".5" strokeWidth="1.5" />
        </g>)}
        <path d="M300 40 L560 300 L300 560 L40 300 Z" fill="none" stroke="#775f58" strokeOpacity=".18" />
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

function Modal({ kind, noteIndex, onClose, onPlay }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, []);
  const isNote = kind === 'note';
  return <dialog ref={ref} className={`modal ${isNote ? 'note-modal' : ''}`} aria-labelledby="modal-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="modal-inner">
      <button className="close-button" onClick={onClose} aria-label="Cerrar">×</button>
      <span className="eyebrow">{isNote ? `PLIEGUE ${String(noteIndex + 1).padStart(2, '0')} · NOTA DE EJEMPLO` : 'UN PEQUEÑO RITUAL'}</span>
      <Flower className="modal-flower" />
      <h2 id="modal-title">{isNote ? notes[noteIndex].title : 'Cómo se juega'}</h2>
      {isNote ? <><p className="note-text">{notes[noteIndex].text}</p><p className="note-signature">hasta el próximo pliegue ♡</p><button className="primary" onClick={onPlay}>Seguir jugando <span aria-hidden="true">↗</span></button></> : <>
        <ol className="instructions"><li><strong>Lanza el dado.</strong> El azar decide cuántos pasos darás.</li><li><strong>Sigue los pliegues.</strong> Avanzas en sentido horario desde tu última posición. Después del 8, vuelves al 1.</li><li><strong>Abre tu nota.</strong> Solo puedes abrir la pestaña en la que caíste. Vuelve a lanzar para descubrir otras.</li></ol>
        <p className="small-print">Empiezas justo antes de la pestaña 1. Si sale un 3 en tu primera tirada, llegarás a la pestaña 3.</p>
        <button className="primary" onClick={onClose}>Vamos a jugar <span aria-hidden="true">↗</span></button>
      </>}
    </div>
  </dialog>;
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [visualDie, setVisualDie] = useState(1);
  const [modal, setModal] = useState(null);
  const busy = ['rolling', 'moving'].includes(state.phase);
  useEffect(() => {
    if (state.phase !== 'rolling') return;
    const interval = setInterval(() => setVisualDie(Math.floor(Math.random() * 6) + 1), 85);
    const timeout = setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setVisualDie(result);
      dispatch({ type: 'land', value: result });
    }, 800);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [state.phase]);
  useEffect(() => {
    if (state.phase !== 'moving') return;
    const timeout = setTimeout(() => dispatch({ type: 'step' }), 280);
    return () => clearTimeout(timeout);
  }, [state.phase, state.remaining]);

  function roll() { dispatch({ type: 'roll' }); }
  function openNote() {
    if (state.phase !== 'ready') return;
    dispatch({ type: 'read' });
    setModal('note');
  }
  const message = state.phase === 'idle' ? 'Tu primera nota está a una tirada.'
    : state.phase === 'rolling' ? 'Un poquito de azar…'
    : state.phase === 'moving' ? `Salió ${state.die}. Avanzando ${state.die} ${state.die === 1 ? 'paso' : 'pasos'}…`
    : `Salió ${state.die}. Llegaste a la pestaña ${state.position + 1}.`;
  return <>
    <header className="site-header"><a className="brand" href="./" aria-label="Bitácory, inicio"><span aria-hidden="true">✳</span> bitácory<span className="brand-dot">.</span></a><span className="header-caption">PALABRAS QUE SE GUARDAN EN PAPEL</span><button className="text-button" onClick={() => setModal('help')}>Cómo se juega <span aria-hidden="true">↗</span></button></header>
    <main>
      <section className="intro" aria-labelledby="page-title">
        <div className="intro-label"><span className="tiny-line" /> UNA BITÁCORA PARA DESCUBRIR</div>
        <h1 id="page-title">Hay notas que esperan<br />un poco de <em>azar.</em><span className="title-star" aria-hidden="true">✧</span></h1>
        <p>Lanza un dado, sigue los pliegues y encuentra<br className="desktop-break" /> algo que estaba escrito para ser descubierto.</p>
        <Flower className="intro-flower" />
        <div className="margin-note">ocho pliegues,<br />muchas formas<br />de encontrarnos <span aria-hidden="true">⤵</span></div>
      </section>
      <section className="game" aria-label="Juego del comecocos">
        <div className="board-area"><div className="board-topline"><span>01 — EL COMECOCOS</span><span>DE PAPEL Y PALABRAS</span></div><Paper state={state} onOpen={openNote} /><p className="board-caption">un pliegue, una pequeña sorpresa <span aria-hidden="true">✦</span></p></div>
        <aside className="controls" aria-label="Controles del juego">
          <span className="eyebrow">QUE DECIDA EL AZAR</span>
          <h2>Todo empieza<br />con una tirada.</h2>
          <p className="controls-intro">Un dado. Ocho pestañas.<br />Una nota esperando por ti.</p>
          <div className="dice-tray"><Die value={visualDie} rolling={state.phase === 'rolling'} /><span className="dice-doodle" aria-hidden="true">✧</span></div>
          <button className="primary roll-button" onClick={roll} disabled={busy}>{state.phase === 'rolling' ? 'Lanzando…' : state.phase === 'moving' ? 'Siguiendo los pliegues…' : state.phase === 'idle' ? 'Lanzar el dado' : 'Volver a lanzar'}<span aria-hidden="true">↗</span></button>
          <p className="status" role="status" aria-live="polite" aria-atomic="true">{message}</p>
          {state.phase === 'ready' && <button className="open-note" onClick={openNote}>Abrir la nota {state.position + 1} <span aria-hidden="true">→</span></button>}
          <div className="collection"><div><span>TUS DESCUBRIMIENTOS</span><span>{state.discovered.length} / 8</span></div><div className="progress" aria-label={`${state.discovered.length} de 8 notas descubiertas`}>{notes.map((_, i) => <span key={i} className={state.discovered.includes(i) ? 'found' : ''} aria-hidden="true">{state.discovered.includes(i) ? '✦' : '·'}</span>)}</div><p>{state.discovered.length === 8 ? 'Encontraste todos los secretos. Puedes volver a leerlos jugando.' : 'Cada nota descubierta deja una pequeña huella.'}</p></div>
        </aside>
      </section>
      <div className="under-game"><span><span aria-hidden="true">♡</span> Hecho para jugar sin prisa.</span><button className="text-button reset-button" disabled={busy || state.phase === 'idle'} onClick={() => { dispatch({ type: 'reset' }); setVisualDie(1); }}>Empezar de nuevo <span aria-hidden="true">↺</span></button></div>
    </main>
    <footer><span>BITÁCORY · UNA BITÁCORA ENTRE PLIEGUES</span><span>Primera edición · Notas de ejemplo</span></footer>
    {modal && <Modal kind={modal} noteIndex={state.position} onClose={() => setModal(null)} onPlay={() => { setModal(null); roll(); }} />}
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
