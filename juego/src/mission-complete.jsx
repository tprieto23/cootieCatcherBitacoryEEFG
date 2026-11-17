import React from 'react';
import { BlackHole } from './mission-farewell.jsx';
import { BrandName } from './brand-name.jsx';
import './mission-complete.css';

export function MissionComplete({ alias, motion, onNetwork, onPocket, onHome, onEnter }) {
  return <section className={`mission-complete ${motion ? '' : 'is-still'}`} aria-labelledby="mission-complete-title">
    <nav className="visit-toolbar" aria-label="Acciones de misión completada">
      <button type="button" className="text-button" onClick={onNetwork}>Volver a mi red de estrellas</button>
      <span className="visit-location">ÓRBITA HOGAR</span>
      <button type="button" className="visit-pocket-button" onClick={onPocket} aria-haspopup="dialog">Mi bolsillo</button>
    </nav>
    <div className="mission-complete-message">
      <p className="eyebrow">ASTRONAUTA <span className="astronaut-name">{alias}</span> · <BrandName /></p>
      <h1 id="mission-complete-title">MISION COMPLETADA</h1>
      <p className="mission-complete-invitation">Has desafiado a los métodos de investigación de la academia tradicional, considérate parte del club que le apuesta a otras formas de construir y compartir conocimiento.</p>
      <button type="button" className="mission-complete-portal" onClick={onEnter} aria-label="Entrar al agujero negro y viajar a los objetos de mi bolsillo">
        <BlackHole className="mission-complete-black-hole" />
        <span>Entrar al agujero negro</span>
      </button>
      <p className="mission-complete-arrival">Atraviesa este agujero negro y vuelve a encontrarte con los objetos que llevas en tu bolsillo espacial feminista.</p>
      <button type="button" className="cover-open" onClick={onHome}>Regresar a mi órbita hogar <span aria-hidden="true">↗</span></button>
    </div>
  </section>;
}
