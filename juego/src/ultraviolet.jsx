import React, { useState } from 'react';
import { REFLECTION_LIMIT, ULTRAVIOLET } from './mission.js';
import './ultraviolet.css';

export function UltravioletVisit({ children, draft, selected, onDraft, onSave, onPocket, onMap, stars }) {
  const [savedRevision, setSavedRevision] = useState(0);
  function submit(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    onSave(draft);
    setSavedRevision(value => value + 1);
  }

  return <section className="ultraviolet-visit" aria-labelledby="ultraviolet-title">
    <nav className="visit-toolbar" aria-label="Acciones de la estación">
      <button type="button" className="text-button" onClick={onMap}>Volver al mapa</button>
      <span className="visit-location">Estación 1 de 7</span>
      <button type="button" className="visit-pocket-button" aria-haspopup="dialog" onClick={onPocket}>Mi bolsillo <span>{stars} / 7</span></button>
    </nav>
    <article className="ultraviolet-page">
      <header className="ultraviolet-heading"><span className="eyebrow">Estación 1 de 7</span><div className="ultraviolet-signal" aria-hidden="true"><span /><span /><span /></div><h1 id="ultraviolet-title">Sintoniza <em>Ultravioleta</em></h1><p>Una voz que aprendió acompañada</p></header>
      <div className="ultraviolet-reading">{children}</div>
      <form className="ultraviolet-reflection" onSubmit={submit} aria-labelledby="ultraviolet-question">
        <span className="eyebrow">LO QUE RESUENA CONTIGO</span>
        <h2 id="ultraviolet-question">{ULTRAVIOLET.question}</h2>
        <label htmlFor="ultraviolet-draft">Tu palabra o reflexión</label>
        <textarea id="ultraviolet-draft" rows={6} maxLength={REFLECTION_LIMIT} value={draft} onChange={event => onDraft(event.target.value)} placeholder="Aquí cabe una palabra. También varios párrafos…" aria-describedby="ultraviolet-privacy" />
        <p id="ultraviolet-privacy" className="quiet-note">Tu borrador y tu estrella se quedan en este navegador. Puedes abrir el bolsillo y seguir aquí cuando lo cierres.</p>
        <div className="ultraviolet-save"><button type="submit" className="primary" disabled={!draft.trim()}>Guardar en mi bolsillo</button><div key={savedRevision} className={`ultraviolet-star ${selected ? 'is-lit' : ''} ${savedRevision ? 'just-saved' : ''}`} aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M50 2C57 35 65 43 98 50C65 57 57 65 50 98C43 65 35 57 2 50C35 43 43 35 50 2Z" /></svg></div></div>
        <p className="ultraviolet-confirmation" role="status" aria-live="polite">{selected && draft === selected ? ULTRAVIOLET.confirmation : selected ? 'Tienes cambios en tu borrador. Guárdalos para actualizar la misma estrella.' : ''}</p>
      </form>
      <button type="button" className="text-button visit-bottom-return" onClick={onMap}>Volver al mapa</button>
    </article>
  </section>;
}
