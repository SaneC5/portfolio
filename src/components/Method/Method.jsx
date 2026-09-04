import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SheetHeader from '../SheetHeader';
import { playSheetHeader } from '../sheetMotion';
import './Method.css';

gsap.registerPlugin(ScrollTrigger);

// The three phases of a job, in order — the one place on the page where
// sequence carries meaning, so they keep their numbers (in the shared
// sub-kicker, as PHASE 01 / 03). No endcap and no CTA: the footer's
// "FIG. 03 — NEXT STEP / LET'S TALK" reads as the fourth phase.
const PHASES = [
  {
    name: 'DISCOVER & SCOPE',
    body:
      "I start with what the site or product has to do, for whom, and what's already in place. Scope, priorities and an honest estimate come out of that conversation, not before it.",
  },
  {
    name: 'DESIGN & BUILD',
    body:
      'Design and build run together: the interface takes shape in the browser, responsive and accessible from the first cut, so you see it working as it comes together rather than at the end.',
  },
  {
    name: 'SHIP & SUPPORT',
    body:
      'Launch is a handoff, not a goodbye. Deployment, documentation and the first round of fixes are part of the work, and I stay reachable after.',
  },
];

const TOTAL = String(PHASES.length).padStart(2, '0');

const Method = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    // Reduced motion: no entrance, no scrub. Every hidden state below is
    // applied by GSAP, so bailing out here leaves the finished frame — the
    // line fully drawn, every phase in place.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const line = rootRef.current.querySelector('.method-line');

    // Header and phase text: once-only entrances, the page's contract.
    const ctx = gsap.context(() => {
      playSheetHeader(rootRef.current.querySelector('.sheet-header'));

      // On desktop all three phases share one trigger position, so the
      // per-index delay staggers them left to right; on phones each fires at
      // its own position and the delay is imperceptible.
      gsap.utils.toArray(rootRef.current.querySelectorAll('.method-phase')).forEach((phase, i) => {
        const q = gsap.utils.selector(phase);
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            delay: i * 0.12,
            scrollTrigger: { trigger: phase, start: 'top 78%', once: true },
          })
          .fromTo(q('.sheet-subkicker'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0)
          .fromTo(q('.method-name'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55 }, 0.1)
          .fromTo(q('.method-copy'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55 }, 0.2);
      });
    }, rootRef);

    // The line: the page's one scrubbed animation, and reversible like a
    // drawn line should be. Ring 1 draws, segment 1 measures out to ring 2,
    // ring 2 draws, and so on. Segments scale along the line's axis — X in
    // the desktop row, Y down the phone rail — so the timeline is rebuilt
    // per breakpoint via matchMedia, which also reverts cleanly on resize.
    // Rings draw by dashoffset (the hero HUD's mechanic).
    const mm = gsap.matchMedia();
    mm.add({ desktop: '(min-width: 1024px)', phone: '(max-width: 1023px)' }, (mmCtx) => {
      const { desktop } = mmCtx.conditions;
      const axis = desktop ? 'scaleX' : 'scaleY';
      const rings = gsap.utils.toArray(line.querySelectorAll('.method-ring'));
      const segments = gsap.utils.toArray(line.querySelectorAll('.method-segment'));

      rings.forEach((ring) => {
        const len = ring.getTotalLength();
        gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: line,
          start: 'top 80%',
          end: desktop ? 'top 35%' : 'bottom 70%',
          scrub: 0.6,
        },
      });
      rings.forEach((ring, i) => {
        tl.to(ring, { strokeDashoffset: 0, duration: 0.35 });
        if (segments[i]) tl.fromTo(segments[i], { [axis]: 0 }, { [axis]: 1, duration: 1 });
      });
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="method"
      aria-labelledby="method-title"
      className="method sheet mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <SheetHeader index="03" kicker="METHOD" title="How the work runs" id="method-title" />

      {/* One DOM for both orientations: each phase carries its own rail —
          a node ring and the segment running to the next node. The CSS lays
          the rails out as a row across the top on desktop and as a column
          down the left gutter on phones. */}
      <ol className="method-line mt-12 lg:mt-14" aria-label="Phases">
        {PHASES.map((phase, i) => {
          const num = String(i + 1).padStart(2, '0');
          return (
            <li key={phase.name} className="method-phase">
              <div className="method-rail" aria-hidden="true">
                <svg className="method-node" viewBox="0 0 16 16">
                  <circle className="method-ring" cx="8" cy="8" r="6.5" />
                </svg>
                {i < PHASES.length - 1 && <span className="method-segment" />}
              </div>

              <div className="method-body">
                <p className="sheet-subkicker iceland">
                  <span className="sheet-subkicker-rule" aria-hidden="true" />
                  PHASE {num} / {TOTAL}
                </p>
                <h3 className="method-name big-shoulder">{phase.name}</h3>
                <p className="method-copy oswald">{phase.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default Method;
