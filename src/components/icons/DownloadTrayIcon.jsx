import { m } from 'motion/react';
import { springs, delays } from './motionTokens';

const arrowVariants = {
  rest: { y: 0, transition: springs.firm },
  hover: { y: 3.2, transition: springs.settle },
  press: { y: 4.4, transition: springs.settle },
};

// The tray dips just after the arrow arrives — the impact delay is what
// makes it read as a reaction rather than a parallel movement.
const trayVariants = {
  rest: { y: 0, transition: springs.firm },
  hover: { y: 0.7, transition: { ...springs.settle, delay: delays.impact } },
  press: { y: 1.1, transition: { ...springs.settle, delay: delays.impact } },
};

/**
 * Signature icon for "Download My Resume": the arrow drops into the tray
 * with a spring settle on hover/focus, the tray flexes on impact, and a
 * press pushes both deeper. Parts carry variants only — state arrives via
 * propagation from the ScanButton motion parent.
 */
const DownloadTrayIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    style={{ overflow: 'visible' }}
    aria-hidden="true"
  >
    {/* arrow: shaft + head */}
    <m.path d="M9.5 1h5v7.2h5L12 15.5 4.5 8.2h5Z" variants={arrowVariants} />
    {/* tray */}
    <m.path
      d="M1 14h3v3.4a.8.8 0 0 0 .8.8h14.4a.8.8 0 0 0 .8-.8V14h3v4.8a3.2 3.2 0 0 1-3.2 3.2H4.2A3.2 3.2 0 0 1 1 18.8Z"
      variants={trayVariants}
    />
  </svg>
);

export default DownloadTrayIcon;
