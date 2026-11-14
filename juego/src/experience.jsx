import React, { useEffect, useReducer, useRef, useState } from 'react';
import { gameReducer } from './game.js';
import { notes } from './notes.js';
import { eraseJourney, readJourney, wordChoices, writeJourney } from './journey.js';
import portrait from './assets/sobreTania.svg';
import luffy from './assets/Luffy2.svg';

const routes = { inicio: 'home', 'sobre-mi': 'about', introduccion: 'introduction', bolsillo: 'notice', alias: 'alias', jugar: 'game', cierre: 'recap' };
function currentRoute() { return routes[window.location.hash.replace(/^#\/?/, '')] ?? 'home'; }
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

function DeepSpace() {
  return <>
    <div className="space-nebula" />
    <svg className="deep-stars" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">{Array.from({length: 170}, (_,index) => <circle key={index} cx={cosmicNoise(index + 12) * 1440} cy={cosmicNoise(index + 812) * 1000} r={.45 + cosmicNoise(index + 1612) * 1.05} opacity={.2 + cosmicNoise(index + 2412) * .65} />)}</svg>
    <SpiralGalaxy side="left" /><SpiralGalaxy side="right" />
  </>;
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

function StoryText({ text }) {
  let references = false;
  return <div className="story-text">{text.split(/\n\s*\n/).map((block, index) => {
    // The source files retain their local PDF links. Do not publish broken local links.
    if (/^\[Lectura de referencia\]\(/.test(block)) return null;
    if (/^(García-Santesmases,|Falconí Abad,|Osorio-Cabrera,|Smith,|Gregorio Gil,|Corona Berkin,|Briones,|\*\*Referencia\*\*)/.test(block)) references = true;
    return <p key={index} className={references ? 'reference' : ''}><InlineText text={block} /></p>;
  })}</div>;
}

function Dialog({ title, eyebrow, onClose, children, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { if (dialog.open) dialog.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={ref} className={`modal ${wide ? 'reading-modal' : ''}`} aria-labelledby="dialog-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="modal-inner"><button className="close-button" onClick={onClose} aria-label="Cerrar ventana">×</button><span className="eyebrow">{eyebrow}</span><h2 id="dialog-title">{title}</h2>{children}</div>
  </dialog>;
}

function WordNotes({ words, large = false }) {
  return <div className={`word-notes ${large ? 'large-notes' : ''}`}>{Object.entries(words).map(([index, word]) => <div className="word-note" key={index}><span>{word}</span><small>Pliegue {Number(index) + 1}</small></div>)}</div>;
}

function ReadEntry({ note, selected, onSave, onReturn }) {
  const [choices] = useState(() => wordChoices(selected));
  return <>
    <StoryText text={note.text} />
    {note.available && <section className="word-invitation" aria-label="Llevar una palabra del relato"><span className="eyebrow">UN PEQUEÑO RECUERDO</span><h3>Me llevo una palabra</h3><p>Elige una para tu bolsillo, si te apetece.</p><div className="word-choices">{choices.map(word => <button type="button" key={word} aria-pressed={word === selected} onClick={() => onSave(word)}>{word}{word === selected && <span aria-hidden="true"> ✓</span>}</button>)}</div><p className="word-saved" role="status">{selected ? `«${selected}» va contigo.` : ''}</p></section>}
    <button className="primary" onClick={onReturn}>Volver al papel <Arrow /></button>
  </>;
}

function AuthorPortrait() {
  return <figure className="portrait-leaf"><img src={portrait} alt="Composición de fotografías de Tania Prieto, autora de NEBULA-F23" /></figure>;
}

function Notebook({ page, onAbout, onIntroduction, onExplore, Flower }) {
  return <section className={`notebook page-${page}`} key={page} aria-label="Cuaderno de Tania">
    {page === 'about' ? <>
      <AuthorPortrait />
      <div className="book-leaf"><span className="eyebrow">MI PRESENTACIÓN</span><h1>Desde dónde<br /><em>escribo.</em></h1><p>Soy Tania, una mujer que transita entre las ciencias naturales y exactas, las ciencias de datos y la tecnología.</p><p>Soy feminista y amante de las artes. Esos encuentros también forman parte del lugar desde el que aprendo y escribo.</p><p>En estas páginas comparto reflexiones que han acompañado mi recorrido por las metodologías feministas.</p><button className="cover-open page-turn" onClick={onIntroduction}>Abrir Bitácora <Arrow /></button><span className="page-number">01 · Mi presentación</span><figure className="author-companion"><img src={luffy} alt="Luffy, un perro de pelaje blanco y dorado con un pañuelo" width="868" height="1156" /><figcaption>guau guau</figcaption></figure></div>
    </> : <>
      <div className="book-leaf"><span className="eyebrow">INTRODUCCIÓN</span><h1>De dónde nace<br />esta <em>bitácora.</em></h1><p>Esta bitácora reúne reflexiones y escrituras automáticas construidas en el marco del Seminario de Metodología de Investigación con Perspectiva Feminista y de Género II de la Especialización en Estudios Feministas y de Género de la Universidad Nacional de Colombia, dirigido por Mara Viveros y con el acompañamiento tutorial de Paula Giraldo.</p><p>En sus pliegues comparto aprendizajes que toman forma entre las lecturas del curso y mis experiencias.</p><button className="text-button" onClick={onAbout}>← Volver a mi presentación</button><span className="page-number">02 · Introducción</span></div>
      <div className="book-leaf introduction-leaf"><Flower className="book-flower" /><span className="eyebrow">LEER, ENCONTRARNOS, JUGAR</span><h2>Un papel que<br />se abre contigo.</h2><p>Te invito a acercarte a estos escritos a través de NEBULA-F23: encontrar un relato y detenerte en aquello que te acompañe.</p><p>Mientras juegas, podrás reunir palabras en tu bolsillo feminista y volver a encontrarlas al cerrar el recorrido.</p><button className="primary page-turn" onClick={onExplore}>Explora jugando NEBULA-F23 <Arrow /></button><span className="page-number">03 · La invitación</span></div>
    </>}
  </section>;
}

export function Experience({ Paper, Die, Flower }) {
  const [storage] = useState(getStorage);
  const [saved] = useState(() => readJourney(storage));
  const [alias, setAlias] = useState(saved.alias);
  const [aliasDraft, setAliasDraft] = useState(saved.alias);
  const [state, dispatch] = useReducer(gameReducer, saved.game);
  const [words, setWords] = useState(saved.words);
  const [route, setRoute] = useState(currentRoute);
  const [modal, setModal] = useState(null);
  const [coverMotion, setCoverMotion] = useState(true);
  const [visualDie, setVisualDie] = useState(saved.game.die ?? 1);
  const [storageAvailable, setStorageAvailable] = useState(Boolean(storage));
  const mainRef = useRef(null);
  const busy = ['rolling', 'moving'].includes(state.phase);
  const screen = ['game', 'recap'].includes(route) && !alias ? 'alias' : route;
  const isCover = screen === 'home';
  const hasSpace = isCover || screen === 'about';
  const openedStories = state.discovered.filter(index => notes[index].available);
  const collectedCount = Object.keys(words).length;

  function navigate(next) {
    setModal(null);
    const slug = Object.keys(routes).find(key => routes[key] === next) ?? 'inicio';
    window.location.hash = `/${slug}`;
    setRoute(next);
  }

  useEffect(() => {
    const onHash = () => { setModal(null); setRoute(currentRoute()); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [screen]);

  useEffect(() => {
    if (alias && !busy) setStorageAvailable(writeJourney(storage, { alias, game: state, words }));
  }, [alias, busy, state, words, storage]);

  useEffect(() => {
    if (state.phase !== 'rolling') return;
    const interval = setInterval(() => setVisualDie(Math.floor(Math.random() * 6) + 1), 85);
    const timeout = setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1;
      setVisualDie(value); dispatch({ type: 'land', value });
    }, 800);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== 'moving') return;
    const timeout = setTimeout(() => dispatch({ type: 'step' }), 280);
    return () => clearTimeout(timeout);
  }, [state.phase, state.remaining]);

  function openNote(index = state.position) {
    if (index === state.position && state.phase === 'ready') dispatch({ type: 'read' });
    else if (!state.discovered.includes(index)) return;
    if (index >= 0 && index < notes.length) setModal({ kind: 'note', index });
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
    setAlias(''); setAliasDraft(''); setWords({}); dispatch({ type: 'reset' }); setVisualDie(1);
    setStorageAvailable(erased && Boolean(storage)); navigate('alias');
  }

  const status = state.phase === 'idle' ? 'Tu primer encuentro está a una tirada.'
    : state.phase === 'rolling' ? 'Un poquito de azar…'
    : state.phase === 'moving' ? `Salió ${state.die}. El papel sigue los pliegues…`
    : `Salió ${state.die}. Puedes abrir el pliegue ${state.position + 1}.`;

  return <>
    <a className="skip-link" href="#main-content">Saltar al contenido</a>

    <main id="main-content" className={isCover ? 'cover-main' : screen === 'about' ? 'presentation-main' : undefined} ref={mainRef} tabIndex={-1}>
      {hasSpace && <div className={`cover-atmosphere ${coverMotion ? '' : 'is-paused'}`} aria-hidden="true">
        <DeepSpace />
        {['left', 'right'].map(side => <div key={side} className={`cover-side cover-side-${side}`}>
          <Constellation side={side} />
          <span className="lateral-spark spark-one">✦</span><span className="lateral-spark spark-two">✧</span><span className="lateral-spark spark-three">✦</span>
        </div>)}
      </div>}
      {isCover && <section className="welcome" aria-labelledby="cover-title">
        <div className="cover-orbit" aria-hidden="true" />
        <div className="welcome-copy">
          <h1 className="welcome-title" id="cover-title"><span className="cover-greeting">Bienvenide a</span>NEBULA<span className="title-code">-F23</span></h1>
          <p className="cover-author">Bitácora por:<button type="button" className={`cover-author-button ${coverMotion ? '' : 'is-paused'}`} onClick={() => navigate('about')} aria-label="Saber más sobre Tania Prieto"><span>Tania Prieto</span></button></p>
          <div className="cover-rule" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 1C13.5 8.5 15.5 10.5 23 12C15.5 13.5 13.5 15.5 12 23C10.5 15.5 8.5 13.5 1 12C8.5 10.5 10.5 8.5 12 1Z" /></svg></div>
          <p className="welcome-description">Un recorrido construido a partir de reflexiones y escrituras automáticas en el marco del <strong>Seminario de Metodología de Investigación con Perspectiva Feminista y de Género II</strong> de la Especialización en Estudios Feministas y de Género de la Universidad Nacional de Colombia.</p>
          <p className="course-credits">Seminario dirigido por Mara Viveros,<br />con el acompañamiento tutorial de Paula Giraldo.</p>
        </div>
      </section>}
      {hasSpace && <button className="cover-motion-toggle" onClick={() => setCoverMotion(value => !value)} aria-label={coverMotion ? 'Pausar animaciones del fondo' : 'Activar animaciones del fondo'} title={coverMotion ? 'Pausar movimiento' : 'Activar movimiento'}><span aria-hidden="true">{coverMotion ? 'Ⅱ' : '▷'}</span></button>}

      {['about', 'introduction'].includes(screen) && <Notebook page={screen} onAbout={() => navigate('about')} onIntroduction={() => navigate('introduction')} onExplore={() => navigate('notice')} Flower={Flower} />}

      {screen === 'notice' && <section className="gateway"><span className="eyebrow">ANTES DE JUGAR</span><div className="pocket-illustration" aria-hidden="true"><span>✿</span></div><h1>Tu bolsillo<br /><em>feminista.</em></h1><p>A lo largo del juego podrás guardar palabras clave y pequeñas reflexiones que iremos construyendo juntas, entre mis relatos y tu lectura.</p><p>Al final volverás a encontrarlas, junto al cierre de la bitácora, como recuerdo de tu recorrido.</p><p className="quiet-note">Podrás llevarte una palabra con un toque o simplemente seguir jugando.</p><button className="primary" onClick={() => navigate('alias')}>Preparar mi bolsillo <Arrow /></button></section>}

      {screen === 'alias' && <section className="gateway alias-screen"><span className="eyebrow">ESTE RECORRIDO ES TUYO</span><h1>Un nombre<br /><em>para jugar.</em></h1><form onSubmit={begin}><label htmlFor="player-alias">Elige tu alias</label><input id="player-alias" name="alias" value={aliasDraft} onChange={event => { event.target.setCustomValidity(''); setAliasDraft(event.target.value); }} maxLength={40} autoComplete="off" required placeholder="Puede ser un nombre inventado" /><p className="quiet-note">Tu alias y tu bolsillo se quedan en este navegador. No se envían a Tania y puedes borrarlos cuando quieras.</p><button className="primary" type="submit">{alias ? 'Volver a jugar' : 'Comenzar a jugar'} <Arrow /></button></form></section>}

      {screen === 'game' && <>
        <section className="game-heading"><div><span className="eyebrow">NEBULA-F23</span><h1>{alias},<br /><em>vamos a jugar.</em></h1></div><p>Un dado, ocho pliegues y muchas formas de encontrarnos.<br />Lanza, abre un relato y llévate algo de él.</p></section>
        <section className="game" aria-label="Juego de NEBULA-F23"><div className="board-area"><div className="board-topline"><span>EL PAPEL SE ABRE CONTIGO</span><button className="text-button" onClick={() => setModal({ kind: 'help' })}>Cómo se juega ↗</button></div><Paper state={state} onOpen={() => openNote()} /><p className="board-caption">ocho pliegues, muchas formas de encontrarnos</p></div><aside className="controls" aria-label="Controles del juego"><span className="eyebrow">QUE DECIDA EL AZAR</span><h2>Todo empieza<br />con una tirada.</h2><div className="dice-tray"><Die value={visualDie} rolling={state.phase === 'rolling'} /><span className="dice-doodle" aria-hidden="true">✧</span></div><button className="primary roll-button" disabled={busy} onClick={() => dispatch({ type: 'roll' })}>{state.phase === 'rolling' ? 'Lanzando…' : state.phase === 'moving' ? 'Siguiendo los pliegues…' : 'Lanzar el dado'} <Arrow /></button><p className="status" role="status" aria-live="polite" aria-atomic="true">{status}</p>{state.phase === 'ready' && <button className="open-note" onClick={() => openNote()}>Abrir el pliegue {state.position + 1} →</button>}<div className="collection"><span className="eyebrow">TUS ENCUENTROS</span><div className="discovery-dots" aria-label={`${openedStories.length} relatos abiertos`}>{notes.map((note, index) => <span key={index} className={state.discovered.includes(index) && note.available ? 'found' : ''} aria-hidden="true">{state.discovered.includes(index) && note.available ? '✦' : '·'}</span>)}</div><p>{openedStories.length === 6 ? 'Ya encontraste los seis relatos de esta edición.' : 'Cada relato es un encuentro. Puedes volver a él desde tu bolsillo.'}</p></div></aside></section>
        <section className="pocket-strip"><div><span className="eyebrow">TU BOLSILLO FEMINISTA</span>{collectedCount ? <WordNotes words={words} /> : <p>Aquí caben las palabras que decidas llevarte.</p>}</div><button className="text-button" onClick={() => navigate('recap')}>Desplegar mi cierre <Arrow /></button></section>
      </>}

      {screen === 'recap' && <section className="recap-screen"><span className="eyebrow">UN ÚLTIMO PLIEGUE</span><h1>Lo que te llevas,<br /><em>{alias}.</em></h1><p>Un puñado de palabras que encontraste entre estos pliegues.</p>{collectedCount ? <WordNotes words={words} large /> : <p className="empty-pocket">Tu bolsillo también puede guardar el tiempo que te tomaste para leer. Puedes volver al papel y elegir palabras si te apetece.</p>}<div className="recap-columns"><section><h2>Los relatos que abriste</h2>{openedStories.length ? <ul className="story-list">{openedStories.map(index => <li key={index}><span>{String(index + 1).padStart(2, '0')}</span><button onClick={() => openNote(index)}>{notes[index].title}</button></li>)}</ul> : <p>El papel sigue abierto para tu primer encuentro.</p>}</section><section className="closing-note"><span className="eyebrow">UNA BITÁCORA QUE SIGUE CRECIENDO</span><Flower className="closing-flower" /><h2>El cierre también<br />tiene su tiempo.</h2><p>La conclusión de esta bitácora está en escritura. Mientras toma forma, aquí queda el recuerdo de tu recorrido.</p></section></div><div className="recap-actions"><button className="primary" onClick={() => navigate('game')}>Volver al papel <Arrow /></button><button className="text-button" onClick={() => setModal({ kind: 'reset' })}>Borrar mi recorrido de este navegador</button></div></section>}

      {!isCover && !storageAvailable && alias && <p className="storage-notice" role="status">Este navegador no permite guardar el recorrido. Tu bolsillo seguirá disponible mientras mantengas esta página abierta.</p>}
    </main>

    <footer><button type="button" className="footer-home" onClick={() => navigate('home')} aria-label="Volver a la portada de NEBULA-F23">NEBULA-F23</button><span>Seminario de Metodología de Investigación con Perspectiva Feminista y de Género II · Una bitácora en construcción</span></footer>

    {modal?.kind === 'note' && <Dialog title={notes[modal.index].title} eyebrow={`PLIEGUE ${String(modal.index + 1).padStart(2, '0')} · ${notes[modal.index].available ? 'UN RELATO PARA ENCONTRARNOS' : 'OTRA TIRADA, OTRO ENCUENTRO'}`} wide onClose={() => setModal(null)}><ReadEntry key={modal.index} note={notes[modal.index]} selected={words[modal.index]} onSave={word => setWords(previous => ({ ...previous, [modal.index]: word }))} onReturn={() => { setModal(null); navigate('game'); }} /></Dialog>}
    {modal?.kind === 'help' && <Dialog title="Un pequeño ritual" eyebrow="CÓMO SE JUEGA" onClose={() => setModal(null)}><ol className="instructions"><li><strong>Lanza el dado.</strong> El papel se mueve tantos pasos como indique la tirada.</li><li><strong>Abre el pliegue.</strong> La pestaña de llegada guarda un relato o una invitación a volver a jugar.</li><li><strong>Llévate una palabra.</strong> Después de leer puedes tocar una de las palabras para guardarla en tu bolsillo.</li></ol><p>Avanzas desde tu última posición; después del pliegue ocho, vuelves al primero. Tu cierre está disponible cuando quieras hacer una pausa.</p><button className="primary" onClick={() => setModal(null)}>Vamos a jugar <Arrow /></button></Dialog>}
    {modal?.kind === 'pocket' && <Dialog title="Tu bolsillo feminista" eyebrow="LAS PALABRAS QUE TE ACOMPAÑAN" onClose={() => setModal(null)}>{collectedCount ? <WordNotes words={words} /> : <p>Aquí caben las palabras que decidas llevarte después de cada relato.</p>}{openedStories.length > 0 && <ul className="story-list">{openedStories.map(index => <li key={index}><span>{String(index + 1).padStart(2, '0')}</span><button onClick={() => openNote(index)}>{notes[index].title}</button></li>)}</ul>}<p className="quiet-note">Este bolsillo se guarda solo en tu navegador. Tania no recibe tu alias ni tus elecciones.</p><button className="primary" onClick={() => navigate('recap')}>Desplegar mi cierre <Arrow /></button><button className="text-button erase-button" onClick={() => setModal({ kind: 'reset' })}>Borrar mi recorrido</button></Dialog>}
    {modal?.kind === 'reset' && <Dialog title="Vaciar mi bolsillo" eyebrow="TU RECORRIDO PERSONAL" onClose={() => setModal(null)}><p>Se borrarán de este navegador tu alias, tus palabras y los pliegues abiertos. Podrás empezar otra vez.</p><div className="reset-actions"><button className="primary" onClick={resetJourney}>Borrar mi recorrido</button><button className="text-button" onClick={() => setModal(null)}>Conservarlo</button></div></Dialog>}
  </>;
}
