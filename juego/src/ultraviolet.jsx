import React, { useRef, useState } from 'react';
import { REFLECTION_LIMIT, ULTRAVIOLET, ULTRAVIOLET_SIGNALS } from './mission.js';
import { StationSilhouette } from './station-art.jsx';
import './ultraviolet.css';
import './expedition.css';

export function UltravioletVisit({ children, draft, selected, onDraft, onSave, onPocket, onMap, stars, signals, onTune, complete, motion }) {
  const [savedRevision, setSavedRevision] = useState(0);
  const [readingOpen, setReadingOpen] = useState(Boolean(selected || draft));
  const [pulseRevision, setPulseRevision] = useState(0);
  const bookRef = useRef(null);
  function readBook() {
    setReadingOpen(true);
    requestAnimationFrame(() => bookRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' }));
  }
  function tune(index) {
    if (!signals.includes(index) && signals.length === 2) setPulseRevision(value => value + 1);
    onTune(index);
  }
  function submit(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    onSave(draft);
    setSavedRevision(value => value + 1);
  }

  return <section className={`ultraviolet-visit ${motion ? '' : 'is-paused'}`} aria-labelledby="ultraviolet-title">
    <nav className="visit-toolbar" aria-label="Acciones de la estación">
      <button type="button" className="text-button" onClick={onMap}>Volver al mapa</button>
      <span className="visit-location">Estación 1 de 7</span>
      <button type="button" className="visit-pocket-button" aria-haspopup="dialog" onClick={onPocket}>Mi bolsillo <span>{stars} / 7</span></button>
    </nav>
    <article className="ultraviolet-page">
      <header className="ultraviolet-heading"><span className="eyebrow">Estación 1 de 7</span><div className="ultraviolet-signal" aria-hidden="true"><span /><span /><span /></div><h1 id="ultraviolet-title">Sintoniza <em>Ultravioleta</em></h1><p>Una voz que aprendió acompañada</p></header>
      <button type="button" className="primary read-logbook-entry" onClick={readBook}>Leer la bitácora</button>
      <section className="ultraviolet-receiver" id="ultraviolet-receiver" aria-labelledby="receiver-title">
        <div className="receiver-instrument"><span className="eyebrow">RECEPTOR / UV-23</span><StationSilhouette kind="antenna" segments={signals} complete={signals.length === 3} /><div key={pulseRevision} className={`receiver-pulse ${signals.length === 3 ? 'is-ready' : ''} ${pulseRevision ? 'just-recovered' : ''}`} aria-hidden="true" /><p>{signals.length} / 3 señales sintonizadas</p></div>
        <div className="receiver-signals"><h2 id="receiver-title">Hay voces en la señal.</h2><p>Toca cada señal para escuchar lo que estas experiencias reconocen juntas. También puedes abrir la bitácora cuando quieras.</p>{ULTRAVIOLET_SIGNALS.map((fragment, index) => <div className="receiver-signal" key={index}><button type="button" aria-pressed={signals.includes(index)} aria-controls={`signal-fragment-${index}`} onClick={() => tune(index)}>Señal {index + 1}<span>{signals.includes(index) ? 'Sintonizada' : 'Señal débil · Sintonizar'}</span></button><blockquote id={`signal-fragment-${index}`} hidden={!signals.includes(index)}>«{fragment}»</blockquote></div>)}<p className="receiver-status" role="status">{signals.length === 3 ? 'Tres señales reunidas. El receptor emite un pulso ultravioleta.' : `${signals.length} de 3 señales sintonizadas. La antena espera las voces de la colectiva.`}</p></div>
      </section>
      <details ref={bookRef} className="ultraviolet-logbook" open={readingOpen} onToggle={event => setReadingOpen(event.currentTarget.open)}>
      <summary>Leer la bitácora <span>Una voz que aprendió acompañada</span></summary>
      <div className="ultraviolet-reading">{children}</div>
      <form className="ultraviolet-reflection" onSubmit={submit} aria-labelledby="ultraviolet-question">
        <span className="eyebrow">LO QUE RESUENA CONTIGO</span>
        <h2 id="ultraviolet-question">{ULTRAVIOLET.question}</h2>
        <label htmlFor="ultraviolet-draft">Tu palabra o reflexión</label>
        <textarea id="ultraviolet-draft" rows={6} maxLength={REFLECTION_LIMIT} value={draft} onChange={event => onDraft(event.target.value)} placeholder="Aquí cabe una palabra. También varios párrafos…" aria-describedby="ultraviolet-privacy" />
        <p id="ultraviolet-privacy" className="quiet-note">Tu borrador y tu estrella se quedan en este navegador. Puedes abrir el bolsillo y seguir aquí cuando lo cierres.</p>
        <div className="ultraviolet-save"><button type="submit" className="primary" disabled={!draft.trim()}>Guardar en mi bolsillo</button><div key={savedRevision} className={`ultraviolet-star ${complete ? 'is-lit' : ''} ${savedRevision && complete ? 'just-saved' : ''}`} aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M50 2C57 35 65 43 98 50C65 57 57 65 50 98C43 65 35 57 2 50C35 43 43 35 50 2Z" /></svg></div></div>
        <p className="ultraviolet-confirmation" role="status" aria-live="polite">{selected && draft !== selected ? 'Tienes cambios en tu borrador. Guárdalos para actualizar la misma estrella.' : complete ? ULTRAVIOLET.confirmation : selected ? 'Tu reflexión está guardada. Sintoniza las tres señales del receptor para recoger el pulso y encender esta estrella.' : ''}</p>
        {selected && signals.length < 3 && <button type="button" className="text-button" onClick={() => document.getElementById('ultraviolet-receiver')?.scrollIntoView({ behavior: 'auto', block: 'start' })}>Volver al receptor para sintonizar las señales</button>}
      </form>
      </details>
      <button type="button" className="text-button visit-bottom-return" onClick={onMap}>Volver al mapa</button>
    </article>
  </section>;
}
