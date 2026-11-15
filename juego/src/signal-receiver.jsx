import React, { useState } from 'react';
import { HOME_SIGNAL } from './mission.js';
import { StationSilhouette } from './station-art.jsx';
import './expedition.css';

export function SignalReceiver({ signals, onTune }) {
  const [pulseRevision, setPulseRevision] = useState(0);
  const ready = signals.length === HOME_SIGNAL.signals.length;
  function tune(index) {
    if (!signals.includes(index) && signals.length === HOME_SIGNAL.signals.length - 1) setPulseRevision(value => value + 1);
    onTune(index);
  }
  return <section className="ultraviolet-receiver home-receiver" id="home-receiver" aria-labelledby="home-receiver-intro">
    <div className="receiver-instrument">
      <span className="eyebrow">RECEPTOR / CASA-02</span>
      <StationSilhouette kind="relay" segments={signals} complete={ready} />
      <div key={pulseRevision} className={`receiver-pulse ${ready ? 'is-ready' : ''} ${pulseRevision ? 'just-recovered' : ''}`} aria-hidden="true" />
      <p>{signals.length} / 2 señales sintonizadas</p>
    </div>
    <div className="receiver-signals">
      <p id="home-receiver-intro">{HOME_SIGNAL.introduction}</p>
      {HOME_SIGNAL.signals.map((signal, index) => <div className="receiver-signal" key={signal.title}>
        <button type="button" aria-pressed={signals.includes(index)} aria-controls={`home-signal-${index}`} onClick={() => tune(index)}>
          <strong>{signal.title}</strong><span>{signals.includes(index) ? 'Sintonizada' : 'Sintonizar'}</span>
        </button>
        <blockquote id={`home-signal-${index}`} hidden={!signals.includes(index)}>
          <p>{signal.introduction && `${signal.introduction} `}«{signal.quote}».</p>
          <a href={signal.href} target="_blank" rel="noopener noreferrer">{signal.source}</a>
        </blockquote>
      </div>)}
      <p className="receiver-status" role="status">{ready ? 'Las dos señales están sintonizadas. La antena de relevo está lista.' : `${signals.length} de 2 señales sintonizadas.`}</p>
    </div>
  </section>;
}
