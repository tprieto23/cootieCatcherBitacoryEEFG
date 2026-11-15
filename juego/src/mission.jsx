import React, { useState } from 'react';
import { REFLECTION_LIMIT } from './mission.js';
import './mission.css';

const locations = [[22, 10], [68, 23], [28, 36], [73, 49], [27, 62], [68, 75], [35, 88]];

export function MissionEncounter({ scenery, onAccept, motion }) {
  return <section className={`mission-encounter ${motion ? '' : 'is-paused'}`} aria-labelledby="encounter-title">
    {scenery}
    <div className="encounter-copy"><span className="eyebrow">AL OTRO LADO DE LA VENTANILLA</span><h2 id="encounter-title">Hay otro rumbo<br /><em>posible.</em></h2><button type="button" className="primary accept-mission" onClick={onAccept}>Aceptar misión</button></div>
    <div className="galaxy-caption dwarf-caption"><span>01 / GALAXIA ENANA</span><p>Un universo por cuidar</p></div>
    <div className="galaxy-caption giant-caption"><span>02 / GALAXIA MAYOR</span><p>La fuerza de la atracción</p></div>
  </section>;
}

export function NavigationMap({ alias, stations, mission, onOpen, onPocket, scenery, motion }) {
  const lights = Object.keys(mission.reflections).length;
  return <section className={`navigation-universe ${motion ? '' : 'is-paused'}`} aria-labelledby="map-title">
    {scenery}
    <header className="navigation-heading"><div><span className="eyebrow">NEBULA-F23 · UNA SOLA MISIÓN</span><h1 id="map-title">Carta de <em>navegación</em></h1></div><button className="pocket-access" onClick={onPocket}>Mi bolsillo espacial feminista <span>{lights} / 7 estrellas</span></button></header>
    <div className="navigation-layout">
      <section className="chart-sheet" aria-label="Mapa de las siete estaciones">
        <div className="chart-topline"><span>RUTA DE LA BITÁCORA</span><span>01 — 07</span></div>
        <div className="chart-terrain">
          <svg className="chart-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d={`M${locations.map(([x, y]) => `${x},${y}`).join(' L')}`} /></svg>
          <ol className="station-route">{stations.map((note, index) => {
            const lit = Boolean(mission.reflections[index]);
            const visited = mission.visited.includes(index);
            return <li key={note.number} style={{ left: `${locations[index][0]}%`, top: `${locations[index][1]}%` }}>
              <button className={`station-node station-kind-${index % 3} ${lit ? 'is-lit' : ''}`} onClick={() => onOpen(index)} aria-label={`Estación ${note.number}: ${note.title}${lit ? ', reflexión guardada' : visited ? ', visitada' : ''}`}>
                <span className="station-orb" aria-hidden="true"><span /></span>
                <span className="station-number">{String(note.number).padStart(2, '0')} {lit ? '· ESTRELLA ENCENDIDA' : visited ? '· VISITADA' : ''}</span>
                <span className="station-name">{note.title}</span>
                {!note.available && <small>Página en escritura</small>}
              </button>
            </li>;
          })}</ol>
          <div className="chart-folds" aria-hidden="true" />
        </div>
        <div className="chart-bottomline"><span>GALAXIA ENANA</span><span>UN RUMBO POR CONSTRUIR</span></div>
      </section>
      <aside className="navigation-guide" aria-labelledby="guide-title"><span className="eyebrow">PRIMERA TRANSMISIÓN DE NAVEGACIÓN</span><h2 id="guide-title">Guía de <em>navegación</em></h2><p>Astronauta {alias}, aquí comienza tu recorrido. Selecciona una estación para abrir una página de mi bitácora. Después de leerla, escribe una reflexión. Tu reflexión le dará brillo a una estrella que podrás guardar en tu bolsillo espacial feminista.</p><p>Cuando hayas recorrido las siete estaciones, abre el bolsillo. Allí podrás releer tus reflexiones y enlazar las estrellas. La energía de esa red formará la barrera que ayudará a la galaxia enana a cambiar de rumbo.</p><div className="navigation-progress"><span>{mission.visited.length} / 7 estaciones visitadas</span><span>{lights} / 7 estrellas encendidas</span></div><p className="quiet-note">Tu alias y tus reflexiones se guardan solo en este navegador. Tania no los recibe.</p></aside>
    </div>
  </section>;
}

export function MissionReflection({ selected = '', onSave, onReturn, children, available }) {
  const [draft, setDraft] = useState(selected);
  const [saved, setSaved] = useState(false);
  function submit(event) {
    event.preventDefault();
    if (!draft.trim()) {
      const input = event.currentTarget.querySelector('textarea');
      input.setCustomValidity('Escribe una palabra o una reflexión para encender tu estrella.');
      input.reportValidity();
      return;
    }
    onSave(draft.trim());
    setSaved(true);
  }
  return <>{children}{available && <form className="reflection-form" onSubmit={submit}><span className="eyebrow">UNA ESTRELLA QUE NACE DE TU LECTURA</span><h3>¿Qué te llevas de este encuentro?</h3><label htmlFor="station-reflection">Tu reflexión</label><textarea id="station-reflection" value={draft} onChange={event => { event.target.setCustomValidity(''); setDraft(event.target.value); setSaved(false); }} rows={4} maxLength={REFLECTION_LIMIT} required placeholder="Una palabra, una idea, una duda…" /><p className="quiet-note">Se queda en tu navegador, dentro de tu bolsillo espacial feminista. Puedes volver para editarla.</p><button className="primary" type="submit">{selected ? 'Actualizar mi estrella' : 'Guardar y encender mi estrella'}</button><p className="reflection-status" role="status">{saved ? 'Tu estrella brilla. La reflexión está en tu bolsillo.' : selected ? 'Esta estrella ya guarda una reflexión tuya.' : ''}</p></form>}<button className="text-button return-to-map" onClick={onReturn}>Volver al mapa</button></>;
}

export function MissionPocket({ alias, stations, mission, legacyWords, onOpen, onMap, onReset }) {
  const collected = Object.entries(mission.reflections);
  return <section className="mission-pocket" aria-labelledby="pocket-title"><span className="eyebrow">TU BOLSILLO ESPACIAL FEMINISTA</span><h1 id="pocket-title">Tus estrellas,<br /><em>{alias}.</em></h1><p>{collected.length ? 'Aquí vuelve a brillar lo que recogiste en tu viaje. Puedes regresar a cada página y editar tu reflexión.' : 'Aquí aparecerán las estrellas que enciendas con tus reflexiones.'}</p><div className="reflection-collection">{collected.map(([index, reflection]) => <article className="reflection-card" key={index}><span className="pocket-star" aria-hidden="true">✦</span><span className="eyebrow">ESTACIÓN {Number(index) + 1}</span><h2>{stations[index].title}</h2><p>{reflection}</p><button className="text-button" onClick={() => onOpen(Number(index))}>Volver a esta página</button></article>)}</div>{Object.keys(legacyWords).length > 0 && <section className="legacy-pocket"><h2>Palabras de tu recorrido anterior</h2><div className="word-notes">{Object.entries(legacyWords).map(([index, word]) => <div className="word-note" key={index}><span>{word}</span><small>Entrada {Number(index) + 1}</small></div>)}</div></section>}<p className="quiet-note">{collected.length} de 7 estrellas encendidas. La conexión entre estrellas y la barrera protectora llegarán en la siguiente etapa de este viaje.</p><div className="recap-actions"><button className="primary" onClick={onMap}>Volver al mapa</button><button className="text-button" onClick={onReset}>Borrar mi recorrido de este navegador</button></div></section>;
}
