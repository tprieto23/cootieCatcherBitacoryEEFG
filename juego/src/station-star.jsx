import React, { useId } from 'react';
import './station-star.css';

const colors = [
  ['#db9bff', '#9b4fe0', '#532382'], ['#ffb3c6', '#e5679f', '#873276'],
  ['#ffdf70', '#eaa637', '#9e5361'], ['#d4b4ff', '#9b7be2', '#57458f'],
  ['#f2a0da', '#cd5ab1', '#712c83'], ['#ffc5a9', '#f18e9e', '#994a8b'],
  ['#b7a2f5', '#7c67cd', '#49356e'],
];
function corona(index, radius) {
  return Array.from({ length: 96 }, (_, step) => {
    const angle = step / 96 * Math.PI * 2;
    const r = radius + (4 + index % 3) * Math.cos(angle * (5 + index % 4));
    return `${step ? 'L' : 'M'}${80 + Math.cos(angle) * r},${80 + Math.sin(angle) * r}`;
  }).join(' ') + 'Z';
}

// Destinations are stars; equipment silhouettes remain materials of the visit.
export function StationStar({ index, complete }) {
  const id = useId();
  const [light, color, shade] = colors[index % colors.length];
  return <span className={`station-star-host ${index === 0 ? 'star-ultraviolet' : ''} ${complete ? 'is-collected' : ''}`} style={{ '--star-color': color, '--star-light': light, '--star-delay': `${index * -1.3}s`, '--star-period': `${22 + index * 3}s` }}>
    <svg className="station-star-body" viewBox="0 0 160 160" aria-hidden="true">
      <defs><radialGradient id={`${id}-halo`}><stop stopColor={light} stopOpacity=".8" /><stop offset=".25" stopColor={color} stopOpacity=".6" /><stop offset=".65" stopColor={color} stopOpacity=".14" /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient><radialGradient id={`${id}-core`} cx="36%" cy="30%" r="75%"><stop stopColor={light} /><stop offset=".45" stopColor={color} /><stop offset="1" stopColor={shade} /></radialGradient></defs>
      <circle className="star-aura" cx="80" cy="80" r="77" fill={`url(#${id}-halo)`} />
      <g className="star-corona"><path d={corona(index, 39)} fill={color} opacity=".22" /><path d={corona(index + 2, 47)} stroke={light} strokeWidth=".8" fill="none" opacity=".3" /></g>
      <g className="star-heart"><path className="stellar-rays" d="M80 12L84 65L119 41L95 76L148 80L95 84L119 119L84 95L80 148L76 95L41 119L65 84L12 80L65 76L41 41L76 65Z" fill={light} /><circle cx="80" cy="80" r={24 + index % 3 * 2} fill={`url(#${id}-core)`} /><path d="M63 65Q79 53 97 69M62 87Q81 104 98 85" stroke={light} strokeWidth="1.3" opacity=".6" fill="none" /><circle className="star-earned-glow" cx="80" cy="80" r="32" fill="none" /></g>
    </svg>
  </span>;
}
