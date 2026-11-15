import React, { useState } from 'react';
import { completedStations, hasProtectiveBarrier } from './mission.js';

const points = [[50, 12], [78, 27], [88, 59], [67, 85], [32, 85], [12, 59], [22, 27]];

export function ConstellationBuilder({ mission, stations, onConnect }) {
  const [first, setFirst] = useState(null);
  const complete = completedStations(mission).length;
  const barrier = hasProtectiveBarrier(mission);
  function choose(index) {
    if (first === null) setFirst(index);
    else { if (index !== first) onConnect(first, index); setFirst(null); }
  }
  return <section className={`barrier-builder ${barrier ? 'has-barrier' : ''}`} aria-labelledby="barrier-title"><span className="eyebrow">UNA MISIÓN COMPARTIDA</span><h2 id="barrier-title">Una red para <em>cambiar de rumbo</em></h2>{complete < 7 ? <p>Has encendido {complete} de las siete estrellas. Cuando las reúnas todas, podrás enlazarlas aquí para formar la barrera protectora.</p> : <><p>Selecciona una estrella y después otra para unirlas. Busca conexiones entre tus reflexiones hasta reunir las siete en una misma red.</p><div className="barrier-chart"><svg viewBox="0 0 100 100" aria-hidden="true"><ellipse className="protected-galaxy" cx="50" cy="50" rx="16" ry="9" /><ellipse className="protective-field" cx="50" cy="50" rx="32" ry="37" />{mission.links.map(([a, b]) => <line key={`${a}-${b}`} x1={points[a][0]} y1={points[a][1]} x2={points[b][0]} y2={points[b][1]} />)}</svg>{points.map(([x, y], index) => <button key={index} style={{ left: `${x}%`, top: `${y}%` }} aria-label={`Enlazar estrella de ${stations[index].title}`} aria-pressed={first === index} onClick={() => choose(index)}><span aria-hidden="true">✦</span><small>{index + 1}</small></button>)}</div><p className="barrier-status" role="status">{barrier ? 'La red de tus siete estrellas forma una barrera protectora. La galaxia enana puede cambiar de rumbo y seguir su camino.' : first !== null ? `Estrella ${first + 1} seleccionada. Elige otra para enlazarla.` : 'Las conexiones también son parte de tu recorrido.'}</p></>}</section>;
}
