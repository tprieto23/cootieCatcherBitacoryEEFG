import React, { useEffect, useRef } from 'react';
import collisionVideo from './assets/choque-nebula.mp4?url';
import collisionPoster from './assets/choque-nebula-poster.jpg';
import './collision-scene.css';

const noise = seed => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export function CollisionScene({ motion }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    function syncPlayback() {
      if (motion && !reducedMotion.matches && visible && !document.hidden) {
        video.play().catch(() => { /* Keep the poster if autoplay is unavailable. */ });
      } else video.pause();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: .1 });
    observer.observe(video);
    reducedMotion.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [motion]);

  return <div className="mission-cosmos collision-scene" aria-hidden="true">
    <div className="collision-haze" />
    <svg className="collision-stars" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">{Array.from({ length: 185 }, (_, index) => <circle key={index} cx={noise(index + 40) * 1440} cy={noise(index + 540) * 800} r={.45 + noise(index + 1040) * 1.05} fill={index % 11 ? '#d4dcf3' : '#FDDD46'} opacity={.18 + noise(index + 1540) * .55} />)}</svg>
    <div className="collision-moon" />
    <div className="collision-distant-planet" />
    <video ref={videoRef} className="collision-video" src={collisionVideo} poster={collisionPoster} muted loop playsInline preload="none" tabIndex={-1} />
    <div className="collision-vignette" />
  </div>;
}
