import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './sheet.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Sheet note — a quote set between sheets as a moment of its own: the footer
 * quote's Oswald sentence-case voice at display size, inside the site's
 * bracket frame, hung on leader lines that run from the sheet above to the
 * sheet below so it reads as attached. Accent only on the attribution.
 *
 * Renders the finished frame. Entrance: the leaders draw toward the note,
 * then the frame rises in — skipped entirely under reduced motion.
 */
const SheetNote = ({ attribution, children }) => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);
      gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: rootRef.current, start: 'top 85%', once: true },
        })
        .fromTo(q('.sheet-note-leader'), { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
        .fromTo(q('.sheet-note-frame'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.55 }, 0.3);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <aside ref={rootRef} className="sheet-note">
      <span className="sheet-note-leader sheet-note-leader--top" aria-hidden="true" />
      <div className="sheet-note-frame border-scan">
        <p className="sheet-note-text oswald">
          {children}
          {attribution && <span className="sheet-note-attr iceland">— {attribution}</span>}
        </p>
      </div>
      <span className="sheet-note-leader sheet-note-leader--bottom" aria-hidden="true" />
    </aside>
  );
};

export default SheetNote;
