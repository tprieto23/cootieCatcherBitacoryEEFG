import React, { useId } from 'react';
import './station-star.css';

// Stars identify destinations; the equipment silhouettes identify collected materials.
export function StationStar({ index, complete }) {
  const gradient = useId();
  return <span className={`station-star-host ${index === 0 ? 'star-ultraviolet' : ''} ${complete ? 'is-collected' : ''}`}>
    <svg className="station-star-body" viewBox="0 0 120 120" aria-hidden="true">
      <defs><radialGradient id={gradient}><stop stopColor="#fff8ec" stopOpacity=".95" /><stop offset=".15" stopColor={complete ? '#FDDD46' : '#f5b4eb'} stopOpacity=".85" /><stop offset=".45" stopColor={index % 2 ? '#fca4bc' : '#ba7dff'} stopOpacity=".25" /><stop offset="1" stopColor="#ba7dff" stopOpacity="0" /></radialGradient></defs>
      <circle cx="60" cy="60" r="57" fill={`url(#${gradient})`} />
      <path className="stellar-rays" d="M60 7L64 51L94 26L69 56L113 60L69 64L94 94L64 69L60 113L56 69L26 94L51 64L7 60L51 56L26 26L56 51Z" />
      <circle cx="60" cy="60" r="8" fill="#fff9ee" />
    </svg>
  </span>;
}
