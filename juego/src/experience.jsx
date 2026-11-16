import React, { useEffect, useRef, useState } from 'react';
import { notes } from './notes.js';
import { eraseJourney, readJourney, writeJourney } from './journey.js';
import portrait from './assets/sobreTania.svg';
import luffy from './assets/Luffy2.svg';
import { MissionEncounter, NavigationMap, MissionPocket, PocketStars, DestinationPreview } from './mission.jsx';
import { DESTINATIONS, updateDraft, saveReflection, tuneHomeSignal, isStationComplete, completedStations, connectStars, chooseFabric, saveFabric, collectDissipatedEnergy, OWN_VOICE_PROMPT, observeDarkMatter, collectDarkMatterFragment } from './mission.js';
import { StationVisit } from './station-visit.jsx';
import { routes, STATION_ROUTES, screenForHash, stationIndexForScreen } from './navigation.js';
import { FabricWorkshop } from './fabric-workshop.jsx';
import ultravioletReading from './assets/lectura-ultravioleta.pdf?url';
import { CollisionScene } from './collision-scene.jsx';
import { BrandName } from './brand-name.jsx';
import { GalacticEncounter } from './galactic-encounter.jsx';
import { DarkMatterEncounter } from './dark-matter-encounter.jsx';
import { MissionFarewell } from './mission-farewell.jsx';
import { WormholePassage } from './wormhole-passage.jsx';
import conclusion from './entries/conclusion.md?raw';
import cornejoRuferReading from './assets/lectura-cornejo-rufer-introduccion.pdf?url';
import ruferCoronaReading from './assets/lectura-rufer-corona-apertura.pdf?url';
import berkinReading from './assets/lectura-horizontalidad-berkin.pdf?url';
import brionesReading from './assets/lectura-horizontalidad-briones.pdf?url';

const horizontalReadings = {
  'Copia de Berkin_ Investigar_en_el_lado_oscuro_de_la_horiz.pdf': berkinReading,
  'Copia de Briones_ La_horizontalidad_como_horizonte_de_trab.pdf': brionesReading,
};

const fifthReadings = { 'cornejo-rufer-introduccion.pdf': cornejoRuferReading, 'rufer-corona-berkin-apertura.pdf': ruferCoronaReading };
const fifthReadingLabels = { 'cornejo-rufer-introduccion.pdf': 'Cornejo y Rufer', 'rufer-corona-berkin-apertura.pdf': 'Rufer y Corona Berkin' };

const stations = notes.slice(0, 7).map((note, index) => ({ ...note, ...DESTINATIONS[index], text: note.available ? note.text : 'Esta página de la bitácora todavía está en escritura. Puedes continuar el viaje y volver cuando esté lista.' }));
function currentRoute() { return screenForHash(window.location.hash); }
function getStorage() { try { return window.localStorage; } catch { return null; } }

function Arrow() { return <span aria-hidden="true">↗</span>; }

const cosmicNoise = seed => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};
const galaxyArms = [0, Math.PI].map(offset => Array.from({ length: 100 }, (_, index) => {
  const t = index / 99;
  const angle = t * Math.PI * 3 + offset;
  const radius = 8 + t * 164;
  return `${index ? 'L' : 'M'}${200 + Math.cos(angle) * radius},${200 + Math.sin(angle) * radius}`;
}).join(' '));

function SpiralGalaxy({ side }) {
  return <div className={`spiral-galaxy galaxy-${side}`}><svg className="galaxy-disc" viewBox="0 0 400 400">
    <defs>
      <radialGradient id={`galaxy-core-${side}`}><stop stopColor="#fff8de" /><stop offset=".12" stopColor="#FDDD46" stopOpacity=".8" /><stop offset=".38" stopColor="#FCA4BC" stopOpacity=".6" /><stop offset="1" stopColor="#FCA4BC" stopOpacity="0" /></radialGradient>
      <filter id={`galaxy-mist-${side}`} x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
    </defs>
    <g className="galaxy-spin">
      <g fill="none" stroke="#FCA4BC" strokeWidth="22" opacity=".24" filter={`url(#galaxy-mist-${side})`}>{galaxyArms.map((d,index) => <path key={index} d={d} />)}</g>
      <g fill="none" stroke="#d4dcf3" strokeWidth="3" opacity=".23" filter={`url(#galaxy-mist-${side})`}>{galaxyArms.map((d,index) => <path key={index} d={d} />)}</g>
      {Array.from({ length: 360 }, (_, index) => {
        const t = (index % 180) / 179;
        const angle = t * Math.PI * 3 + (index < 180 ? 0 : Math.PI);
        const spread = 4 + t * 14;
        const radius = 8 + t * 164 + (cosmicNoise(index + 1) - .5) * spread;
        return <circle key={index} cx={200 + Math.cos(angle) * radius + (cosmicNoise(index + 401) - .5) * spread} cy={200 + Math.sin(angle) * radius + (cosmicNoise(index + 701) - .5) * spread} r={.5 + cosmicNoise(index + 901) * 1.35} fill={index % 7 ? '#e8d7ed' : '#FDDD46'} opacity={.25 + cosmicNoise(index + 1101) * .65} />;
      })}
    </g>
    <circle cx="200" cy="200" r="65" fill={`url(#galaxy-core-${side})`} />
  </svg></div>;
}

function DeepSpace({ galaxies = true }) {
  return <>
    <div className="space-nebula" />
    <svg className="deep-stars" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">{Array.from({length: 170}, (_,index) => <circle key={index} cx={cosmicNoise(index + 12) * 1440} cy={cosmicNoise(index + 812) * 1000} r={.45 + cosmicNoise(index + 1612) * 1.05} opacity={.2 + cosmicNoise(index + 2412) * .65} />)}</svg>
    {galaxies && <><SpiralGalaxy side="left" /><SpiralGalaxy side="right" /></>}
  </>;
}

function MissionGalaxies() {
  return <div className="mission-cosmos" aria-hidden="true">
    <svg className="mission-stars" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">{Array.from({ length: 230 }, (_, i) => <circle key={i} cx={cosmicNoise(i + 25) * 1200} cy={cosmicNoise(i + 725) * 700} r={.4 + cosmicNoise(i + 1425)} fill={i % 9 ? '#d4dcf3' : '#FDDD46'} opacity={.2 + cosmicNoise(i + 2125) * .6} />)}</svg>
    <div className="tidal-stream" />
    <SpiralGalaxy side="mission-dwarf" /><SpiralGalaxy side="mission-giant" />
  </div>;
}

function Constellation({ side }) {
  const stars = side === 'left'
    ? [[42,72],[118,126],[75,211],[151,271],[109,352],[31,401],[70,491],[153,545],[114,641],[48,723],[157,755]]
    : [[149,57],[78,142],[128,218],[39,289],[92,368],[161,428],[118,517],[41,584],[76,661],[147,731],[31,773]];
  return <svg className="constellation-map" viewBox="0 0 200 800" preserveAspectRatio="xMidYMid slice">
    <g className="constellation-links">{stars.slice(1).map((star, index) => index === 4 || index === 8 ? null : <line key={index} x1={stars[index][0]} y1={stars[index][1]} x2={star[0]} y2={star[1]} />)}</g>
    {stars.map(([x, y], index) => <g key={index} className={`constellation-star ${index % 3 === 0 ? 'star-bright' : ''}`} style={{ animationDelay: `${index * -1.7}s` }}>
      {index % 3 === 0 && <circle className="star-halo" cx={x} cy={y} r="8" />}
      <circle cx={x} cy={y} r={index % 3 === 0 ? 2.8 : 1.5} />
      {index % 3 === 0 && <path d={`M${x - 6} ${y}h12M${x} ${y - 6}v12`} />}
    </g>)}
    <g className="distant-stars">{[[22,167],[175,101],[161,389],[23,565],[181,684],[98,35],[18,324],[179,612],[102,778]].map(([cx,cy],index) => <circle key={index} cx={cx} cy={cy} r=".85" />)}</g>
  </svg>;
}

function InlineText({ text }) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, index) => part.startsWith('**') && part.endsWith('**')
    ? <strong key={index}>{part.slice(2, -2)}</strong>
    : part.startsWith('*') && part.endsWith('*') ? <em key={index}>{part.slice(1, -1)}</em> : part);
}

function StoryText({ text, referenceHref, referenceHrefs = {}, referenceLabels = {} }) {
  let references = false;
  return <div className="story-text">{text.split(/\n\s*\n/).map((block, index) => {
    // Only expose reference links whose reading is included in the published build.
    if (/^\[Lectura de referencia\]\(/.test(block)) {
      const file = block.match(/^\[Lectura de referencia\]\(<([^>]+)>\)/)?.[1];
      const href = referenceHrefs[file] ?? referenceHref;
      const readingLabel = referenceLabels[file] ?? (file?.includes('Berkin') ? 'Corona Berkin' : file?.includes('Briones') ? 'Briones' : '');
      return href ? <p className="reference" key={index}><a href={href} target="_blank" rel="noopener noreferrer">Lectura de referencia{readingLabel && ` · ${readingLabel}`}</a></p> : null;
    }
    if (block.startsWith('> ')) {
      const lines = block.split('\n').map(line => line.replace(/^> ?/, ''));
      const source = lines.at(-1)?.startsWith('— ') ? lines.pop() : null;
      return <blockquote className="story-quotation" key={index}><p><InlineText text={lines.join('\n').trim()} /></p>{source && <cite>{source}</cite>}</blockquote>;
    }
    if (/^(García-Santesmases,|Falconí Abad,|Osorio-Cabrera,|Smith,|Gregorio Gil,|Corona Berkin,|Briones,|\*\*Referencias?\*\*|\*\*Lectura de referencia\*\*)/.test(block)) references = true;
    return <p key={index} className={references ? 'reference' : ''}><InlineText text={block} /></p>;
  })}</div>;
}

function Dialog({ title, eyebrow, onClose, children, wide = false, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    dialog.querySelector('input')?.focus();
    document.body.style.overflow = 'hidden';
    return () => { if (dialog.open) dialog.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={ref} className={`modal ${wide ? 'reading-modal' : ''} ${className}`} aria-labelledby="dialog-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="modal-inner"><button className="close-button" onClick={onClose} aria-label="Cerrar ventana">×</button><span className="eyebrow">{eyebrow}</span><h2 id="dialog-title">{title}</h2>{children}</div>
  </dialog>;
}

function AuthorPortrait() {
  return <figure className="portrait-leaf"><img src={portrait} alt="Composición de fotografías de Tania Prieto, autora de NEBULA-F23" /></figure>;
}

const windowStars = Array.from({ length: 700 }, (_, index) => ({
  x: cosmicNoise(index + 3100) * 560,
  y: cosmicNoise(index + 4100) * 650,
  r: .25 + cosmicNoise(index + 5100) ** 3 * 1.05,
  opacity: .2 + cosmicNoise(index + 6100) * .65,
}));
const nebulaDust = Array.from({ length: 480 }, (_, index) => {
  const t = cosmicNoise(index + 7100);
  return {
    x: -50 + t * 660,
    y: 340 + Math.sin(t * 6.2) * 70 - (t - .5) * 66 + (cosmicNoise(index + 8100) + cosmicNoise(index + 9100) - 1) * (35 + Math.sin(t * Math.PI) * 90),
    r: .25 + cosmicNoise(index + 10100) * 1.1,
    opacity: .18 + cosmicNoise(index + 11100) * .7,
  };
});
const brightWindowStars = [[69,98,2],[197,63,1.5],[329,111,2],[479,180,1.5],[489,312,2],[72,373,1.5],[129,523,2],[449,583,1.5],[269,198,1.5],[205,585,1.5],[383,461,2],[61,238,1.5],[478,498,2],[348,298,1.5]];

function SpaceWindow({ motion }) {
  return <figure className={`space-window ${motion ? '' : 'is-paused'}`}>
    <div className="cabin-shell">
      <div className="cabin-plaque" aria-hidden="true"><span>CABINA · <BrandName /></span><span className="cabin-light" /></div>
      <div className="window-housing">
        <div className="hull-fittings" aria-hidden="true">
          {[[24,7],[76,7],[5,34],[95,34],[5,68],[95,68],[27,94],[73,94]].map(([left,top],index) => <span key={index} className="hull-fastener" style={{left: `${left}%`, top: `${top}%`}} />)}
          <span className="window-latch latch-left" /><span className="window-latch latch-right" />
        </div>
    <div className="porthole">
      <svg viewBox="0 0 560 650" role="img" aria-labelledby="space-window-title">
        <title id="space-window-title">Nubes de nebulosas violetas y rosadas entre un campo denso de estrellas, vistas desde la ventanilla de la nave.</title>
        <defs>
          <radialGradient id="window-space"><stop stopColor="#24213f" /><stop offset=".6" stopColor="#121224" /><stop offset="1" stopColor="#080b15" /></radialGradient>
          <radialGradient id="nebula-violet"><stop stopColor="#a293ec" stopOpacity=".66" /><stop offset=".42" stopColor="#7864b8" stopOpacity=".44" /><stop offset="1" stopColor="#554575" stopOpacity="0" /></radialGradient>
          <radialGradient id="nebula-rose"><stop stopColor="#fff0e8" stopOpacity=".85" /><stop offset=".18" stopColor="#fca4bc" stopOpacity=".75" /><stop offset=".5" stopColor="#b7528a" stopOpacity=".45" /><stop offset="1" stopColor="#7a376d" stopOpacity="0" /></radialGradient>
          <radialGradient id="nebula-blue"><stop stopColor="#b8c3ff" stopOpacity=".7" /><stop offset=".3" stopColor="#8d87d2" stopOpacity=".4" /><stop offset="1" stopColor="#514f9a" stopOpacity="0" /></radialGradient>
          <linearGradient id="nebula-thread" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#d9a0cf" stopOpacity="0" /><stop offset=".45" stopColor="#fca4bc" stopOpacity=".65" /><stop offset=".7" stopColor="#d4dcf3" stopOpacity=".6" /><stop offset="1" stopColor="#9e92d6" stopOpacity="0" /></linearGradient>
          <radialGradient id="window-starlight"><stop stopColor="#fff8e8" stopOpacity=".8" /><stop offset=".2" stopColor="#e1d5fb" stopOpacity=".3" /><stop offset="1" stopColor="#b3a2e3" stopOpacity="0" /></radialGradient>
          <filter id="nebula-texture" x="-30%" y="-50%" width="160%" height="200%" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".013" numOctaves="3" seed="23" result="cloud-grain" /><feDisplacementMap in="SourceGraphic" in2="cloud-grain" scale="65" xChannelSelector="R" yChannelSelector="G" /><feGaussianBlur stdDeviation="9" /></filter>
        </defs>
        <rect width="560" height="650" fill="url(#window-space)" />
        <g className="window-distant-stars">{windowStars.map((star,index) => <circle key={index} cx={star.x} cy={star.y} r={star.r} fill={index % 9 ? '#e5dfef' : '#f5d9c3'} opacity={star.opacity} />)}</g>
        <g className="nebula-clouds">
          <g filter="url(#nebula-texture)">
            <ellipse cx="91" cy="300" rx="210" ry="125" fill="url(#nebula-violet)" transform="rotate(22 91 300)" />
            <ellipse cx="221" cy="348" rx="206" ry="99" fill="url(#nebula-violet)" transform="rotate(-12 221 348)" />
            <ellipse cx="383" cy="317" rx="206" ry="94" fill="url(#nebula-blue)" transform="rotate(-26 383 317)" />
            <ellipse cx="481" cy="280" rx="159" ry="135" fill="url(#nebula-violet)" transform="rotate(-29 481 280)" />
            <ellipse cx="294" cy="349" rx="105" ry="51" fill="url(#nebula-rose)" transform="rotate(-13 294 349)" />
            <ellipse cx="147" cy="365" rx="135" ry="52" fill="url(#nebula-rose)" transform="rotate(14 147 365)" opacity=".6" />
          </g>
          <g fill="none" stroke="url(#nebula-thread)" strokeLinecap="round">
            <path d="M-40 293C97 264 121 423 283 354S450 263 606 283" strokeWidth="2" opacity=".45" />
            <path d="M-30 349C116 300 163 420 294 358S456 321 594 221" strokeWidth="1" opacity=".5" />
            <path d="M58 359C135 329 197 398 282 369S385 321 472 326" strokeWidth="6" opacity=".18" />
          </g>
          <g>{nebulaDust.map((star,index) => <circle key={index} cx={star.x} cy={star.y} r={star.r} fill={index % 5 ? '#eee6fa' : '#fca4bc'} opacity={star.opacity} />)}</g>
        </g>
        <g className="window-near-stars">{brightWindowStars.map(([cx,cy,r],index) => <g key={index} className="window-twinkle" style={{animationDelay: `${index * -1.9}s`, animationDuration: `${8 + index % 5}s`}}><circle cx={cx} cy={cy} r={r * 6} fill="url(#window-starlight)" /><circle cx={cx} cy={cy} r={r * .65} fill="#fff4e3" /><path d={`M${cx - r * 2} ${cy}h${r * 4}M${cx} ${cy - r * 2}v${r * 4}`} stroke="#e8ddff" strokeWidth=".65" /></g>)}</g>
      </svg>
      <div className="window-reflection" aria-hidden="true" />
    </div>
      </div>
      <div className="cabin-sill" aria-hidden="true">
        <div className="cabin-vents"><span /><span /><span /><span /><span /></div>
        <span className="cabin-view-label">VISTA AL EXTERIOR</span>
        <div className="cabin-indicators"><span /><span /><span /></div>
      </div>
    </div>
  </figure>;
}

function Introduction({ onStart, motion }) {
  return <section className="departure" aria-labelledby="introduction-title">
    <div className="transmission-heading"><span className="transmission-signal" aria-hidden="true" /><span>A BORDO · PRIMERA TRANSMISIÓN</span></div>
    <div className="departure-layout">
      <article className="transmission-page">
        <header><span className="eyebrow">INTRODUCCIÓN</span><h1 id="introduction-title"><BrandName /></h1></header>
        <div className="transmission-text">
          <blockquote className="transmission-call">«Estación siete a estación uno. ¿Todavía me escuchas?»</blockquote>
          <p>Astronauta, te doy la bienvenida a <BrandName />, mi bitácora del Seminario de Metodología de Investigación con Perspectiva Feminista y de Género II. Para nombrarla, me inspiré en los códigos con los que se identifican las nebulosas. La F es de feminista, el lugar desde donde escribo. El 23 es un número que me ha acompañado toda la vida.</p>
          <p>La voz que acabas de escuchar viene de una galaxia enana que se acerca a otra mucho mayor. Una galaxia enana puede pasar mucho tiempo orbitando a su vecina. Si pasa muy cerca, puede caer en el pozo gravitacional de la mayor, y esta puede empezar a arrancarle estrellas. Eso le ocurre a la galaxia enana de Sagitario mientras orbita nuestra Vía Láctea. <a href="https://science.nasa.gov/image-detail/panta-rhei-motion-in-the-milky-way/" target="_blank" rel="noopener noreferrer">Puedes ver un ejemplo de ese encuentro en esta imagen de la NASA y la ESA</a>. En este juego, tu misión es recorrer siete estaciones y reunir energía y materiales de navegación que ayuden a la galaxia enana a cambiar de rumbo antes de que la mayor termine por absorberla.</p>
          <p>¿Por qué queremos salvarla? En esta historia, la galaxia mayor representa a la academia tradicional. En su fuerza de atracción puedes reconocer cómo opera la academia cuando investiga con métodos extractivos. Quien investiga llega a un territorio, recoge saberes y experiencias y se los lleva para interpretarlos. La conversación se queda solo en aulas, artículos y congresos.</p>
          <p>En la galaxia enana viven distintas maneras de investigar desde los feminismos. Es pequeña y tiene una fuerza que conozco de cerca. Esas maneras de investigar me invitan a preguntarme quién soy yo, desde dónde hago mis preguntas y qué cambia cuando otras personas pueden hacer las suyas. Los afectos y el cuidado tienen que ver con decisiones muy concretas. Me pregunto qué confianza hay para contar algo que duele y con quién puedo compartir lo que escuché. Salvar esta galaxia significa cuidar esos vínculos para que quienes investigan puedan seguir haciendo preguntas propias.</p>
          <p>En cada estación te espera una página de mi bitácora. Allí se cruzan las lecturas del seminario con mi experiencia como mujer en física, que es la tesis de mi trabajo final de la especialización. Los materiales que recogerás serán herramientas que tomarán la forma de palabras o escritos que nazcan de tu lectura. Tu reflexión le dará brillo a una estrella. Guárdala en tu bolsillo espacial feminista y sigue el viaje.</p>
          <p>Al llegar a la última estación, abre el bolsillo. Podrás volver a leer tus reflexiones y enlazar las estrellas según las conexiones que encuentres entre ellas. La energía de esa red formará una barrera protectora que permitirá a la galaxia enana rodear a su vecina y continuar su camino. Al mirar la red completa, podrás reconocer tu propio recorrido por la bitácora y lo que aprendiste sobre la investigación feminista.</p>
        </div>
      </article>
      <SpaceWindow motion={motion} />
    </div>
    <MissionEncounter scenery={<CollisionScene motion={motion} />} onAccept={onStart} motion={motion} />
  </section>;
}

function AuthorPresentation({ onIntroduction }) {
  return <section className="notebook page-about" aria-label="Cuaderno de Tania">
      <AuthorPortrait />
      <div className="book-leaf"><span className="eyebrow">MI PRESENTACIÓN</span><h1>Desde dónde<br /><em>escribo.</em></h1>
        <p>Quiero compartirles quién soy y desde dónde escribo. Soy Tania Prieto, mujer y feminista en las ciencias exactas y naturales. Soy física y me dedico a la investigación científica con herramientas computacionales y modelos de sistemas complejos. Me interesa usar la mecánica estadística para estudiar los sistemas sociales y, desde esa práctica, transgredir los límites de los espacios donde la ciencia y los métodos cuantitativos siguen al servicio de una hegemonía androcéntrica. Más adelante volveré sobre lo que quiero decir con esto.</p>
        <p>He construido todo este trayecto académico y político con la compañía de Luffy, mi perrito, al que amo muchísimo. Milita a mi lado en las causas que me mueven y, dondequiera que estemos, siempre acaba robándose las miradas.</p>
        <p>Soy una mujer artística y me gusta llevar el arte conmigo. Busco llevar lo que estudio a escena y darle a mis presentaciones un carácter performático. Y siempre quiero decir que amo la comida, comer es de las cosas mas increibles que hay en la vida.</p>
        <p className="author-invitation">Bueno, ahora te quiero invitar a una misión intergaláctica.</p>
        <div className="about-ending"><div className="about-actions"><button className="cover-open page-turn" onClick={onIntroduction}>Abrir Bitácora <Arrow /></button><span className="page-number">01 · Mi presentación</span></div><figure className="author-companion"><img src={luffy} alt="Luffy, un perro de pelaje blanco y dorado con un pañuelo" width="868" height="1156" /><figcaption>guau guau</figcaption></figure></div></div>

  </section>;
}

export function Experience() {
  const [storage] = useState(getStorage);
  const [saved] = useState(() => readJourney(storage));
  const [alias, setAlias] = useState(saved.alias);
  const [aliasDraft, setAliasDraft] = useState(saved.alias);
  const [legacy, setLegacy] = useState({ game: saved.game, words: saved.words });
  const [mission, setMission] = useState(saved.mission);
  const [route, setRoute] = useState(currentRoute);
  const [modal, setModal] = useState(null);
  const [approaching, setApproaching] = useState(false);
  const [destinationIndex, setDestinationIndex] = useState(0);
  const [coverMotion, setCoverMotion] = useState(true);
  const [storageAvailable, setStorageAvailable] = useState(Boolean(storage));
  const mainRef = useRef(null);
  const screen = ['game', 'recap', 'farewell', 'wormhole', ...STATION_ROUTES].includes(route) && !alias ? 'alias' : route;
  const visitIndex = stationIndexForScreen(screen);
  const isCover = screen === 'home';
  const hasSpace = isCover || ['about', 'introduction', 'mission', 'alias', 'game', 'recap', 'farewell', 'wormhole', ...STATION_ROUTES].includes(screen);

  function navigate(next, { replace = false } = {}) {
    setModal(null);
    setApproaching(false);
    const slug = Object.keys(routes).find(key => routes[key] === next) ?? 'inicio';
    if (replace) window.history.replaceState(null, '', `#/${slug}`);
    else window.location.hash = `/${slug}`;
    setRoute(next);
  }

  useEffect(() => {
    const onHash = () => { setModal(null); setApproaching(false); setRoute(currentRoute()); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [screen]);

  useEffect(() => {
    if (alias) setStorageAvailable(writeJourney(storage, { alias, ...legacy, mission }));
  }, [alias, legacy, mission, storage]);

  useEffect(() => {
    if (!approaching) return;
    const duration = !coverMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650;
    const timeout = window.setTimeout(() => { setApproaching(false); setModal({ kind: 'destination', index: destinationIndex }); }, duration);
    return () => window.clearTimeout(timeout);
  }, [approaching, coverMotion, destinationIndex]);

  function openNote(index) {
    if (!stations[index] || approaching) return;
    setMission(previous => ({ ...previous, visited: [...new Set([...previous.visited, index])] }));
    navigate(STATION_ROUTES[index]);
  }

  function selectDestination(index) {
    if (!stations[index] || approaching) return;
    setDestinationIndex(index);
    if (screen === 'game') setApproaching(true);
    else setModal({ kind: 'destination', index });
  }

  function openPocket() {
    setModal(previous => ({ kind: 'visitPocket', returnTo: previous?.kind === 'destination' ? previous : null }));
  }

  function closePocket() {
    setModal(previous => previous?.returnTo ?? null);
  }

  function begin(event) {
    event.preventDefault();
    const input = event.currentTarget.elements.alias;
    const nextAlias = aliasDraft.trim();
    if (!nextAlias) { input.setCustomValidity('Elige un alias para acompañar tu recorrido.'); input.reportValidity(); return; }
    setAlias(nextAlias.slice(0, 40)); navigate('game');
  }

  function resetJourney() {
    const erased = eraseJourney(storage);
    setAlias(''); setAliasDraft(''); setLegacy({ game: readJourney(null).game, words: {} }); setMission(readJourney(null).mission);
    setStorageAvailable(erased && Boolean(storage)); navigate('alias');
  }

  return <>
    <a className="skip-link" href="#main-content">Saltar al contenido</a>

    <main id="main-content" className={isCover ? 'cover-main' : screen === 'about' ? 'presentation-main' : screen === 'introduction' ? 'departure-main' : ['game', 'mission', 'alias', 'recap', 'farewell', 'wormhole', ...STATION_ROUTES].includes(screen) ? 'mission-main' : undefined} ref={mainRef} tabIndex={-1}>
      {hasSpace && <div className={`cover-atmosphere ${coverMotion ? '' : 'is-paused'}`} aria-hidden="true">
        <DeepSpace galaxies={!['game', 'alias', 'mission', ...STATION_ROUTES].includes(screen)} />
        {['left', 'right'].map(side => <div key={side} className={`cover-side cover-side-${side}`}>
          <Constellation side={side} />
          <span className="lateral-spark spark-one">✦</span><span className="lateral-spark spark-two">✧</span><span className="lateral-spark spark-three">✦</span>
        </div>)}
      </div>}
      {isCover && <section className="welcome" aria-labelledby="cover-title">
        <div className="cover-orbit" aria-hidden="true" />
        <div className="welcome-copy">
          <h1 className="welcome-title" id="cover-title"><span className="cover-greeting">Bienvenide a</span><BrandName /></h1>
          <p className="cover-author">Bitácora por:<button type="button" className={`cover-author-button ${coverMotion ? '' : 'is-paused'}`} onClick={() => navigate('about')} aria-label="Saber más sobre Tania Prieto"><span>Tania Prieto</span></button></p>
          <div className="cover-rule" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 1C13.5 8.5 15.5 10.5 23 12C15.5 13.5 13.5 15.5 12 23C10.5 15.5 8.5 13.5 1 12C8.5 10.5 10.5 8.5 12 1Z" /></svg></div>
          <p className="welcome-description">Un recorrido construido a partir de reflexiones y escrituras automáticas en el marco del <strong>Seminario de Metodología de Investigación con Perspectiva Feminista y de Género II</strong> de la Especialización en Estudios Feministas y de Género de la Universidad Nacional de Colombia.</p>
          <p className="course-credits">Seminario dirigido por Mara Viveros,<br />con el acompañamiento tutorial de Paula Giraldo.</p>
        </div>
      </section>}
      {hasSpace && <button className="cover-motion-toggle" onClick={() => setCoverMotion(value => !value)} aria-label={coverMotion ? 'Pausar animaciones del fondo' : 'Activar animaciones del fondo'} title={coverMotion ? 'Pausar movimiento' : 'Activar movimiento'}><span aria-hidden="true">{coverMotion ? 'Ⅱ' : '▷'}</span></button>}

      {screen === 'about' && <AuthorPresentation onIntroduction={() => navigate('introduction')} />}
      {screen === 'introduction' && <Introduction onStart={() => setModal({ kind: 'alias' })} motion={coverMotion} />}

      {['mission', 'alias'].includes(screen) && <MissionEncounter scenery={<CollisionScene motion={coverMotion} />} onAccept={() => setModal({ kind: 'alias' })} motion={coverMotion} />}
      {screen === 'game' && <NavigationMap approaching={approaching} destinationIndex={destinationIndex} alias={alias} stations={stations} mission={mission} onOpen={selectDestination} onPocket={openPocket} onExit={() => navigate('farewell')} scenery={<MissionGalaxies />} motion={coverMotion} />}
      {visitIndex !== null && <StationVisit
        key={visitIndex}
        note={stations[visitIndex]}
        prompt={visitIndex === 5 ? OWN_VOICE_PROMPT : undefined}
        heading={visitIndex === 0 ? <>Sintoniza <em>Ultravioleta</em></> : visitIndex === 1 ? <>Sigue la señal <em>de casa</em></> : visitIndex === 2 ? <>Aterriza en <em>lo cotidiano</em></> : visitIndex === 3 ? <>Deja que otra voz <em>cambie el rumbo</em></> : visitIndex === 4 ? <>Comparte <em>el timón</em></> : visitIndex === 5 ? <>Transmite con <em>tu propia voz</em></> : <>Busca a las que faltan <em>en mi radar</em></>}
        readingUnlocked={visitIndex !== 3 || mission.dissipatedEnergy}
        allowReflection={visitIndex !== 3 && visitIndex !== 4}
        beforeReading={visitIndex === 3 ? onRead => <GalacticEncounter
          collected={mission.dissipatedEnergy}
          onCollect={() => setMission(previous => collectDissipatedEnergy(previous))}
          onRead={onRead}
          motion={coverMotion}
        /> : visitIndex === 4 ? onRead => <DarkMatterEncounter
          observed={mission.darkMatterObserved}
          fragments={mission.darkMatterFragments}
          onObserve={() => setMission(previous => observeDarkMatter(previous))}
          onCollect={index => setMission(previous => collectDarkMatterFragment(previous, index))}
          onRead={onRead}
          readings={{ introduction: cornejoRuferReading, opening: ruferCoronaReading }}
          motion={coverMotion}
        /> : undefined}
        activity={visitIndex === 2 ? <FabricWorkshop
          selected={mission.fabricDraft}
          saved={mission.fabricPatch}
          onChoose={index => setMission(previous => chooseFabric(previous, index))}
          onSave={() => setMission(previous => saveFabric(previous))}
          motion={coverMotion}
        /> : undefined}
        draft={mission.drafts[visitIndex] ?? mission.reflections[visitIndex] ?? ''}
        selected={mission.reflections[visitIndex]}
        onDraft={text => setMission(previous => updateDraft(previous, visitIndex, text))}
        onSave={text => setMission(previous => saveReflection(previous, visitIndex, text))}
        onPocket={openPocket}
        onMap={() => navigate('game')}
        stars={completedStations(mission).length}
        signals={visitIndex === 1 ? mission.homeSignals : []}
        onTune={index => setMission(previous => tuneHomeSignal(previous, index))}
        complete={isStationComplete(mission, visitIndex)}
        motion={coverMotion}
      >
        {visitIndex === 3 && <h2 className="station-reading-title">Que el asombro encuentre otras formas</h2>}
        <StoryText
          text={stations[visitIndex].text}
          referenceHref={visitIndex === 0 ? ultravioletReading : undefined}
          referenceHrefs={visitIndex === 3 ? horizontalReadings : visitIndex === 4 ? fifthReadings : undefined}
          referenceLabels={visitIndex === 4 ? fifthReadingLabels : undefined}
        />
      </StationVisit>}

      {screen === 'farewell' && <MissionFarewell
        onMap={() => navigate('game')}
        onPocket={openPocket}
      ><StoryText text={conclusion} /></MissionFarewell>}

      {screen === 'wormhole' && <WormholePassage motion={coverMotion} onArrive={() => navigate('recap', { replace: true })} />}

      {screen === 'recap' && <MissionPocket alias={alias} stations={stations} mission={mission} legacyWords={legacy.words} onOpen={selectDestination} onMap={() => navigate('game')} onHome={() => navigate('home')} onFarewell={() => navigate('farewell')} onReset={() => setModal({ kind: 'reset' })} onConnect={(a, b) => setMission(previous => connectStars(previous, a, b))} />}

      {!isCover && !storageAvailable && alias && <p className="storage-notice" role="status">Este navegador no permite guardar el recorrido. Tu bolsillo seguirá disponible mientras mantengas esta página abierta.</p>}
    </main>

    <footer><button type="button" className="footer-home" onClick={() => navigate('home')} aria-label="Volver a la portada de NEBULA-F23"><BrandName /></button><span>Seminario de Metodología de Investigación con Perspectiva Feminista y de Género II · Una bitácora en construcción</span></footer>

    {modal?.kind === 'alias' && <Dialog title="Astronauta, ¿cuál es tu alias?" eyebrow="ANTES DE EMPEZAR" className="astronaut-alias" onClose={() => setModal(null)}><form className="alias-screen" onSubmit={begin}><label htmlFor="player-alias">Tu alias de astronauta</label><input autoFocus id="player-alias" name="alias" value={aliasDraft} onChange={event => { event.target.setCustomValidity(''); setAliasDraft(event.target.value); }} maxLength={40} autoComplete="off" required placeholder="Puede ser un nombre inventado" /><p className="quiet-note">Tu alias y tus reflexiones se quedan en este navegador. No se envían, ni se guardan en ningún lado.</p><button className="primary" type="submit">Entrar al mapa</button></form></Dialog>}
    {modal?.kind === 'destination' && <Dialog title={stations[modal.index].title} eyebrow={`DESTINO · ESTACIÓN ${modal.index + 1} DE 9`} className="destination-modal" onClose={() => setModal(null)}><DestinationPreview note={stations[modal.index]} complete={isStationComplete(mission, modal.index)} onLand={() => openNote(modal.index)} onPocket={openPocket} onReturn={() => setModal(null)} /></Dialog>}
    {modal?.kind === 'visitPocket' && <Dialog title="Mi bolsillo" eyebrow="TU BOLSILLO ESPACIAL FEMINISTA" className="visit-pocket-modal" onClose={closePocket}><PocketStars stations={stations} mission={mission} /><p className="quiet-note">Cada estación reúne aquí lo que has recogido y las palabras que has guardado.</p><button type="button" className="primary" onClick={closePocket}>{screen === 'farewell' ? 'Volver a la despedida' : visitIndex === 3 || visitIndex === 4 ? 'Volver a la estación' : visitIndex !== null ? 'Volver a la lectura' : modal.returnTo ? 'Volver a mi destino' : 'Volver al mapa'}</button><button type="button" className="text-button" onClick={() => navigate('recap')}>Abrir la red de mis estrellas</button></Dialog>}
    {modal?.kind === 'reset' && <Dialog title="Vaciar mi bolsillo" eyebrow="TU RECORRIDO PERSONAL" onClose={() => setModal(null)}><p>Se borrarán de este navegador tu alias, tus reflexiones, tus palabras y las estaciones visitadas. Podrás empezar otra vez.</p><div className="reset-actions"><button className="primary" onClick={resetJourney}>Borrar mi recorrido</button><button className="text-button" onClick={() => setModal(null)}>Conservarlo</button></div></Dialog>}
  </>;
}
