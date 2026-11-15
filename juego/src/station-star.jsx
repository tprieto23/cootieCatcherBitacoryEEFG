import React, { useId } from 'react';
import './station-star.css';

const colors = [
  ['#cbb1d6', '#856595', '#463455'], ['#ccb2b0', '#977786', '#463443'],
  ['#c4a4bf', '#865b86', '#49334f'], ['#dec59c', '#b38a60', '#6d4c46'],
  ['#b5a9cc', '#7c7297', '#383344'], ['#c8a5b5', '#925c7b', '#4b344c'],
  ['#b3afcd', '#73728f', '#343047'],
];

// The seven destinations have different celestial forms; rewards remain pocket stars.
export function StationStar({ index, complete }) {
  const id = useId();
  const [light, color, shade] = colors[index % colors.length];
  return <span className={`station-star-host celestial-kind-${index} ${complete ? 'is-collected' : ''}`} style={{ '--star-color': color, '--star-light': light, '--star-delay': `${index * -1.3}s`, '--star-period': `${40 + index * 3}s` }}>
    <svg className="station-star-body" viewBox="0 0 160 160" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-halo`}><stop stopColor={light} stopOpacity=".3" /><stop offset=".4" stopColor={color} stopOpacity=".14" /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}-core`} cx="30%" cy="25%" r="75%"><stop stopColor={light} /><stop offset=".55" stopColor={color} /><stop offset="1" stopColor={shade} /></radialGradient>
        <radialGradient id={`${id}-cloud`}><stop stopColor={light} stopOpacity=".7" /><stop offset=".5" stopColor={color} stopOpacity=".5" /><stop offset="1" stopColor={shade} stopOpacity="0" /></radialGradient>
        <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" /></filter>
        <clipPath id={`${id}-planet`}><circle cx="80" cy="80" r="35" /></clipPath>
      </defs>
      <circle className="star-aura" cx="80" cy="80" r="70" fill={`url(#${id}-halo)`} />
      {index === 0 && <g className="star-heart"><path d="M77 28Q85 64 95 70L135 78Q99 85 91 95L82 133Q73 99 61 89L25 82Q61 74 69 64Z" fill={color} opacity=".7" /><path d="M78 44L83 70L116 80L88 86L81 113L74 88L45 80L71 74Z" fill={light} opacity=".55" /><circle cx="80" cy="80" r="12" fill={`url(#${id}-core)`} /><path d="M65 61Q86 55 100 71M57 93Q75 107 97 96" stroke={light} strokeWidth=".7" fill="none" opacity=".25" /></g>}
      {index === 1 && <g className="celestial-planet"><ellipse cx="80" cy="82" rx="61" ry="16" transform="rotate(-23 80 82)" stroke={color} strokeWidth="4" opacity=".5" /><circle cx="80" cy="80" r="35" fill={`url(#${id}-core)`} /><g clipPath={`url(#${id}-planet)`} stroke={light} opacity=".2" fill="none"><path d="M33 62Q77 43 124 67M30 79Q75 58 125 84M35 94Q85 78 125 103" strokeWidth="4" /></g><path d="M23 104Q48 120 96 96Q132 78 136 61" stroke={light} strokeWidth="2.5" fill="none" opacity=".65" /></g>}
      {index === 2 && <g className="nebula-cloud"><path d="M20 105Q10 69 49 64Q28 24 69 40Q88 12 106 53Q151 43 135 78Q160 108 116 118Q87 150 67 119Q36 144 20 105Z" fill={`url(#${id}-cloud)`} filter={`url(#${id}-soft)`} /><path d="M30 105Q49 62 78 78T129 57M47 115Q65 85 96 100T136 89" stroke={light} strokeWidth="1.2" fill="none" opacity=".3" /><g fill={light}><circle cx="61" cy="82" r="1.8" /><circle cx="94" cy="61" r="1.4" /><circle cx="104" cy="102" r="1" /></g></g>}
      {index === 3 && <><g className="star-corona"><path d="M79 30L90 48L112 40L108 61L132 69L117 86L131 107L107 109L98 133L79 117L56 129L53 108L30 97L47 80L32 58L57 55L62 32L73 45Z" fill={color} opacity=".4" /><path d="M58 46Q77 31 97 50M118 70Q132 89 110 109M57 117Q38 102 45 85" stroke={light} fill="none" opacity=".3" /></g><g className="star-heart"><circle cx="80" cy="80" r="30" fill={`url(#${id}-core)`} /><path d="M60 65Q79 53 98 72M55 88Q75 99 101 88" stroke={light} opacity=".3" fill="none" /></g></>}
      {index === 4 && <g className="celestial-planet"><circle cx="82" cy="84" r="33" fill={`url(#${id}-core)`} /><path d="M59 65Q78 76 100 60M54 86Q80 100 110 80M70 107Q86 109 102 98" stroke={light} strokeWidth="2" opacity=".23" fill="none" /><circle cx="123" cy="39" r="11" fill={`url(#${id}-core)`} /><circle cx="119" cy="36" r="2.7" fill={shade} opacity=".3" /><circle cx="127" cy="42" r="1.8" fill={shade} opacity=".4" /></g>}
      {index === 5 && <g className="nebula-cloud"><path d="M13 108Q24 77 65 84Q46 43 85 35Q123 12 120 59Q157 61 130 91Q149 124 106 118Q79 148 68 118Q25 140 13 108Z" fill={`url(#${id}-cloud)`} filter={`url(#${id}-soft)`} /><path d="M22 115Q64 125 81 88T120 44M45 100Q77 109 101 72T137 74" stroke={light} opacity=".3" strokeWidth="1" fill="none" /><g fill={light}><circle cx="86" cy="79" r="2" /><circle cx="99" cy="58" r="1.1" /><circle cx="57" cy="106" r="1.4" /></g></g>}
      {index === 6 && <g className="star-heart"><path d="M88 24Q85 58 96 67L130 72Q104 80 95 93L91 128Q80 100 67 92L31 89Q61 78 68 65L72 35L80 62Z" fill={color} opacity=".65" /><path d="M82 53L88 75L109 79L89 86L83 108L77 88L54 82L76 76Z" fill={light} opacity=".5" /><circle cx="82" cy="81" r="6" fill={light} opacity=".75" /><circle cx="121" cy="57" r="2" fill={light} opacity=".7" /><circle cx="46" cy="112" r="1.3" fill={light} opacity=".5" /></g>}
      {complete && <g className="star-earned-glow"><circle cx="137" cy="23" r="3" fill="#FDDD46" /><circle cx="137" cy="23" r="7" fill="none" stroke="#FDDD46" strokeWidth=".7" opacity=".5" /></g>}
    </svg>
  </span>;
}
