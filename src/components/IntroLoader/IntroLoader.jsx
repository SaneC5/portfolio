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
// Copy follows the site's voice: the display line ends in a single accent
// period (SANE CHACKO. / LET'S TALK.), and the secondary line is a tracked
// HUD label that opens the figure sequence Home continues (FIG. 01 hello,
// FIG. 02 portrait, FIG. 03 next step). The mark is split out so both the
// DOM fallback and the particle scene can ink it separately — white
// display glyphs, accent period, the SANE CHACKO. idiom.
const GREETING = 'HELLO';
const GREETING_MARK = '.';
const SUBTITLE = 'FIG. 00 — WELCOME';

const IntroLoader = () => {
  const [phase, setPhase] = useState('loading');
  const [reduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [webgl, setWebgl] = useState('pending');
  const canvasRef = useRef(null);
  const textCanvasRef = useRef(null);
  const sceneRef = useRef(null);
  // Two separate latches. `exitedRef` guards the fade-out itself (it may only
  // ever start once). `naturalRef` guards the natural finish, which waits on
  // the scene's hold-and-burst — a wait that must stay preemptible by SKIP.
  const exitedRef = useRef(false);
  const naturalRef = useRef(false);

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
          headingMark: GREETING_MARK,
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

  // Idempotent: the fade may only ever start once, whichever path gets here
  // first. Announces that the page beneath is being revealed — the nav's
  // entrance choreography keys off this. Every exit path (burst, skip,
  // fallback) funnels through here.
  const beginExit = useCallback(() => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    window.dispatchEvent(new Event('intro:reveal'));
    setPhase('exiting');
    setTimeout(() => setPhase('gone'), 800);
  }, []);

  const finish = useCallback(
    (skipped) => {
      if (exitedRef.current) return;
      // SKIP always wins. A natural finish fires the moment loading completes
      // — on a warm cache that is a few hundred ms in — and then sits waiting
      // on the scene's hold-and-burst for several seconds. When a single
      // latch guarded both paths, that wait left the button dead for nearly
      // the whole animation.
      if (skipped) {
        beginExit();
        return;
      }
      if (naturalRef.current) return;
      naturalRef.current = true;
      // beginExit is idempotent, so a burst resolving after a skip is a no-op.
      if (sceneRef.current) {
        sceneRef.current.burst().then(beginExit);
      } else {
        beginExit();
      }
    },
    [beginExit]
  );

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

  // Escape skips — the menu's Escape-to-close convention. Window-level,
  // because the page beneath is inert while the overlay covers it.
  useEffect(() => {
    if (phase !== 'loading') return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') finish(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, finish]);

  // The component never unmounts (App keeps it in the tree), so the scene
  // must be torn down when the overlay leaves the DOM — otherwise its rAF
  // loop keeps drawing invisible points to a detached canvas, a GPU/CPU tax
  // for the rest of the session. The unmount cleanup stays for hot reloads.
  useEffect(() => {
    if (phase !== 'gone' || !sceneRef.current) return;
    sceneRef.current.destroy();
    sceneRef.current = null;
  }, [phase]);

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

      {/* The canvas path draws the greeting as pixels; this is its accessible
          text. The fallback path below renders real text instead. */}
      {!showFallbackText && <p className="sr-only">Hello. Welcome to my personal website.</p>}

      {/* Fallback path (reduced motion / no WebGL): the finished frame in the
          system faces — Big Shoulders display line with the accent period,
          the bracketed Iceland HUD label under it. Static by design. */}
      {showFallbackText && (
        <div className="flex flex-col items-center gap-5 px-4 text-center">
          <h1 className="big-shoulder text-6xl font-bold leading-[0.9] tracking-[0.015em] text-white sm:text-7xl md:text-8xl">
            {GREETING}
            <span className="text-[orangered]">{GREETING_MARK}</span>
          </h1>
          {/* The hero role-line's bracket idiom: label-grey [ ] flanking
              accent-ink text with its soft glow, gap matched to the canvas
              path (0.75em visual: 0.43em box gap + the 0.32em trailing
              track). Trailing overhang cancelled the wordmark's way. */}
          <p className="iceland flex items-center gap-[0.43em] -mr-[0.32em] text-sm tracking-[0.32em] sm:text-base">
            <span className="text-[#a6a6a6]" aria-hidden="true">[</span>
            <span className="text-[#ff5a1f] [text-shadow:0_0_0.46em_rgba(255,69,0,0.4)]">
              {SUBTITLE}
            </span>
            <span className="text-[#a6a6a6]" aria-hidden="true">]</span>
          </p>
        </div>
      )}

      {/* Progress HUD. The fill draws as a scaleX wipe (the nav-underline /
          strip-rule idiom — no per-frame layout) on the site's 0.35s ease.
          The row holds at 100% through the whole hold-and-burst and leaves
          with the overlay's exit fade — one exit, never a mid-sequence
          vanish. #ff5a1f is the hero's accent-ink — orangered lightened one
          step wherever it is used as text. */}
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
            className="h-full w-full origin-left bg-[orangered] shadow-[0_0_8px_orangered] transition-transform duration-[350ms] will-change-transform"
            style={{ transform: `scaleX(${Math.min(1, progress)})` }}
          />
        </div>
        {/* Fixed slot, right-aligned: the % anchor stays put as the digit
            count grows, so the readout never wobbles (Iceland has no tabular
            figures). */}
        <p className="iceland min-w-[4.5ch] text-right text-lg tracking-[0.32em] text-[#ff5a1f]" aria-hidden="true">
          {pct}%
        </p>
      </div>

      {/* Seated on the HUD's bottom line (one anchor system on this screen,
          not two) at the content gutters; dim -> bright on the site's 0.35s
          clock, with the shared focus-visible outline idiom. */}
      <button
        type="button"
        onClick={() => finish(true)}
        className="iceland absolute bottom-[10%] right-4 border border-[orangered]/50 px-4 py-1 text-lg tracking-widest text-white/60 cursor-pointer transition-colors duration-[350ms] hover:border-[orangered] hover:text-[orangered] focus-visible:border-[orangered] focus-visible:text-[orangered] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/40 sm:right-6 lg:right-8"
      >
        SKIP
      </button>
    </div>
  );
};

export default IntroLoader;
