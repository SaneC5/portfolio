import { m, useReducedMotion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { springs, loading } from './icons/motionTokens';

// Quiet default for buttons without a signature icon.
const popVariants = {
  rest: { scale: 1, transition: springs.firm },
  hover: { scale: 1.15, transition: springs.settle },
  press: { scale: 0.9, transition: springs.firm },
};

/**
 * Bridge between a button's rest/hover/press state and its icon.
 *
 * `icon` is either a Font Awesome definition (wrapped here with the quiet
 * `pop` variants) or a signature icon component whose internal parts carry
 * their own variants. Either way the state arrives via variant propagation
 * from the motion parent in ScanButton — this component only adds the
 * cross-cutting concerns: `spin` replaces the hover choreography with a
 * loading indicator, and reduced motion pins the subtree to rest (an
 * explicit `animate` blocks propagation below it).
 */
const AnimatedIcon = ({ icon, spin = false }) => {
  const reduceMotion = useReducedMotion();
  const isSignature = typeof icon === 'function';
  const Icon = icon;
  const glyph = isSignature ? <Icon /> : <FontAwesomeIcon icon={icon} />;

  if (spin) {
    return (
      <m.span
        className="inline-flex"
        aria-hidden="true"
        animate={reduceMotion ? { opacity: [1, 0.35, 1] } : { rotate: 360 }}
        transition={reduceMotion ? loading.pulse : loading.spin}
      >
        {glyph}
      </m.span>
    );
  }

  return (
    <m.span
      className="inline-flex"
      aria-hidden="true"
      {...(reduceMotion ? { animate: 'rest' } : {})}
      {...(isSignature ? {} : { variants: popVariants })}
    >
      {glyph}
    </m.span>
  );
};

export default AnimatedIcon;
