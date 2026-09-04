import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Entrance for a SheetHeader (SheetHeader.jsx): the kicker rises, the title
 * slides up through its mask (the hero name's move), the rule draws
 * left-to-right. Takes the header element rather than selector text so two
 * sheets on one page can never resolve to each other's header. Call inside
 * the owning section's gsap.context so the revert cleans it up.
 *
 * Lives apart from the component so SheetHeader.jsx stays a components-only
 * module (Fast Refresh).
 */
export const playSheetHeader = (header) => {
  const q = gsap.utils.selector(header);
  return gsap
    .timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: { trigger: header, start: 'top 75%', once: true },
    })
    .fromTo(q('.sheet-kicker'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0)
    .fromTo(
      q('.sheet-title-inner'),
      { yPercent: 112 },
      { yPercent: 0, duration: 0.95, ease: 'power4.out' },
      0.1
    )
    .fromTo(q('.sheet-rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, 0.3);
};

/**
 * Entrance for a SheetEndcap (SheetEndcap.jsx): the label rises, then its
 * dimension line measures out from the label to both edges (segment origins
 * are set in sheet.css). Same element-not-selector contract as above.
 */
export const playSheetEndcap = (endcap) => {
  const q = gsap.utils.selector(endcap);
  return gsap
    .timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: { trigger: endcap, start: 'top 88%', once: true },
    })
    .fromTo(q('.sheet-endcap-link'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0)
    .fromTo(q('.sheet-endcap-rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, 0.1);
};
