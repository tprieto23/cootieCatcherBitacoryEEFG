import React, { useState } from 'react';
import { REFLECTION_LIMIT, ULTRAVIOLET, HOME_SIGNAL } from './mission.js';
import { SignalReceiver } from './signal-receiver.jsx';
import './ultraviolet.css';
import './expedition.css';

export function StationVisit({ note, heading, children, activity, beforeReading, prompt, readingUnlocked = true, allowReflection = true, draft, selected, onDraft, onSave, onPocket, onMap, stars, complete, motion, signals = [], onTune }) {
  const hasArrivalActivity = note.number === 2 || Boolean(beforeReading);
  const ReadingContainer = hasArrivalActivity ? 'details' : 'div';
  const [savedRevision, setSavedRevision] = useState(0);
  const [readingOpen, setReadingOpen] = useState(Boolean(selected || draft));
  const [readingRevealed, setReadingRevealed] = useState(Boolean(selected || draft));
  function openReading() {
    setReadingRevealed(true);
    setReadingOpen(true);
    window.requestAnimationFrame(() => {
      const summary = document.getElementById('station-reading-toggle');
      summary?.scrollIntoView({ behavior: 'auto', block: 'start' });
      summary?.focus({ preventScroll: true });
    });
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
      <span className="visit-location">Estación {note.number} de 9</span>
      <button type="button" className="visit-pocket-button" aria-haspopup="dialog" onClick={onPocket}>Mi bolsillo <span>{stars} / 7</span></button>
    </nav>
    <article className="ultraviolet-page">
      <header className="ultraviolet-heading"><span className="eyebrow">Estación {note.number} de 9</span><div className="ultraviolet-signal" aria-hidden="true"><span /><span /><span /></div><h1 id="ultraviolet-title">{heading}</h1></header>
      {note.number === 2 && <SignalReceiver signals={signals} onTune={onTune} />}
      {beforeReading?.(openReading)}
      {readingUnlocked && (!beforeReading || readingRevealed) && <ReadingContainer className="ultraviolet-logbook" {...(hasArrivalActivity ? { open: readingOpen, onToggle: event => setReadingOpen(event.currentTarget.open) } : {})}>
      {hasArrivalActivity && <summary id="station-reading-toggle" tabIndex={0}>Leer entrada</summary>}
      <div className="ultraviolet-reading">{children}</div>
      {activity ?? (allowReflection && <form className="ultraviolet-reflection" onSubmit={submit} aria-labelledby="ultraviolet-prompt">
        <label id="ultraviolet-prompt" htmlFor="ultraviolet-draft">{prompt ?? (note.number === 2 ? HOME_SIGNAL.prompt : ULTRAVIOLET.prompt)}</label>
        <textarea id="ultraviolet-draft" rows={6} maxLength={REFLECTION_LIMIT} value={draft} onChange={event => onDraft(event.target.value)} placeholder="Aquí cabe una palabra. También varios párrafos…" />
        <div className="ultraviolet-save"><button type="submit" className="primary" disabled={!draft.trim()}>Guardar en mi bolsillo</button><div key={savedRevision} className={`ultraviolet-star ${complete ? 'is-lit' : ''} ${savedRevision && complete ? 'just-saved' : ''}`} aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M50 2C57 35 65 43 98 50C65 57 57 65 50 98C43 65 35 57 2 50C35 43 43 35 50 2Z" /></svg></div></div>
        <p className="ultraviolet-confirmation" role="status" aria-live="polite">{selected && draft !== selected ? 'Tienes cambios en tu borrador. Guárdalos para actualizar la misma estrella.' : complete ? note.number === 1 ? ULTRAVIOLET.confirmation : `Tu estrella de «${note.title}» ya está en tu bolsillo` : selected && note.number === 2 ? 'Tu reflexión está guardada. Sintoniza las dos señales para recoger la antena de relevo y encender tu estrella.' : ''}</p>
        {selected && !complete && note.number === 2 && <button type="button" className="text-button" onClick={() => document.getElementById('home-receiver')?.scrollIntoView({ behavior: 'auto', block: 'start' })}>Volver a las señales</button>}
      </form>)}
      </ReadingContainer>}
      <button type="button" className="text-button visit-bottom-return" onClick={onMap}>Volver al mapa</button>
    </article>
  </section>;
}
