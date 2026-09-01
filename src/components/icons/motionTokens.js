// Shared timing for all animated icons so they feel like one family.
// Signature icons must use only `variants` on their parts — an explicit
// `animate` prop severs variant propagation from the ScanButton parent.

export const springs = {
  // Visible settle with a little overshoot — hover choreography.
  settle: { type: 'spring', stiffness: 340, damping: 17 },
  // Quick and firm, no wobble — press states and returns to rest.
  firm: { type: 'spring', stiffness: 520, damping: 32 },
};

export const loading = {
  spin: { repeat: Infinity, ease: 'linear', duration: 0.9 },
  // Reduced-motion loading indicator: opacity pulse instead of rotation.
  pulse: { repeat: Infinity, ease: 'easeInOut', duration: 1.4 },
};

// Oscillation for the phone rattle. A keyframed shake has no spring
// equivalent, so it gets a shared tween timing: one ring burst, a beat
// of silence, repeat while the hover state holds.
export const rattle = { duration: 0.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.9 };

// Choreography offsets: staggered entrances (plane trail, phone arcs)
// and delayed reactions (the tray flexing after the arrow lands).
export const delays = { trail: 0.07, impact: 0.12 };

// ---- Drawing constants (geometry, not motion) ----
// Solid mass is per-drawing and can't be tokenized, but every icon targets
// the same optical box, calibrated against SendPlaneIcon: solid mass
// ~17–19 units tall and ~20–22 wide on the 24 grid, limbs ≥2 units, drawn
// filled at Font Awesome solid weight. Accent strokes (plane trails,
// phone sound arcs) share this width.
export const accentStroke = 1.8;
