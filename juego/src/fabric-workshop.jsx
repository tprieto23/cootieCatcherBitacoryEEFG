import React, { useEffect, useId, useState } from 'react';
import { FABRIC_WORDS } from './mission.js';
import './fabric-workshop.css';

const fabrics = [
  ['#FCA4BC', '#3b174e'], ['#76509c', '#fff0fa'], ['#FDDD46', '#44215e'],
  ['#4A1B70', '#f6e9ff'], ['#c2afdb', '#3b174e'], ['#b55186', '#fff1f7'], ['#e8b6b2', '#44215e'],
];
const fabricStyle = index => ({ '--fabric-color': fabrics[index][0], '--fabric-ink': fabrics[index][1], '--fabric-tilt': `${index % 2 ? 3 : -3}deg` });

export function FabricPiece({ indices, sewing = false, compact = false }) {
  return <div className={`fabric-piece ${sewing ? 'is-sewing' : 'is-sewn'} ${compact ? 'is-compact' : ''}`} role="img" aria-label={`Retazos cosidos: ${indices.map(index => FABRIC_WORDS[index]).join(' y ')}`}>
    {indices.map((index, position) => <span className={`fabric-scrap fabric-half-${position}`} style={fabricStyle(index)} key={`${position}-${index}`}><span>{FABRIC_WORDS[index]}</span></span>)}
    <svg className="fabric-seam" viewBox="0 0 40 180" preserveAspectRatio="none" aria-hidden="true"><path className="fabric-stitches" d="M8 9L30 17L10 27L29 37L9 47L30 57L10 67L29 77L9 87L30 97L10 107L29 117L9 127L30 137L10 147L29 157L9 169" /><g className="fabric-needle"><path d="M17 0L23 20L19 27L15 7Z" /><path d="M18 2L20 9" /></g></svg>
  </div>;
}

export function FabricWorkshop({ selected, saved, onChoose, onSave, motion }) {
  const id = useId();
  const samePiece = saved.length === 2 && selected.every((index, position) => index === saved[position]) && selected.length === 2;
  const [phase, setPhase] = useState(samePiece ? 'ready' : 'choosing');
  const pairKey = selected.join(',');
  const savedKey = saved.join(',');
  useEffect(() => {
    if (selected.length !== 2) { setPhase('choosing'); return; }
    if (samePiece || !motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPhase('ready'); return; }
    setPhase('sewing');
    const timer = window.setTimeout(() => setPhase('ready'), 2100);
    return () => window.clearTimeout(timer);
  }, [pairKey, savedKey, motion]);

  return <section className="fabric-workshop" aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`}>Retazos para llevar contigo</h2>
    <p>Escoge dos retazos que resuenen con tu lectura.</p>
    <div className="fabric-options" role="group" aria-label="Elige dos retazos de tela">
      {FABRIC_WORDS.map((word, index) => <button type="button" key={word} className="fabric-option fabric-scrap" style={fabricStyle(index)} aria-pressed={selected.includes(index)} disabled={selected.length === 2 && !selected.includes(index)} onClick={() => onChoose(index)}><span>{word}</span><small>{selected.includes(index) ? `Retazo ${selected.indexOf(index) + 1} · Elegido` : 'Elegir'}</small></button>)}
    </div>
    <p className="fabric-progress" role="status">{phase === 'sewing' ? 'Un hilo va uniendo tus retazos…' : samePiece ? 'Tu pieza de retazos ya está en tu bolsillo feminista.' : selected.length === 2 ? 'Tus dos retazos están cosidos. Ya puedes guardarlos.' : `${selected.length} de 2 retazos elegidos.`}</p>
    {selected.length === 2 && <FabricPiece key={pairKey} indices={selected} sewing={phase === 'sewing'} />}
    <button type="button" className="primary fabric-save" disabled={selected.length !== 2 || phase !== 'ready' || samePiece} onClick={onSave}>Guardar en mi bolsillo</button>
    {saved.length === 2 && !samePiece && <p className="fabric-existing">Tu pieza anterior sigue en el bolsillo hasta que guardes esta nueva elección.</p>}
  </section>;
}
