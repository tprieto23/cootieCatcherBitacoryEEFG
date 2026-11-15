import React, { useEffect, useId, useState } from 'react';
import { FABRIC_WORDS, AUTHOR_FABRIC_WORD } from './mission.js';
import './fabric-workshop.css';

const fabrics = [
  ['#FCA4BC', '#3b174e'], ['#76509c', '#fff0fa'], ['#FDDD46', '#44215e'],
  ['#C03A10', '#fff0fa'], ['#c2afdb', '#3b174e'], ['#b55186', '#fff1f7'], ['#e8b6b2', '#44215e'],
];
const fabricStyle = index => ({ '--fabric-color': fabrics[index][0], '--fabric-ink': fabrics[index][1], '--fabric-tilt': `${index % 2 ? 3 : -3}deg` });

function FabricSeam({ horizontal = false, shorter = false }) {
  return <svg className={`fabric-seam ${horizontal ? 'is-horizontal' : ''} ${shorter ? 'is-short' : ''}`} viewBox={horizontal ? '0 0 180 40' : '0 0 40 180'} preserveAspectRatio="none" aria-hidden="true">
    <path className="fabric-stitches" d={horizontal ? 'M9 8L17 30L27 10L37 29L47 9L57 30L67 10L77 29L87 9L97 30L107 10L117 29L127 9L137 30L147 10L157 29L169 9' : 'M8 9L30 17L10 27L29 37L9 47L30 57L10 67L29 77L9 87L30 97L10 107L29 117L9 127L30 137L10 147L29 157L9 169'} />
    <g className="fabric-needle"><path d={horizontal ? 'M0 17L20 23L27 19L7 15Z' : 'M17 0L23 20L19 27L15 7Z'} /><path d={horizontal ? 'M2 18L9 20' : 'M18 2L20 9'} /></g>
  </svg>;
}

export function FabricPiece({ indices, sewing = false, compact = false }) {
  const threeScraps = indices.length === 2;
  return <div className={`fabric-piece ${threeScraps ? 'has-three-scraps' : ''} ${sewing ? 'is-sewing' : 'is-sewn'} ${compact ? 'is-compact' : ''}`} role="img" aria-label={`${sewing ? 'Uniendo retazos' : 'Patchwork cosido'}: ${[...indices.map(index => FABRIC_WORDS[index]), `${AUTHOR_FABRIC_WORD}, retazo de Tania`].join(' y ')}`}>
    {indices.map((index, position) => <span className={`fabric-scrap fabric-half-${position}`} style={fabricStyle(index)} key={`${position}-${index}`}><span>{FABRIC_WORDS[index]}</span></span>)}
    <span className="fabric-scrap fabric-author" style={{ '--fabric-color': '#d4dcf3', '--fabric-ink': '#4A1B70' }}><small>Retazo de Tania</small><span>{AUTHOR_FABRIC_WORD}</span></span>
    <FabricSeam shorter={threeScraps} />
    {threeScraps && <FabricSeam horizontal />}
  </div>;
}

export function FabricWorkshop({ selected, saved, onChoose, onSave, motion }) {
  const id = useId();
  const samePiece = saved.length > 0 && selected.length === saved.length && selected.every((index, position) => index === saved[position]);
  const [revealedKey, setRevealedKey] = useState(null);
  const [phase, setPhase] = useState(samePiece ? 'ready' : 'choosing');
  const pairKey = selected.join(',');
  const savedKey = saved.join(',');
  const showPiece = selected.length > 0 && (samePiece || revealedKey === pairKey);
  useEffect(() => {
    if (!showPiece) { setPhase('choosing'); return; }
    if (samePiece || !motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPhase('ready'); return; }
    setPhase('sewing');
    const timer = window.setTimeout(() => setPhase('ready'), selected.length === 2 ? 3600 : 2100);
    return () => window.clearTimeout(timer);
  }, [showPiece, pairKey, savedKey, motion]);

  return <section className="fabric-workshop" aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`}>Hagamos un patchwork juntas, escoge uno o dos retazos y luego descubre lo que se crea.</h2>
    <p>El patchwork une retazos de tela para crear una nueva pieza.</p>
    <div className="fabric-options" role="group" aria-label="Elige uno o dos retazos de tela">
      {FABRIC_WORDS.map((word, index) => <button type="button" key={word} className="fabric-option fabric-scrap" style={fabricStyle(index)} aria-pressed={selected.includes(index)} disabled={selected.length === 2 && !selected.includes(index)} onClick={() => onChoose(index)}><span>{word}</span></button>)}
    </div>
    <p className="fabric-progress" role="status">{phase === 'sewing' && showPiece ? 'Un hilo va uniendo tus retazos con el mío…' : samePiece ? 'Nuestro patchwork ya está en tu bolsillo feminista.' : showPiece && phase === 'ready' ? 'Nuestro patchwork está listo para guardar.' : selected.length ? `${selected.length} ${selected.length === 1 ? 'retazo elegido' : 'retazos elegidos'}. Descubre cómo ${selected.length === 1 ? 'se une' : 'se unen'} al mío.` : 'Puedes elegir uno o dos retazos.'}</p>
    {showPiece && <FabricPiece key={pairKey} indices={selected} sewing={phase === 'sewing'} />}
    {!showPiece && <button type="button" className="primary fabric-save" disabled={!selected.length} onClick={() => setRevealedKey(pairKey)}>Descubrir el patchwork</button>}
    {showPiece && <button type="button" className="primary fabric-save" disabled={phase !== 'ready' || samePiece} onClick={onSave}>Guardar en mi bolsillo</button>}
    {saved.length > 0 && !samePiece && <p className="fabric-existing">Tu pieza anterior sigue en el bolsillo hasta que guardes esta nueva elección.</p>}
  </section>;
}
