import { m } from 'motion/react';
import { springs, rattle, delays, accentStroke } from './motionTokens';

const handsetVariants = {
  rest: { rotate: 0, transition: springs.firm },
  hover: { rotate: [0, -12, 10, -8, 6, 0], transition: rattle },
  press: { rotate: [0, -16, 13, -10, 7, 0], transition: rattle },
};

// Sound waves radiate from the handset into the glyph's empty top-right
// quadrant, in sequence.
const arcVariants = (i) => ({
  rest: { opacity: 0, scale: 0.6, transition: springs.firm },
  hover: { opacity: 0.9, scale: 1, transition: { ...springs.settle, delay: i * delays.trail } },
  press: { opacity: 1, scale: 1.08, transition: { ...springs.settle, delay: i * delays.trail } },
});

const ARCS = ['M14.5 5.5a6 6 0 0 1 4 4', 'M15.5 2.5a9.5 9.5 0 0 1 6 6'];

/**
 * Signature icon for "Contact Me": the handset rattles at ring cadence on
 * hover/focus (bursts with a beat of silence between), harder on press,
 * while sound-wave arcs pulse in one after the other. Parts carry variants
 * only — state arrives via propagation from the ScanButton motion parent.
 */
const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    style={{ overflow: 'visible' }}
    aria-hidden="true"
  >
    {/* handset — geometry derived from the Font Awesome Free solid phone
        glyph (CC BY 4.0, already bundled with this site), rescaled to the
        24 grid. The static <g> carries the fit transform so motion's
        animated transform on the path can't overwrite it. */}
    <g transform="translate(2.2 1.8) scale(0.8)">
      <m.path
        d="M7.73 1.15c-.36-.87-1.31-1.34-2.22-1.09l-4.13 1.13C.57 1.42 0 2.16 0 3c0 11.6 9.4 21 21 21 .84 0 1.58-.57 1.81-1.38l1.13-4.13c.25-.91-.22-1.86-1.09-2.22l-4.5-1.88c-.76-.32-1.65-.1-2.17.54L14.28 17.25C10.98 15.69 8.31 13.02 6.75 9.72L9.06 7.83c.64-.53.86-1.41.54-2.17l-1.88-4.5z"
        variants={handsetVariants}
      />
    </g>
    {ARCS.map((d, i) => (
      <m.path
        key={d}
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={accentStroke}
        strokeLinecap="round"
        style={{ originX: 0, originY: 1 }}
        variants={arcVariants(i)}
      />
    ))}
  </svg>
);

export default PhoneIcon;
