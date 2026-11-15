import React from 'react';

export function StationSilhouette({ kind, complete = false, segments = [], className = '' }) {
  return <svg className={`destination-art art-${kind} ${complete ? 'is-collected' : ''} ${className}`} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    {kind === 'antenna' && <>
      <circle className="antenna-aura" cx="60" cy="40" r="31" />
      <g className="antenna-structure"><path d="M54 72L43 109M66 72L78 109M38 109H83M49 91H72M60 47V25M60 25L80 13" /><circle cx="81" cy="12" r="3" /><path d="M21 38Q60 104 99 38Z" /></g>
      {[0, 1, 2].map(index => <path key={index} className={`antenna-segment ${segments.includes(index) || complete ? 'is-tuned' : ''}`} d={['M25 42Q34 68 46 71L43 43Z', 'M47 43L49 72Q60 77 71 72L73 43Z', 'M77 43L74 71Q89 63 95 42Z'][index]} />)}
      <g className="antenna-emission"><path d="M87 9Q103 12 108 28M88 20Q94 22 97 28" /><circle cx="81" cy="12" r="5" /></g>
    </>}
    {kind === 'relay' && <g className="outline-art"><path d="M60 28V109M41 109H79M48 86H72" />{[0, 1].map(index => <g key={index} className={`relay-signal ${segments.includes(index) || complete ? 'is-tuned' : ''}`}><path d={index === 0 ? 'M42 24Q22 44 42 64M32 13Q1 44 32 75' : 'M78 24Q98 44 78 64M88 13Q119 44 88 75'} /></g>)}<circle cx="60" cy="44" r="8" className="art-accent" /></g>}
    {kind === 'table' && <g className="outline-art"><path d="M14 60H106V71H14ZM24 71V108M96 71V108M36 71L31 108M83 71L89 108M45 58V43H64V58M64 45H70Q79 52 64 54M25 49Q41 15 63 30Q90 48 96 21" /><path d="M39 34Q57 17 76 37" className="art-accent" /></g>}
    {kind === 'prism' && <g className="outline-art"><path d="M60 15L102 99H18ZM60 15V80L18 99M60 80L102 99M3 55H38" /><path d="M79 48L116 26M84 59L116 59M88 71L116 95" className="art-accent" /><path d="M60 15L60 80L102 99Z" className="art-fill" /></g>}
    {kind === 'compass' && <g className="outline-art"><path d="M53 16A44 44 0 0 0 53 104M67 16A44 44 0 0 1 67 104M53 11V22M67 98V109M12 60H24M96 60H108" /><path d="M53 37L30 81L53 65ZM67 83L90 39L67 55Z" className="art-accent" /></g>}
    {kind === 'capsule' && <g className="outline-art"><rect x="31" y="16" width="58" height="94" rx="25" /><path d="M32 54H88M42 38H78M41 80H47L52 68L60 94L68 71L73 82H80" className="art-accent" /></g>}
    {kind === 'radar' && <g className="outline-art"><circle cx="60" cy="60" r="46" /><circle cx="60" cy="60" r="28" /><path d="M14 60H106M60 14V106M60 60L93 28M33 102Q20 83 39 76T69 69T87 43" /><circle cx="86" cy="43" r="5" className="art-accent" /></g>}
    {kind === 'pulse' && <g className="pulse-symbol"><circle cx="60" cy="60" r="44" /><circle cx="60" cy="60" r="30" /><circle className="pulse-core" cx="60" cy="60" r="12" /><path d="M4 60H32L42 43L53 79L65 48L76 65L85 60H116" /></g>}
    {kind === 'thermal' && <g className="outline-art"><path className="art-fill" d="M61 12C79 35 100 48 98 73C96 98 77 110 58 108C33 106 18 90 23 68C27 50 48 43 42 27C55 33 59 45 59 56C75 45 67 30 61 12Z" /><path className="art-accent" d="M45 82Q35 70 47 58M61 88Q51 74 63 62M77 84Q68 73 79 59" /></g>}
  </svg>;
}
