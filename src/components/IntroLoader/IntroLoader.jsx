import { useCallback, useEffect, useRef, useState } from 'react';
import useLoadProgress from './useLoadProgress';
import loadFont from './loadFont';

// Welcome loader — plays on EVERY page load (initial visit and refresh).
// It is not gated on a stored "already seen" flag: route changes are
// client-side, so this only runs on a real document load, and the SKIP
// button plus the reduced-motion path are the escape hatches. Architecture:
//  - This component ships in the eager bundle, so the black shell paints
//    immediately. On the WebGL path the shell is deliberately minimal —
//    progress line, percentage, skip — because the greeting must appear
//    exactly once, formed BY the particles. A legible static greeting is
//    the fallback only (reduced motion, or WebGL failed/unavailable).
//  - The OGL particle scene lazy-loads in parallel; `webgl` tracks it:
//    'pending' (still hoping) -> 'active' | 'failed'.
//  - Progress comes from useLoadProgress (real load signals only). The
//    scene paces its animation independently — see particleScene.js.
const GREETING = 'HELLO!!!';
const SUBTITLE = 'Welcome to my Personal Website';

const IntroLoader = () => {
  const [phase, setPhase] = useState('loading');
  const [reduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [webgl, setWebgl] = useState('pending');
  const canvasRef = useRef(null);
  const textCanvasRef = useRef(null);
  const sceneRef = useRef(null);
  const finishedRef = useRef(false);

  const progress = useLoadProgress(phase === 'loading');

  // Lazy-load the WebGL scene (reduced-motion visitors never pay for it).
  useEffect(() => {
    if (reduced) return undefined;
    let disposed = false;
    (async () => {
      try {
        // Wait for Iceland — the face BOTH the particle mask and the solid
        // text layer render in, so their registration stays exact. A slow
        // font CDN falls back to the narrow system sans in the stack.
        await loadFont('400 240px Iceland', 2500);
        const { createParticleScene } = await import('./particleScene');
        if (disposed || !canvasRef.current || !textCanvasRef.current) return;
        const scene = createParticleScene(canvasRef.current, {
          heading: GREETING,
          subtitle: SUBTITLE,
          // Crisp text layer the scene draws and cross-fades in at handoff.
          textCanvas: textCanvasRef.current,
        });
        if (!scene) {
          if (!disposed) setWebgl('failed');
          return;
        }
        if (disposed) {
          scene.destroy();
          return;
        }
        sceneRef.current = scene;
        setWebgl('active');
      } catch {
        if (!disposed) setWebgl('failed');
      }
    })();
    return () => {
      disposed = true;
      if (sceneRef.current) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
    };
  }, [reduced]);

  useEffect(() => {
    if (webgl === 'active' && sceneRef.current) sceneRef.current.setProgress(progress);
  }, [progress, webgl]);

  const finish = useCallback((skipped) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const fadeOut = () => {
      // Announce that the page beneath is being revealed — the nav's
      // entrance choreography keys off this. Every exit path (burst, skip,
      // fallback) funnels through here.
      window.dispatchEvent(new Event('intro:reveal'));
      setPhase('exiting');
      setTimeout(() => setPhase('gone'), 800);
    };
    // Skipping bypasses the hold + burst so the exit is immediate.
    if (sceneRef.current && !skipped) {
      sceneRef.current.burst().then(fadeOut);
    } else {
      fadeOut();
    }
  }, []);

  // Float-safe completion check (the weights sum to 1 within epsilon).
  // On fast connections loading can complete before the particle chunk has
  // initialized; give the scene a short, bounded grace window so first-time
  // visitors get the cinematic instead of a plain fade. The moment `webgl`
  // settles, this effect re-runs and takes the right path.
  useEffect(() => {
    if (phase !== 'loading' || progress < 0.999) return undefined;
    if (reduced || webgl !== 'pending') {
      finish(false);
      return undefined;
    }
    const grace = setTimeout(() => finish(false), 1500);
    return () => clearTimeout(grace);
  }, [phase, progress, reduced, webgl, finish]);

  // Keep the page from scrolling underneath the overlay.
  const visible = phase !== 'gone';
  useEffect(() => {
    if (!visible) return undefined;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [visible]);

  if (!visible) return null;

  const pct = Math.min(100, Math.round(progress * 100));
  const exiting = phase === 'exiting';
  // The static greeting is fallback-only; on the WebGL path ('pending' or
  // 'active') the particles are the one and only reveal.
  const showFallbackText = reduced || webgl === 'failed';

  return (
    <div
      className={`intro-loader fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-700 ${
        exiting ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden={exiting}
    >
      {!reduced && webgl !== 'failed' && (
        <>
          {/* Crisp text layer (under) — the scene draws the greeting here and
              cross-fades it in as the particles settle. Particle canvas (over)
              so the exit burst flies above the solid text. */}
          <canvas
            ref={textCanvasRef}
            className="absolute inset-0 h-full w-full"
            style={{ opacity: 0 }}
            aria-hidden="true"
          />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        </>
      )}

      {/* The greeting for screen readers, whichever visual path renders it. */}
      <p className="sr-only">
        {GREETING} {SUBTITLE}
      </p>

      {/* Fallback path: greeting + welcome line stacked as one centered block. */}
      {showFallbackText && (
        <div className="flex flex-col items-center gap-4 px-4">
          <h1 className="wlcm-head text-center text-4xl font-extrabold sm:text-6xl md:text-7xl">
            {GREETING}
            <span className="glow-alt" aria-hidden="true">
              {GREETING}
            </span>
          </h1>
          <p className="wlcm-head text-center text-base font-extrabold sm:text-xl md:text-2xl" aria-hidden="true">
            {SUBTITLE}
            <span className="glow-alt" aria-hidden="true">
              {SUBTITLE}
            </span>
          </p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-[10%] flex flex-col items-center gap-4 px-4">
        <div
          className="h-px w-56 bg-white/15 sm:w-72"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="Loading site"
        >
          <div
            className="h-full bg-[orangered] shadow-[0_0_8px_orangered] transition-[width] duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="iceland text-lg tracking-[0.3em] text-[orangered]" aria-hidden="true">
          {pct}%
        </p>
      </div>

      <button
        type="button"
        onClick={() => finish(true)}
        className="iceland absolute right-5 bottom-5 border border-[orangered]/50 px-4 py-1 text-lg tracking-widest text-white/60 transition-colors hover:border-[orangered] hover:text-[orangered] focus:border-[orangered] focus:text-[orangered]"
      >
        SKIP
      </button>
    </div>
  );
};

export default IntroLoader;
