import React, { useState, useEffect, useRef, useCallback } from 'react';
import FadeImage from '../components/FadeImage';
import PgCertificate from '../assets/img/certificates/PgConv.webp';
import EstplIntern from '../assets/img/certificates/EstplInternship.webp';
import EstplPerformance from '../assets/img/certificates/EstplPerformance.webp';
import EstplKondaji from '../assets/img/certificates/EsptlKondaji.webp';
import SachiTech from '../assets/img/certificates/SachiTech.webp';
import GuviCertificate from '../assets/img/certificates/GuviCertification.webp';
import iprEvent from '../assets/img/certificates/IPR_EVENT.webp';
import CProgramming from '../assets/img/certificates/Ccertificate.webp';
import EthicalHacking from '../assets/img/certificates/Ethical_hacking_MP_and_NA-1.webp';
import EthicalHackingIntro from '../assets/img/certificates/Introduction to Ethical hacking-1.webp';
import CloudFoundation from '../assets/img/certificates/Cloud Foundation-1.webp';
import CloudComputingArch from '../assets/img/certificates/Cloud Computing Architecture-1.webp';
import CProgBegin from '../assets/img/certificates/C for Beginner-1.webp';
import ClaudeCode from '../assets/img/certificates/claude-code.webp';
import ClaudeMcp from '../assets/img/certificates/claude-mcp.webp';
import ClaudeAgentSkills from '../assets/img/certificates/claude-intro-agent-skill.webp';
import ClaudeAnthropicApi from '../assets/img/certificates/claude-with-anthropic-api.webp';

// width/height are the intrinsic pixel dimensions of each file, so the browser
// can reserve the correct aspect ratio before the image loads (CLS fix).
const CERTIFICATE_IMAGES = [
  { id: 'c17', src: ClaudeCode, alt: 'Claude Code in Action Certificate - Anthropic', width: 1182, height: 913 },
  { id: 'c16', src: ClaudeMcp, alt: 'Introduction to Model Context Protocol Certificate - Anthropic', width: 1182, height: 913 },
  { id: 'c15', src: ClaudeAgentSkills, alt: 'Introduction to Agent Skills Certificate - Anthropic', width: 1183, height: 915 },
  { id: 'c14', src: ClaudeAnthropicApi, alt: 'Claude with the Anthropic API Certificate - Anthropic', width: 1183, height: 915 },
  { id: 'c13', src: PgCertificate, alt: 'Post Graduate Convocation Certificate', width: 3072, height: 4053 },
  { id: 'c12', src: EstplIntern, alt: 'ESTPL Internship Completion Certificate', width: 3072, height: 4014 },
  { id: 'c11', src: EstplPerformance, alt: 'ESTPL Performance Appreciation Certificate', width: 2654, height: 3499 },
  { id: 'c10', src: EstplKondaji, alt: 'Kondaji Chivda Project Certificate', width: 2603, height: 3595 },
  { id: 'c9', src: SachiTech, alt: 'Web Intern Certificate - Sachi Tech', width: 1654, height: 2339 },
  { id: 'c8', src: GuviCertificate, alt: 'Data Science Certificate - GUVI', width: 1890, height: 1261 },
  { id: 'c7', src: iprEvent, alt: 'IPR Awareness Event Certificate', width: 2339, height: 1653 },
  { id: 'c6', src: CProgramming, alt: 'C Programming Certificate', width: 2682, height: 1886 },
  { id: 'c5', src: EthicalHacking, alt: 'Ethical Hacking Certificate', width: 2339, height: 1653 },
  { id: 'c4', src: EthicalHackingIntro, alt: 'Introduction to Ethical Hacking Certificate', width: 2339, height: 1653 },
  { id: 'c3', src: CloudFoundation, alt: 'Cloud Foundation Certificate', width: 2339, height: 1653 },
  { id: 'c2', src: CloudComputingArch, alt: 'Cloud Computing Architecture Certificate', width: 2339, height: 1653 },
  { id: 'c1', src: CProgBegin, alt: 'C Programming for Beginners Certificate', width: 2339, height: 1653 },
];

const IconLeft = (props) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden width="20" height="20" {...props}>
    <path d="M12 16L6 10l6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconRight = (props) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden width="20" height="20" {...props}>
    <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------------------
   Lightbox modal
   --------------------- */
const Lightbox = ({ open, images = [], startIndex = 0, onClose }) => {
  const [index, setIndex] = useState(startIndex || 0);
  const prevActiveEl = useRef(null);

  useEffect(() => {
    if (open) {
      prevActiveEl.current = document.activeElement;
      setIndex(startIndex || 0);
      document.body.style.overflow = 'hidden'; // lock scroll
    } else {
      document.body.style.overflow = '';
      prevActiveEl.current?.focus?.();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, startIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, images]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Certificate preview"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
    >
      <div className="relative w-full max-w-5xl mx-auto corner-border">
        {/* close */}
        <button
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-3 right-3 z-30 rounded-md bg-white text-black p-1 border-2 py-[2px] px-[8px] hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          ✕
        </button>

        {/* image area — fixed height so the frame never resizes between slides */}
        <div className="relative bg-black overflow-hidden">
          <FadeImage
            key={images[index]?.src}
            src={images[index]?.src}
            alt={images[index]?.alt || `Certificate ${index + 1}`}
            width={images[index]?.width}
            height={images[index]?.height}
            className="w-full h-[80vh] object-contain bg-black"
            loading="eager"
          />

          {/* prev */}
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md bg-white text-black p-1 border-2 hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <IconLeft />
          </button>

          {/* next */}
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-white text-black p-1 border-2 hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <IconRight />
          </button>

          {/* counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md text-black text-sm px-3 py-1 border-3 bg-white">
            {index + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------
   MasonryGrid component using CSS columns
   - responsive: columns controlled via Tailwind columns-*
   - items use break-inside-avoid to prevent splitting
   --------------------- */
const MasonryItem = React.memo(({ img, index, onOpen }) => {
  // Tint the reserved box only while the image loads, so the final look is unchanged.
  const [loaded, setLoaded] = useState(false);

  return (
    <figure
      className={`mb-4 break-inside-avoid overflow-hidden relative group ${loaded ? '' : 'bg-white/5'}`}
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="block w-full text-left"
        aria-label={`Open certificate ${index + 1}`}
        style={{ cursor: 'zoom-in' }}
      >
        <FadeImage
          src={img.src}
          alt={img.alt || `Certificate ${index + 1}`}
          width={img.width}
          height={img.height}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="w-full h-auto object-cover transform group-hover:scale-105 corner-border"
          // allow different aspect ratios; width is constrained by column; height auto
        />
        {/* overlay when hovered */}
        <div className="absolute inset-0 flex items-end justify-end p-3 pointer-events-none">
          <span className="pointer-events-none text-sm bg-white text-black border-2 px-2 uppercase iceland">View</span>
        </div>
      </button>
    </figure>
  );
});

const MasonryGrid = ({ images = [], onOpen }) => {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4"
    >
      {images.map((img, i) => (
        <MasonryItem key={img.id || i} img={img} index={i} onOpen={onOpen} />
      ))}
    </div>
  );
};

/* ---------------------
   Certificates page
   --------------------- */
const Certificates = ({ images = CERTIFICATE_IMAGES }) => {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  // Stable references so the memoized masonry items don't re-render when the
  // lightbox opens/closes.
  const openAt = useCallback((idx) => {
    setStartIndex(idx);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="max-w-[1600px] mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
      <h2 className="w-70 text-4xl md:text-5xl font-extrabold text-black text-center bg-white px-4 py-2 mx-auto mb-7 uppercase big-shoulder">Certificates</h2>

        {/* Masonry grid */}
        <MasonryGrid images={images} onOpen={openAt} />

        {/* Lightbox */}
        <Lightbox open={open} images={images} startIndex={startIndex} onClose={close} />
      </div>
    </div>
  );
};

export default Certificates;
