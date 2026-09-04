import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SheetHeader from '../SheetHeader';
import SheetEndcap from '../SheetEndcap';
import { playSheetHeader, playSheetEndcap } from '../sheetMotion';
import FadeImage from '../FadeImage';
import './SelectedWorks.css';

// One representative shot per plate. Only these four image modules enter the
// Home chunk — never the Projects page's full media set.
import ZylynShot from '../../assets/img/projects/zylyn-1.webp';
import ZuperShot from '../../assets/img/projects/zuper-1.webp';
import AiCallingShot from '../../assets/img/projects/aiCalling-1.webp';
import KondajiShot from '../../assets/img/projects/Kondaji-1.webp';

gsap.registerPlugin(ScrollTrigger);

// Values copied from MY_PROJECTS in src/pages/Projects.jsx (ids match) —
// copied, not imported: nothing there is exported, and importing that module
// would pull the whole Projects chunk and its media graph into Home. Stacks
// are display-curated: Zylyn shows the five most telling of its nine items.
//
// TODO(copy): `outcome`, `role` and `scope` are best-guess drafts distilled
// from the Projects page descriptions — plain sentences, no figures — for
// Sane to rewrite. `role` is inferred from each project's type; `scope` is
// lifted from the description text.
const PLATES = [
  {
    id: 'zylyn',
    short: 'ZYLYN',
    title: 'ZYLYN — ACCESSIBILITY CHECKER',
    type: 'FULL-STACK SAAS PLATFORM',
    outcome:
      'Any URL can be audited for WCAG violations, with every scan kept in a client portal — pages behind a login included, via the Chrome extension.',
    role: 'FULL-STACK DEVELOPMENT',
    scope: ['WEB APP', 'CLIENT PORTAL', 'CHROME EXTENSION'],
    stack: ['NEXT.JS', 'TYPESCRIPT', 'NODE.JS', 'STRIPE', 'CHROME EXTENSION'],
    shot: ZylynShot,
    alt: 'Zylyn — Accessibility Checker project screenshot',
  },
  {
    id: 'zuper',
    short: 'ZUPER',
    title: 'ZUPER — FIELD SERVICE PLATFORM',
    type: 'SAAS MARKETING WEBSITE',
    outcome:
      "Zuper's product, industry and resources pages ship as a static-first Astro site, with editors publishing from a headless WordPress CMS.",
    role: 'FRONT-END & CMS INTEGRATION',
    scope: ['MARKETING SITE', 'RESOURCES HUB', 'HEADLESS CMS'],
    stack: ['ASTRO', 'REACT', 'TYPESCRIPT', 'HEADLESS WORDPRESS'],
    shot: ZuperShot,
    alt: 'Zuper — Field Service Platform project screenshot',
  },
  {
    id: 'retell',
    short: 'AI CALLING',
    title: 'AI AUTOMATION CALLING SYSTEM',
    type: 'AI WORKFLOW AUTOMATION',
    outcome:
      'Outbound calls, meeting bookings and call summaries run without manual dialing — a Retell AI agent works a Google Sheet and books through Cal.com.',
    role: 'WORKFLOW AUTOMATION',
    scope: ['OUTBOUND CALLS', 'SCHEDULING', 'CALL SUMMARIES'],
    stack: ['MAKE.COM', 'RETELL AI', 'GOOGLE SHEETS', 'CAL.COM'],
    shot: AiCallingShot,
    alt: 'AI Automation Calling System project screenshot',
  },
  {
    id: 'kondaji',
    short: 'KONDAJI',
    title: 'KONDAJI CHIVDA',
    type: 'FULL-STACK E-COMMERCE WEBSITE',
    outcome:
      'Kondaji Chivda sells online through its own storefront, with the catalog and orders managed from a custom admin panel.',
    role: 'FULL-STACK DEVELOPMENT',
    scope: ['STOREFRONT', 'CART & ORDERS', 'ADMIN PANEL'],
    stack: ['HTML', 'CSS', 'BOOTSTRAP', 'JAVASCRIPT', 'NODE.JS', 'EXPRESS.JS', 'SQL'],
    shot: KondajiShot,
    alt: 'Kondaji Chivda project screenshot',
  },
];

// "PLATE 01 / 04" — the kicker's x-of-y wayfinding.
const TOTAL = String(PLATES.length).padStart(2, '0');

// Title-block rows, in order. Same three fields on every plate.
const BLOCK_ROWS = [
  { label: 'ROLE', get: (p) => [p.role] },
  { label: 'SCOPE', get: (p) => p.scope },
  { label: 'STACK', get: (p) => p.stack },
];

const SelectedWorks = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    // Reduced motion: no entrances, no hover instruments. Every hidden state
    // below is applied by GSAP, so bailing out here leaves the finished frame.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const listeners = [];
    const ctx = gsap.context(() => {
      // No intro:reveal gate here, unlike the hero/footer: the hero fills the
      // first viewport, so every trigger below starts under the fold and
      // cannot fire while the loader still has scroll locked.
      playSheetHeader(rootRef.current.querySelector('.sheet-header'));

      const plates = gsap.utils.toArray(rootRef.current.querySelectorAll('.plate'));
      const pointerFine = window.matchMedia('(pointer: fine)').matches;

      plates.forEach((plate) => {
        const q = gsap.utils.selector(plate);

        // The frame draws itself: dash each path to its own length so a
        // single dashoffset tween wipes it on end-to-end (the hero's HUD).
        const paths = q('.plate-draw');
        paths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });

        // Plotter print: strokes draw, then the shot wipes in left-to-right
        // behind a glowing scan bar. Bar and clip edge share one duration and
        // ease, so they read as a single print head.
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: plate, start: 'top 72%', once: true },
          })
          .to(paths, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.05 }, 0)
          .set(q('.plate-scan'), { opacity: 1 }, 0.15)
          .fromTo(
            q('.plate-media'),
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power2.inOut' },
            0.15
          )
          .fromTo(q('.plate-scan'), { xPercent: -100 }, { xPercent: 0, duration: 0.9, ease: 'power2.inOut' }, 0.15)
          .to(q('.plate-scan'), { opacity: 0, duration: 0.2 }, 1.02)
          .fromTo(q('.sheet-subkicker'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.3)
          .fromTo(
            q('.plate-title-inner'),
            { yPercent: 112 },
            { yPercent: 0, duration: 0.95, ease: 'power4.out' },
            0.35
          )
          .fromTo(
            [...q('.plate-outcome'), ...q('.plate-block'), ...q('.plate-link-row')],
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
            0.5
          )
          .fromTo(q('.plate-caption'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.75);

        // Survey instruments, fine-pointer devices only: the shot drifts a
        // few px inside its fixed frame (the hero portrait's parallax, at
        // plate scale) while a crosshair + coordinate readout track the
        // cursor. Transforms via quickTo; the readout digits are written
        // straight to textContent on a rAF gate — no React re-renders.
        if (pointerFine) {
          const media = plate.querySelector('.plate-media');
          const cross = plate.querySelector('.plate-cross');
          const readout = plate.querySelector('.plate-cross-readout');
          const driftX = gsap.quickTo(plate.querySelector('.plate-img-layer'), 'x', { duration: 0.6, ease: 'power3' });
          const driftY = gsap.quickTo(plate.querySelector('.plate-img-layer'), 'y', { duration: 0.6, ease: 'power3' });
          const lineX = gsap.quickTo(plate.querySelector('.plate-cross-x'), 'x', { duration: 0.15, ease: 'power2' });
          const lineY = gsap.quickTo(plate.querySelector('.plate-cross-y'), 'y', { duration: 0.15, ease: 'power2' });
          const tagX = gsap.quickTo(readout, 'x', { duration: 0.15, ease: 'power2' });
          const tagY = gsap.quickTo(readout, 'y', { duration: 0.15, ease: 'power2' });

          let raf = 0;
          let mx = 0;
          let my = 0;
          const writeReadout = () => {
            raf = 0;
            readout.textContent = `X:${String(Math.round(mx)).padStart(4, '0')} Y:${String(Math.round(my)).padStart(4, '0')}`;
          };
          const onMove = (e) => {
            const r = media.getBoundingClientRect();
            mx = e.clientX - r.left;
            my = e.clientY - r.top;
            driftX(((mx / r.width) * 2 - 1) * 6);
            driftY(((my / r.height) * 2 - 1) * 6);
            lineX(mx);
            lineY(my);
            tagX(mx + 14);
            tagY(my + 14);
            if (!raf) raf = requestAnimationFrame(writeReadout);
          };
          const onEnter = () => gsap.to(cross, { opacity: 1, duration: 0.25 });
          const onLeave = () => {
            gsap.to(cross, { opacity: 0, duration: 0.25 });
            driftX(0);
            driftY(0);
          };
          media.addEventListener('pointermove', onMove, { passive: true });
          media.addEventListener('pointerenter', onEnter);
          media.addEventListener('pointerleave', onLeave);
          listeners.push(() => {
            cancelAnimationFrame(raf);
            media.removeEventListener('pointermove', onMove);
            media.removeEventListener('pointerenter', onEnter);
            media.removeEventListener('pointerleave', onLeave);
          });
        }
      });

      playSheetEndcap(rootRef.current.querySelector('.sheet-endcap'));
    }, rootRef);

    return () => {
      listeners.forEach((off) => off());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="selected-works"
      aria-labelledby="works-title"
      className="works sheet mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <SheetHeader index="01" kicker="SELECTED WORKS" title="Built to ship" id="works-title" />

      <div className="mt-12 flex flex-col gap-16 lg:mt-14 lg:gap-20">
        {PLATES.map((p, i) => {
          const flip = i % 2 === 1;
          const num = String(i + 1).padStart(2, '0');
          return (
            <article
              key={p.id}
              className="plate grid items-center gap-10 lg:grid-cols-12 lg:gap-12"
              aria-labelledby={`works-plate-${p.id}`}
            >
              <figure className={`m-0 lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
                <div className="plate-frame">
                  <div className="plate-media">
                    <div className="plate-img-layer">
                      <FadeImage src={p.shot} alt={p.alt} className="plate-img" loading="lazy" />
                    </div>
                    <span className="plate-scan" aria-hidden="true">
                      <span className="plate-scan-bar" />
                    </span>
                    <span className="plate-cross" aria-hidden="true">
                      <span className="plate-cross-x" />
                      <span className="plate-cross-y" />
                      <span className="plate-cross-readout iceland">X:0000 Y:0000</span>
                    </span>
                  </div>

                  {/* 16:9 cut of the hero portrait's HUD, deliberately
                      sparser — frame rect, corner brackets, three dimension
                      ticks — so the hero stays the richest instrument. Media
                      insets (20/560, 20/315) land exactly on the rect. */}
                  <svg className="plate-hud" viewBox="0 0 560 315" aria-hidden="true">
                    <path className="plate-stroke plate-draw" d="M20 20 H540 V295 H20 Z" />
                    <path className="plate-bracket plate-draw" d="M12 44 V12 H44" />
                    <path className="plate-bracket plate-draw" d="M516 12 H548 V44" />
                    <path className="plate-bracket plate-draw" d="M548 271 V303 H516" />
                    <path className="plate-bracket plate-draw" d="M44 303 H12 V271" />
                    <path className="plate-stroke plate-draw" d="M160 295 V303 M300 295 V303 M440 295 V303" />
                  </svg>
                </div>
                <figcaption className="plate-caption iceland">
                  <span>{p.short}</span>
                  <span className="plate-caption-sep" aria-hidden="true">/</span>
                  <span>{p.type}</span>
                </figcaption>
              </figure>

              <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
                {/* Plate kicker — the shared sub-kicker, carrying the plate
                    number as x-of-y wayfinding. */}
                <p className="sheet-subkicker iceland">
                  <span className="sheet-subkicker-rule" aria-hidden="true" />
                  PLATE {num} / {TOTAL}
                </p>
                <h3 id={`works-plate-${p.id}`} className="plate-title big-shoulder">
                  <span className="plate-title-line">
                    <span className="plate-title-inner">
                      {p.title}
                      <span className="plate-dot">.</span>
                    </span>
                  </span>
                </h3>

                <p className="plate-outcome oswald">{p.outcome}</p>

                {/* Title block — the drawing's metadata table. */}
                <dl className="plate-block iceland">
                  {BLOCK_ROWS.map((row) => (
                    <div key={row.label} className="plate-block-row">
                      <dt>{row.label}</dt>
                      <dd>
                        {row.get(p).map((item) => (
                          <span key={item} className="plate-block-item">
                            {item}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="plate-link-row">
                  <Link
                    to={`/projects#${p.id}`}
                    className="sheet-link"
                    aria-label={`${p.short} — project details`}
                  >
                    Project Details
                  </Link>
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <SheetEndcap to="/projects" label="All Projects" ariaLabel="View all projects" />
    </section>
  );
};

export default SelectedWorks;
