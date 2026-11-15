import React, { useState } from 'react';
import { ULTRAVIOLET_SIGNALS } from './mission.js';
import { StationSilhouette } from './station-art.jsx';
import './expedition.css';

// Preserved for future visits; the first two stations currently use reading and reflection only.
export function UltravioletReceiver({ signals, onTune }) {
  const [pulseRevision, setPulseRevision] = useState(0);
  function tune(index) {
    if (!signals.includes(index) && signals.length === 2) setPulseRevision(value => value + 1);
    onTune(index);
  }
  return (
      <section className="ultraviolet-receiver" id="ultraviolet-receiver" aria-labelledby="receiver-title">
        <div className="receiver-instrument"><span className="eyebrow">RECEPTOR / UV-23</span><StationSilhouette kind="antenna" segments={signals} complete={signals.length === 3} /><div key={pulseRevision} className={`receiver-pulse ${signals.length === 3 ? 'is-ready' : ''} ${pulseRevision ? 'just-recovered' : ''}`} aria-hidden="true" /><p>{signals.length} / 3 señales sintonizadas</p></div>
        <div className="receiver-signals"><h2 id="receiver-title">Hay voces en la señal.</h2><p>Toca cada señal para escuchar lo que estas experiencias reconocen juntas. También puedes abrir la bitácora cuando quieras.</p>{ULTRAVIOLET_SIGNALS.map((fragment, index) => <div className="receiver-signal" key={index}><button type="button" aria-pressed={signals.includes(index)} aria-controls={`signal-fragment-${index}`} onClick={() => tune(index)}>Señal {index + 1}<span>{signals.includes(index) ? 'Sintonizada' : 'Señal débil · Sintonizar'}</span></button><blockquote id={`signal-fragment-${index}`} hidden={!signals.includes(index)}>«{fragment}»</blockquote></div>)}<p className="receiver-status" role="status">{signals.length === 3 ? 'Tres señales reunidas. El receptor emite un pulso ultravioleta.' : `${signals.length} de 3 señales sintonizadas. La antena espera las voces de la colectiva.`}</p></div>
      </section>
  );
}
