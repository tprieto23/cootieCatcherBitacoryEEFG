import React, { useState } from 'react';
import { REFLECTION_LIMIT, isStationComplete, completedStations, collectedStations, hasStationMaterial, DARK_MATTER_FRAGMENTS } from './mission.js';
import { FabricPiece } from './fabric-workshop.jsx';
import { StationSilhouette } from './station-art.jsx';
import { ConstellationBuilder } from './constellation-builder.jsx';
import { StationStar } from './station-star.jsx';
import { BrandName } from './brand-name.jsx';
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
  const materials = stations.filter((_, index) => hasStationMaterial(mission, index)).length;
  return <section className={`navigation-universe ${motion ? '' : 'is-paused'} ${approaching ? 'is-approaching' : ''}`} aria-labelledby="map-title">
    {scenery}
    <header className="navigation-heading"><div><span className="eyebrow"><BrandName /> · MISIÓN COMANDADA POR ASTRONAUTA {alias}</span><h1 id="map-title">Mapa de <em>navegación</em></h1></div><button className="pocket-access" onClick={onPocket}>Mi bolsillo <span>{lights} / 7 estrellas</span></button></header>
    <div className="navigation-layout">
      <section className={`navigation-device ${approaching ? 'is-approaching' : ''}`} aria-label="Mapa de las siete estaciones">
        <div className="device-topline"><span className="device-label"><span className="device-light" aria-hidden="true" />SISTEMA DE NAVEGACIÓN</span><BrandName /></div><div className="device-viewport"><div className="device-scan" aria-hidden="true" /><div className="chart-display" tabIndex={0} role="region" aria-label="Pantalla del mapa. Desliza para explorar las siete estaciones.">
        <div className="chart-terrain" style={{ transformOrigin: `${locations[destinationIndex][0]}% ${locations[destinationIndex][1]}%` }}>
          <svg className="chart-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="route-glow" d={navigationRoute} /><path className="route-line" d={navigationRoute} /></svg>
          <ol className="station-route">{stations.map((note, index) => {
            const lit = isStationComplete(mission, index);
            const visited = mission.visited.includes(index);
            return <li key={note.number} style={{ left: `${locations[index][0]}%`, top: `${locations[index][1]}%` }}>
              <button className={`station-node station-kind-${index % 3} ${lit ? 'is-lit' : ''} expedition-node`} disabled={approaching} onClick={() => onOpen(index)} aria-label={`Estación ${note.number}: ${note.title}${lit ? index === 0 ? ', Pulso recogido' : index === 3 ? ', estrella encendida' : ', material recogido' : visited ? ', visitada' : ''}`}>
                <StationStar index={index} complete={lit} />
                <span className="station-name">{note.title}</span>
              </button>
            </li>;
          })}</ol>
          <div className="screen-coordinates" aria-hidden="true"><span>F / 23</span><span>RUTA / 01—07</span></div>
        </div>
        </div></div>
        <div className="device-bottomline"><div><span>DESLIZA PARA EXPLORAR</span><span className="device-mission-label">Una misión · Siete destinos</span></div><div className="device-progress" aria-label={`${materials} de 7 materiales reunidos`}><div aria-hidden="true">{stations.map((_, index) => <span key={index} className={hasStationMaterial(mission, index) ? 'is-complete' : ''} />)}</div><span>{materials} / 7 materiales</span></div></div>
      </section>
      <aside className="navigation-guide" aria-labelledby="guide-title"><span className="eyebrow">PRIMERA TRANSMISIÓN DE NAVEGACIÓN</span><h2 id="guide-title">Guía de <em>navegación</em></h2><p>Astronauta {alias}, aquí comienza tu recorrido. Selecciona una estación para abrir una página de mi bitácora. Cada estación te propone algo para llevar contigo: una reflexión, unos retazos, energía o fragmentos de materia oscura. Ese recuerdo le dará brillo a su estrella y quedará en tu bolsillo espacial feminista.</p><p>Cuando hayas recorrido las siete estaciones, abre el bolsillo. Allí podrás releer tus reflexiones y enlazar las estrellas. La energía de esa red formará la barrera que ayudará a la galaxia enana a cambiar de rumbo.</p><div className="navigation-progress"><span>{mission.visited.length} / 7 estaciones visitadas</span><span>{lights} / 7 estrellas encendidas</span></div><p className="quiet-note">Tu alias y tus reflexiones se guardan solo en este navegador. Tania no los recibe.</p></aside>
    </div>
  </section>;
}

export function MissionReflection({ selected = '', savedDraft, onDraft, onSave, onReturn, children, available, prompt }) {
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
  return <>{children}{available && <form className="reflection-form" onSubmit={submit}><span className="eyebrow">UNA ESTRELLA QUE NACE DE TU LECTURA</span>{prompt ? <label className="reflection-invitation" htmlFor="station-reflection">{prompt}</label> : <><h3>¿Qué te llevas de este encuentro?</h3><label htmlFor="station-reflection">Tu reflexión</label></>}<textarea id="station-reflection" value={draft} onChange={event => { event.target.setCustomValidity(''); setDraft(event.target.value); onDraft?.(event.target.value); setSaved(false); }} rows={4} maxLength={REFLECTION_LIMIT} required placeholder="Una palabra, una idea, una duda…" /><p className="quiet-note">Se queda en tu navegador, dentro de tu bolsillo espacial feminista. Puedes volver para editarla.</p><button className="primary" type="submit">{selected ? 'Actualizar mi estrella' : 'Guardar y encender mi estrella'}</button><p className="reflection-status" role="status">{saved ? 'Tu estrella brilla. La reflexión está en tu bolsillo.' : selected ? 'Esta estrella ya guarda una reflexión tuya.' : ''}</p></form>}<button className="text-button return-to-map" onClick={onReturn}>Volver al mapa</button></>;
}

export function MissionPocket({ alias, stations, mission, legacyWords, onOpen, onMap, onReset, onConnect }) {
  const collected = collectedStations(mission);
  return <section className="mission-pocket" aria-labelledby="pocket-title"><span className="eyebrow">TU BOLSILLO ESPACIAL FEMINISTA</span><h1 id="pocket-title">Tus estrellas,<br /><em>{alias}.</em></h1><p>{collected.length ? 'Aquí vuelve a brillar lo que recogiste en tu viaje. Puedes regresar a cada página y volver a elegir lo que llevas contigo.' : 'Aquí aparecerán las estrellas que enciendas en tu recorrido.'}</p><PocketStars stations={stations} mission={mission} onOpen={onOpen} />{Object.keys(legacyWords).length > 0 && <section className="legacy-pocket"><h2>Palabras de tu recorrido anterior</h2><div className="word-notes">{Object.entries(legacyWords).map(([index, word]) => <div className="word-note" key={index}><span>{word}</span><small>Entrada {Number(index) + 1}</small></div>)}</div></section>}<ConstellationBuilder mission={mission} stations={stations} onConnect={onConnect} /><div className="recap-actions"><button className="primary" onClick={onMap}>Volver al mapa</button><button className="text-button" onClick={onReset}>Borrar mi recorrido de este navegador</button></div></section>;
}

export function PocketStars({ stations, mission, onOpen }) {
  const collected = collectedStations(mission);
  return collected.length ? <div className="reflection-collection">{collected.map(index => {
    const reflection = mission.reflections[index];
    const complete = isStationComplete(mission, index);
    const material = hasStationMaterial(mission, index);
    const energy = index === 3;
    const darkMatter = index === 4;
    const status = darkMatter
      ? `${mission.darkMatterFragments.length} de 2 fragmentos recogidos · ${complete ? 'Estrella encendida' : 'Estrella por completar'}`
      : energy
      ? `${material ? 'Energía recogida' : 'Energía por recoger'} · ${complete ? 'Estrella encendida' : 'Estrella por encender al recoger la energía'}`
      : complete ? index === 0 ? 'Pulso recogido · Estrella encendida' : 'Material recogido · Estrella encendida' : 'Por sintonizar · Tu reflexión está a salvo';
    return <article className={`reflection-card ${material ? 'has-material' : 'awaits-material'}`} key={index}>
      <span className={`pocket-star ${complete ? '' : 'is-unlit'}`} aria-hidden="true">✦</span>
      <span className="eyebrow">ESTACIÓN {index + 1}</span>
      <h2>{energy ? 'Energía disipada' : darkMatter ? 'Materia oscura' : stations[index].title}</h2>
      {(energy || darkMatter) && <p className="quiet-note">{stations[index].title}</p>}
      <div className={`material-memory ${index === 0 ? 'ultraviolet-memory' : ''}`}>
        <StationSilhouette kind={index === 0 ? 'pulse' : stations[index].silhouette} complete={material} />
        <div><span>{energy ? 'Calor del encuentro galáctico' : darkMatter ? 'Saberes que cambian la pregunta' : stations[index].material}</span><small>{status}</small></div>
      </div>
      {index === 2 && mission.fabricPatch?.length > 0 && <FabricPiece indices={mission.fabricPatch} compact />}
      {darkMatter && mission.darkMatterFragments.map(fragmentIndex => <blockquote className="pocket-dark-fragment" key={fragmentIndex}><p>{DARK_MATTER_FRAGMENTS[fragmentIndex].quote}</p><cite>— {DARK_MATTER_FRAGMENTS[fragmentIndex].source}</cite></blockquote>)}
      {reflection && <p>{reflection}</p>}
      {onOpen && <button className="text-button" onClick={() => onOpen(index)}>Volver a esta página</button>}
    </article>;
  })}</div> : <p className="empty-pocket">Aquí aparecerán tus recuerdos: las estrellas, los materiales y las palabras que elijas llevar contigo.</p>;
}

export function DestinationPreview({ note, complete, onLand, onPocket, onReturn }) {
  return <div className="destination-preview"><StationStar index={note.number - 1} complete={complete} /><span className="eyebrow">OBJETIVO DE ESTA PARADA</span><p className="destination-objective">{note.objective}</p><p>{note.hint}</p>{!note.available && <p className="quiet-note">La página de esta estación está en escritura. Puedes visitarla y continuar explorando el mapa.</p>}<button type="button" className="primary" onClick={onLand}>Aterrizar</button><div className="destination-actions"><button type="button" className="text-button" onClick={onPocket}>Mi bolsillo</button><button type="button" className="text-button" onClick={onReturn}>Volver al mapa</button></div></div>;
}
