import { m } from 'motion/react';
import { springs } from './motionTokens';

const lidVariants = {
  rest: { rotate: 0, transition: springs.firm },
  hover: { rotate: -14, transition: springs.settle },
  press: { rotate: -22, transition: springs.settle },
};

/**
 * Signature icon for "Discover My Creations": a briefcase whose lid
 * (handle riding along) hinges open from the left end of the seam on
 * hover/focus, and swings wider on press. Parts carry variants only —
 * state arrives via propagation from the ScanButton motion parent.
 */
const BriefcaseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    style={{ overflow: 'visible' }}
    aria-hidden="true"
  >
    {/* body */}
    <path d="M1 12h22v6.4a2.6 2.6 0 0 1-2.6 2.6H3.6A2.6 2.6 0 0 1 1 18.4Z" />
    {/* lid + handle, hinged at the bottom-left of the group's box */}
    <m.g variants={lidVariants} style={{ originX: 0, originY: 1 }}>
      <path d="M3.6 6.6h16.8a2.6 2.6 0 0 1 2.6 2.6v2H1v-2a2.6 2.6 0 0 1 2.6-2.6Z" />
      <path d="M10.4 2.6h3.2a2 2 0 0 1 2 2v2h-2V5a.5.5 0 0 0-.5-.5h-2.2a.5.5 0 0 0-.5.5v1.6h-2v-2a2 2 0 0 1 2-2Z" />
    </m.g>
  </svg>
);

export default BriefcaseIcon;
