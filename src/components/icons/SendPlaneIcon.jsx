import { m } from 'motion/react';
import { springs, delays, accentStroke } from './motionTokens';

// Single source of truth for the launch. The plane's hover rotation, its
// travel vector, and the wake dashes all derive from this angle, so
// retuning it (or the travel distances) re-aims everything together — the
// wake can never drift off the flight axis.
const LAUNCH_ANGLE = -10; // degrees; negative pitches the nose up
const HOVER_DIST = 3.5;
const PRESS_DIST = 6.4;

const rad = (LAUNCH_ANGLE * Math.PI) / 180;
const u = { x: Math.cos(rad), y: Math.sin(rad) }; // unit vector along the flight axis
const n = { x: -u.y, y: u.x }; // perpendicular to it, positive = underside
const travel = (d) => ({ x: d * u.x, y: d * u.y });

const planeVariants = {
  rest: { x: 0, y: 0, rotate: 0, transition: springs.firm },
  hover: { ...travel(HOVER_DIST), rotate: LAUNCH_ANGLE, transition: springs.settle },
  // extra pitch on press; momentum stays on the axis
  press: { ...travel(PRESS_DIST), rotate: LAUNCH_ANGLE - 4, transition: springs.settle },
};

// Trail dashes start displaced along the flight axis and settle back into
// place, staggered, so they read as being left behind.
const trailVariants = (i) => ({
  rest: { opacity: 0, ...travel(HOVER_DIST), transition: springs.firm },
  hover: { opacity: 0.85, x: 0, y: 0, transition: { ...springs.settle, delay: i * delays.trail } },
  press: { opacity: 1, ...travel(-1), transition: { ...springs.settle, delay: i * delays.trail } },
});

// Wake layout. TAIL is the wake's reference point mid-notch; TAIL_DEPTH
// is the axial distance from there to the dart's rearmost edge (x=2), so
// clearance is measured from the actual silhouette, not the notch center.
const TAIL = { x: 4, y: 12 };
const TAIL_DEPTH = TAIL.x - 2;

// Daylight between the tail tips and the leading dash, along the flight
// axis. Balancing act: after subtracting the round line caps this nets
// ~1.8 units of true daylight — ~1.2px at 1em, so it survives
// antialiasing, while staying small enough that the wake still trails
// the plane instead of floating detached. Survives retuning of angle or
// travel distances.
const WAKE_CLEARANCE = 2.8;

// Dashes relative to the cleared wake origin: `back` further along the
// axis away from the plane, `side` off-axis (positive = underside),
// `len` units long. Fan layout — one dash near the axis, one flanker per
// side — with `side` values holding at least 1.5 units of edge-to-edge
// daylight beyond the accent stroke width, so the marks stay three
// distinct dashes instead of fusing at small sizes.
const DASHES = [
  { back: 0, side: 0.5, len: 3.5 },
  { back: 2, side: 3.8, len: 2 },
  { back: 1.2, side: -3, len: 2 },
];
const trailPath = ({ back, side, len }) => {
  const behind = TAIL_DEPTH + WAKE_CLEARANCE + back;
  const ex = TAIL.x + (HOVER_DIST - behind) * u.x + side * n.x;
  const ey = TAIL.y + (HOVER_DIST - behind) * u.y + side * n.y;
  return `M${(ex - len * u.x).toFixed(2)} ${(ey - len * u.y).toFixed(2)} ${ex.toFixed(2)} ${ey.toFixed(2)}`;
};

/**
 * Signature icon for "Send Message": a paper plane that pitches up and
 * lifts along its flight axis on hover/focus, leaving staggered wake
 * dashes on that same axis, and launches further on press. Parts carry
 * variants only — state arrives via propagation from the ScanButton
 * motion parent.
 */
const SendPlaneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    style={{ overflow: 'visible' }}
    aria-hidden="true"
  >
    {DASHES.map((dash, i) => (
      <m.path
        key={i}
        d={trailPath(dash)}
        fill="none"
        stroke="currentColor"
        strokeWidth={accentStroke}
        strokeLinecap="round"
        variants={trailVariants(i)}
      />
    ))}
    {/* plane */}
    <m.path d="M22 12 L2 3.5 L5.5 12 L2 20.5 Z" variants={planeVariants} />
  </svg>
);

export default SendPlaneIcon;
