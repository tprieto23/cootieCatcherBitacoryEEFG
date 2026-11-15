import React, { useState } from 'react';
import { REFLECTION_LIMIT, isStationComplete, completedStations, collectedStations } from './mission.js';
import { FabricPiece } from './fabric-workshop.jsx';
import { StationSilhouette } from './station-art.jsx';
import { ConstellationBuilder } from './constellation-builder.jsx';
import { StationStar } from './station-star.jsx';
import './expedition.css';
import './mission.css';
import './digital-map.css';

export const locations = [[22, 7], [68, 20], [27, 33], [72, 46], [27, 59], [68, 72], [35, 85]];
const navigationRoute = locations.slice(1).reduce((path, [x, y], index) => {
  const [previousX, previousY] = locations[index];
  const bend = (y - previousY) * .5;
  return `${path} C${previousX},${previousY + bend} ${x},${y - bend} ${x},${y}`;
}, `M${locations[0].join(',')}`);


export function MissionEncounter({ scenery, onAccept, motion }) {
  return <section className={`mission-encounter ${motion ? '' : 'is-paused'}`} aria-label="Aceptar misión">
    {scenery}
    <div className="encounter-copy"><button type="button" className="primary accept-mission" onClick={onAccept}>ACEPTAR MISIÓN</button><p className="collision-credit">Simulación realizada por Tania Prieto en 2023: interacción entre una galaxia tipo Vía Láctea y una galaxia enana, con datos suministrados por el equipo de astronomía de la Universidad Nacional de Colombia.</p></div>
  </section>;
}

export function NavigationMap({ alias, stations, mission, onOpen, onPocket, scenery, motion, approaching = false, destinationIndex = 0 }) {
  const lights = completedStations(mission).length;
  return <section className={`navigation-universe ${motion ? '' : 'is-paused'} ${approaching ? 'is-approaching' : ''}`} aria-labelledby="map-title">
    {scenery}
    <header className="navigation-heading"><div><span className="eyebrow">NEBULA-F23 · UNA SOLA MISIÓN</span><h1 id="map-title">Mapa de <em>navegación</em></h1></div><button className="pocket-access" onClick={onPocket}>Mi bolsillo <span>{lights} / 7 estrellas</span></button></header>
    <div className="navigation-layout">
      <section className={`navigation-device ${approaching ? 'is-approaching' : ''}`} aria-label="Mapa de las siete estaciones">
        <div className="device-topline"><span className="device-label"><span className="device-light" aria-hidden="true" />SISTEMA DE NAVEGACIÓN</span><span>NEBULA-F23</span></div><div className="device-viewport"><div className="device-scan" aria-hidden="true" /><div className="chart-display" tabIndex={0} role="region" aria-label="Pantalla del mapa. Desliza para explorar las siete estaciones.">
        <div className="chart-terrain" style={{ transformOrigin: `${locations[destinationIndex][0]}% ${locations[destinationIndex][1]}%` }}>
          <svg className="chart-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="route-glow" d={navigationRoute} /><path className="route-line" d={navigationRoute} /></svg>
          <ol className="station-route">{stations.map((note, index) => {
            const lit = isStationComplete(mission, index);
            const visited = mission.visited.includes(index);
            return <li key={note.number} style={{ left: `${locations[index][0]}%`, top: `${locations[index][1]}%` }}>
              <button className={`station-node station-kind-${index % 3} ${lit ? 'is-lit' : ''} expedition-node`} disabled={approaching} onClick={() => onOpen(index)} aria-label={`Estación ${note.number}: ${note.title}${lit ? index === 0 ? ', Pulso recogido' : ', material recogido' : visited ? ', visitada' : ''}`}>
                <StationStar index={index} complete={lit} />
                <span className="station-name">{note.title}</span>
              </button>
            </li>;
          })}</ol>
          <div className="screen-coordinates" aria-hidden="true"><span>F / 23</span><span>RUTA / 01—07</span></div>
        </div>
        </div></div>
        <div className="device-bottomline"><div><span>DESLIZA PARA EXPLORAR</span><span className="device-mission-label">Una misión · Siete destinos</span></div><div className="device-progress" aria-label={`${lights} de 7 materiales reunidos`}><div aria-hidden="true">{stations.map((_, index) => <span key={index} className={isStationComplete(mission, index) ? 'is-complete' : ''} />)}</div><span>{lights} / 7 materiales</span></div></div>
      </section>
      <aside className="navigation-guide" aria-labelledby="guide-title"><span className="eyebrow">PRIMERA TRANSMISIÓN DE NAVEGACIÓN</span><h2 id="guide-title">Guía de <em>navegación</em></h2><p>Astronauta {alias}, aquí comienza tu recorrido. Selecciona una estación para abrir una página de mi bitácora. Después de leerla, escribe una reflexión. Tu reflexión le dará brillo a una estrella que podrás guardar en tu bolsillo espacial feminista.</p><p>Cuando hayas recorrido las siete estaciones, abre el bolsillo. Allí podrás releer tus reflexiones y enlazar las estrellas. La energía de esa red formará la barrera que ayudará a la galaxia enana a cambiar de rumbo.</p><div className="navigation-progress"><span>{mission.visited.length} / 7 estaciones visitadas</span><span>{lights} / 7 estrellas encendidas</span></div><p className="quiet-note">Tu alias y tus reflexiones se guardan solo en este navegador. Tania no los recibe.</p></aside>
    </div>
  </section>;
}

export function MissionReflection({ selected = '', savedDraft, onDraft, onSave, onReturn, children, available }) {
  const [draft, setDraft] = useState(savedDraft ?? selected);
  const [saved, setSaved] = useState(false);
  function submit(event) {
    event.preventDefault();
    if (!draft.trim()) {
      const input = event.currentTarget.querySelector('textarea');
      input.setCustomValidity('Escribe una palabra o una reflexión para encender tu estrella.');
      input.reportValidity();
      return;
    }
    onSave(draft);
    setSaved(true);
  }
  return <>{children}{available && <form className="reflection-form" onSubmit={submit}><span className="eyebrow">UNA ESTRELLA QUE NACE DE TU LECTURA</span><h3>¿Qué te llevas de este encuentro?</h3><label htmlFor="station-reflection">Tu reflexión</label><textarea id="station-reflection" value={draft} onChange={event => { event.target.setCustomValidity(''); setDraft(event.target.value); onDraft?.(event.target.value); setSaved(false); }} rows={4} maxLength={REFLECTION_LIMIT} required placeholder="Una palabra, una idea, una duda…" /><p className="quiet-note">Se queda en tu navegador, dentro de tu bolsillo espacial feminista. Puedes volver para editarla.</p><button className="primary" type="submit">{selected ? 'Actualizar mi estrella' : 'Guardar y encender mi estrella'}</button><p className="reflection-status" role="status">{saved ? 'Tu estrella brilla. La reflexión está en tu bolsillo.' : selected ? 'Esta estrella ya guarda una reflexión tuya.' : ''}</p></form>}<button className="text-button return-to-map" onClick={onReturn}>Volver al mapa</button></>;
}

export function MissionPocket({ alias, stations, mission, legacyWords, onOpen, onMap, onReset, onConnect }) {
  const collected = collectedStations(mission);
  return <section className="mission-pocket" aria-labelledby="pocket-title"><span className="eyebrow">TU BOLSILLO ESPACIAL FEMINISTA</span><h1 id="pocket-title">Tus estrellas,<br /><em>{alias}.</em></h1><p>{collected.length ? 'Aquí vuelve a brillar lo que recogiste en tu viaje. Puedes regresar a cada página y volver a elegir lo que llevas contigo.' : 'Aquí aparecerán las estrellas que enciendas en tu recorrido.'}</p><PocketStars stations={stations} mission={mission} onOpen={onOpen} />{Object.keys(legacyWords).length > 0 && <section className="legacy-pocket"><h2>Palabras de tu recorrido anterior</h2><div className="word-notes">{Object.entries(legacyWords).map(([index, word]) => <div className="word-note" key={index}><span>{word}</span><small>Entrada {Number(index) + 1}</small></div>)}</div></section>}<ConstellationBuilder mission={mission} stations={stations} onConnect={onConnect} /><div className="recap-actions"><button className="primary" onClick={onMap}>Volver al mapa</button><button className="text-button" onClick={onReset}>Borrar mi recorrido de este navegador</button></div></section>;
}

export function PocketStars({ stations, mission, onOpen }) {
  const collected = collectedStations(mission);
  return collected.length ? <div className="reflection-collection">{collected.map(index => {
    const reflection = mission.reflections[index];
    const complete = isStationComplete(mission, Number(index));
    return <article className={`reflection-card ${complete ? 'has-material' : 'awaits-material'}`} key={index}><span className="pocket-star" aria-hidden="true">✦</span><span className="eyebrow">ESTACIÓN {Number(index) + 1}</span><h2>{stations[index].title}</h2><div className={`material-memory ${Number(index) === 0 ? 'ultraviolet-memory' : ''}`}><StationSilhouette kind={Number(index) === 0 ? 'pulse' : stations[index].silhouette} complete={complete} /><div><span>{stations[index].material}</span><small>{complete ? Number(index) === 0 ? 'Pulso recogido · Estrella encendida' : 'Material recogido · Estrella encendida' : 'Por sintonizar · Tu reflexión está a salvo'}</small></div></div>{index === 2 && mission.fabricPatch?.length === 2 && <FabricPiece indices={mission.fabricPatch} compact />}{reflection && <p>{reflection}</p>}{onOpen && <button className="text-button" onClick={() => onOpen(Number(index))}>Volver a esta página</button>}</article>;
  })}</div> : <p className="empty-pocket">Aquí aparecerán tus recuerdos: las estrellas, los materiales y las palabras que elijas llevar contigo.</p>;
}

export function DestinationPreview({ note, complete, onLand, onPocket, onReturn }) {
  return <div className="destination-preview"><StationStar index={note.number - 1} complete={complete} /><span className="eyebrow">OBJETIVO DE ESTA PARADA</span><p className="destination-objective">{note.objective}</p><p>{note.hint}</p>{!note.available && <p className="quiet-note">La página de esta estación está en escritura. Puedes visitarla y continuar explorando el mapa.</p>}<button type="button" className="primary" onClick={onLand}>Aterrizar</button><div className="destination-actions"><button type="button" className="text-button" onClick={onPocket}>Mi bolsillo</button><button type="button" className="text-button" onClick={onReturn}>Volver al mapa</button></div></div>;
}
