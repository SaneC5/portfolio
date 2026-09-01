import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import BriefcaseIcon from '../icons/BriefcaseIcon';
import ScanButton from '../ScanButton';
import './Hero.css';

// Portrait slot. Set to null to render the designed placeholder (hatch +
// silhouette) instead. The sc2.webp path is free to load: the intro loader
// already streams that file while the progress bar runs, so the image is
// warm in cache at reveal.
import portraitUrl from '../../assets/img/sc2.webp';
const PORTRAIT_SRC = portraitUrl;

// All true of this repo: React 19, Node (serverless contact API), Tailwind 4,
// GSAP, and the OGL WebGL intro.
const STACK = ['REACT', 'NODE.JS', 'TAILWIND', 'GSAP', 'WEBGL'];

const Hero = () => {
  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const portraitRef = useRef(null);

  useLayoutEffect(() => {
    // Reduced motion: no entrance, no parallax. Every hidden state below is
    // applied by GSAP, so bailing out here leaves the finished frame.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let fallback;
    const listeners = [];
    const ctx = gsap.context(() => {
      // The HUD strokes draw themselves: dash each path to its own length so
      // a single dashoffset tween wipes it on end-to-end.
      const paths = gsap.utils.toArray('.hud-draw');
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      tl.fromTo(gridRef.current, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: 'none' }, 0)
        .fromTo('.hero-kicker', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1)
        .fromTo(
          '.hero-line-inner',
          { yPercent: 112 },
          { yPercent: 0, duration: 0.95, ease: 'power4.out', stagger: 0.12 },
          0.18
        )
        .fromTo(
          '.hero-role',
          { clipPath: 'inset(-25% 100% -25% 0)' },
          { clipPath: 'inset(-25% 0% -25% 0)', duration: 0.7, ease: 'power2.inOut' },
          0.62
        )
        .fromTo(
          ['.hero-tagline', '.hero-cta'],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          0.85
        )
        .to(paths, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: 0.06 }, 0.45)
        .fromTo(['.hero-portrait-media', '.hero-rail-index'], { opacity: 0 }, { opacity: 1, duration: 0.7 }, 1.0)
        .fromTo('.hud-fade', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.2)
        .fromTo('.hero-portrait-caption', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 1.3)
        .fromTo('.hero-strip', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 1.35);

      // Same contract as the header's entrance: hold while the intro loader
      // covers the page, play as it starts to fade ('intro:reveal' fires on
      // every exit path, skip included), play immediately when there is no
      // loader (client-side nav back to Home), and never stay hidden if the
      // event is somehow missed.
      const play = () => tl.play();
      if (document.querySelector('.intro-loader')) {
        window.addEventListener('intro:reveal', play, { once: true });
        listeners.push(() => window.removeEventListener('intro:reveal', play));
        // The net outlasts the loader's slowest natural path (~13s on a
        // stalled connection: 8s load cap + full converge + hold + burst).
        fallback = setTimeout(play, 14000);
      } else {
        play();
      }

      // Pointer parallax, fine-pointer devices only: the portrait drifts with
      // the cursor, the grid drifts against it. Amplitudes are small on
      // purpose — a depth cue, not a toy. The type column never moves.
      if (window.matchMedia('(pointer: fine)').matches) {
        const px = gsap.quickTo(portraitRef.current, 'x', { duration: 0.8, ease: 'power3' });
        const py = gsap.quickTo(portraitRef.current, 'y', { duration: 0.8, ease: 'power3' });
        const gx = gsap.quickTo(gridRef.current, 'x', { duration: 1.2, ease: 'power3' });
        const gy = gsap.quickTo(gridRef.current, 'y', { duration: 1.2, ease: 'power3' });
        const onMove = (e) => {
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          px(nx * 7);
          py(ny * 7);
          gx(nx * -10);
          gy(ny * -10);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        listeners.push(() => window.removeEventListener('mousemove', onMove));
      }
    }, rootRef);

    return () => {
      clearTimeout(fallback);
      listeners.forEach((off) => off());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="hero relative flex min-h-[calc(100svh-var(--nav-h))] flex-col overflow-hidden"
    >
      <div ref={gridRef} className="hero-grid" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center py-10 lg:py-6">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
            {/* Type column */}
            <div>
              <p className="hero-kicker iceland">
                <span className="hero-kicker-rule" aria-hidden="true" />
                FIG. 01 — HELLO, I'M
              </p>

              <h1 className="hero-name big-shoulder">
                <span className="hero-line">
                  <span className="hero-line-inner">SANE</span>
                </span>
                <span className="hero-line">
                  <span className="hero-line-inner">
                    CHACKO<span className="hero-dot">.</span>
                  </span>
                </span>
              </h1>

              <p className="hero-role iceland">
                <span className="hero-role-bracket" aria-hidden="true">[</span>
                FULL STACK WEB DEVELOPER
                <span className="hero-role-bracket" aria-hidden="true">]</span>
                <span className="hero-role-rule" aria-hidden="true" />
              </p>

              <p className="hero-tagline oswald">
                Passionate about creating amazing web experiences.
              </p>

              <div className="hero-cta">
                <ScanButton
                  to="/projects"
                  size="lg"
                  ariaLabel="Discover my creations — view projects"
                  icon={BriefcaseIcon}
                >
                  Discover My Creations
                </ScanButton>
                <Link to="/contact" className="hero-link">
                  Get In Touch
                </Link>
              </div>
            </div>

            {/* Portrait column — a measured schematic viewport. The media area
                is registered onto the HUD's frame rect: same aspect box, so
                the % insets land exactly on the rect edges at every size. */}
            <figure ref={portraitRef} className="hero-portrait">
              <div className="hero-portrait-frame">
                <div className="hero-portrait-media">
                  {PORTRAIT_SRC ? (
                    <img src={PORTRAIT_SRC} alt="Sane Chacko" className="hero-portrait-img" />
                  ) : (
                    <div className="hero-portrait-placeholder" aria-hidden="true">
                      <svg viewBox="0 0 200 220" preserveAspectRatio="xMidYMax meet">
                        <circle cx="100" cy="92" r="42" />
                        <path d="M18,220 C18,158 58,138 100,138 C142,138 182,158 182,220 Z" />
                      </svg>
                      <span className="iceland">IMG // PENDING</span>
                    </div>
                  )}
                  <span className="hero-scanline" aria-hidden="true" />
                </div>

                <svg className="hero-portrait-hud" viewBox="0 0 440 560" aria-hidden="true">
                  {/* Frame rect */}
                  <path className="hud-stroke hud-draw" d="M30 30 H410 V530 H30 Z" />
                  {/* Corner brackets — the site's border-scan idiom */}
                  <path className="hud-bracket hud-draw" d="M22 54 V22 H54" />
                  <path className="hud-bracket hud-draw" d="M386 22 H418 V54" />
                  <path className="hud-bracket hud-draw" d="M418 506 V538 H386" />
                  <path className="hud-bracket hud-draw" d="M54 538 H22 V506" />
                  {/* Top dimension line, gapped for its label (decorative —
                      the numbers are the portrait asset's pixel size) */}
                  <path className="hud-stroke hud-draw" d="M30 12 H150 M290 12 H410 M30 6 V18 M410 6 V18" />
                  <text className="hud-fade" x="220" y="17" textAnchor="middle">1137 × 1143</text>
                  {/* Right dimension line, gapped for its label */}
                  <path className="hud-stroke hud-draw" d="M428 30 V240 M428 320 V530 M422 30 H434 M422 530 H434" />
                  <text className="hud-fade" x="428" y="280" textAnchor="middle" transform="rotate(90 428 280)">
                    SANE.C
                  </text>
                  {/* Measurement rail — ruler ticks along the left edge.
                      Majors every 100 units (longer), minors every 20. All on
                      the border, so no crop of the photo is ever overlapped. */}
                  <path
                    className="hud-stroke hud-draw"
                    d="M20 130 H30 M20 230 H30 M20 330 H30 M20 430 H30"
                  />
                  <path
                    className="hud-stroke hud-draw"
                    d="M24 70 H30 M24 90 H30 M24 110 H30 M24 150 H30 M24 170 H30 M24 190 H30 M24 210 H30 M24 250 H30 M24 270 H30 M24 290 H30 M24 310 H30 M24 350 H30 M24 370 H30 M24 390 H30 M24 410 H30 M24 450 H30 M24 470 H30 M24 490 H30"
                  />
                </svg>

                {/* Rail index — the scan's gauge. Rides the left rail in
                    lockstep with the scanline: same keyframes, same 7s clock
                    on the document timeline, so the two can never drift and
                    together they read as one instrument cycle. */}
                <span className="hero-rail-index" aria-hidden="true">
                  <span className="hero-rail-index-carrier">
                    <span className="hero-rail-index-marker" />
                  </span>
                </span>
              </div>
              <figcaption className="hero-portrait-caption iceland">
                <span>FIG. 02 — PORTRAIT</span>
                <span>SCALE 1:1</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Spec strip pinned to the fold */}
        <div className="hero-strip">
          <ul className="hero-strip-tags iceland" aria-label="Core technologies">
            {STACK.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <span className="hero-strip-scroll iceland" aria-hidden="true">
            SCROLL
            <svg className="hero-scroll-chevron" width="12" height="7" viewBox="0 0 12 7" fill="none">
              <path d="M1 1 L6 6 L11 1" stroke="orangered" strokeWidth="1.5" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
