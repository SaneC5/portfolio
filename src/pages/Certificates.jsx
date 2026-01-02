import React, { useState, useEffect, useRef } from 'react';
import PgCertificate from '../assets/img/certificates/PgConv.jpg';
import EstplIntern from '../assets/img/certificates/EstplInternship.jpg';
import EstplPerformance from '../assets/img/certificates/EstplPerformance.jpg';
import EstplKondaji from '../assets/img/certificates/EsptlKondaji.jpg';
import SachiTech from '../assets/img/certificates/SachiTech.png';
import GuviCertificate from '../assets/img/certificates/GuviCertification.png';
import iprEvent from '../assets/img/certificates/IPR_EVENT.png';
import CProgramming from '../assets/img/certificates/Ccertificate.png';
import EthicalHacking from '../assets/img/certificates/Ethical_hacking_MP_and_NA-1.png';
import EthicalHackingIntro from '../assets/img/certificates/Introduction to Ethical hacking-1.png';
import CloudFoundation from '../assets/img/certificates/Cloud Foundation-1.png';
import CloudComputingArch from '../assets/img/certificates/Cloud Computing Architecture-1.png';
import CProgBegin from '../assets/img/certificates/C for Beginner-1.png';

const CERTIFICATE_IMAGES = [
  { id: 'c13', src: PgCertificate, alt: 'Post Graduate Convocation Certificate' },
  { id: 'c12', src: EstplIntern, alt: 'ESTPL Internship Completion Certificate' },
  { id: 'c11', src: EstplPerformance, alt: 'ESTPL Performance Appreciation Certificate' },
  { id: 'c10', src: EstplKondaji, alt: 'Kondaji Chivda Project Certificate' },
  { id: 'c9', src: SachiTech, alt: 'Web Intern Certificate - Sachi Tech' },
  { id: 'c8', src: GuviCertificate, alt: 'Data Science Certificate - GUVI' },
  { id: 'c7', src: iprEvent, alt: 'IPR Awareness Event Certificate' },
  { id: 'c6', src: CProgramming, alt: 'C Programming Certificate' },
  { id: 'c5', src: EthicalHacking, alt: 'Ethical Hacking Certificate' },
  { id: 'c4', src: EthicalHackingIntro, alt: 'Introduction to Ethical Hacking Certificate' },
  { id: 'c3', src: CloudFoundation, alt: 'Cloud Foundation Certificate' },
  { id: 'c2', src: CloudComputingArch, alt: 'Cloud Computing Architecture Certificate' },
  { id: 'c1', src: CProgBegin, alt: 'C Programming for Beginners Certificate' },
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

        {/* image area */}
        <div className="relative bg-black overflow-hidden">
          <img
            src={images[index]?.src}
            alt={images[index]?.alt || `Certificate ${index + 1}`}
            className="w-full max-h-[80vh] object-contain bg-black"
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
const MasonryGrid = ({ images = [], onOpen }) => {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4"
    >
      {images.map((img, i) => (
        <figure
          key={img.id || i}
          className="mb-4 break-inside-avoid overflow-hidden relative group"
        >
          <button
            type="button"
            onClick={() => onOpen(i)}
            className="block w-full text-left"
            aria-label={`Open certificate ${i + 1}`}
            style={{ cursor: 'zoom-in' }}
          >
            <img
              src={img.src}
              alt={img.alt || `Certificate ${i + 1}`}
              loading="lazy"
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300 corner-border"
              // allow different aspect ratios; width is constrained by column; height auto
            />
            {/* overlay when hovered */}
            <div className="absolute inset-0 flex items-end justify-end p-3 pointer-events-none">
              <span className="pointer-events-none text-sm bg-white text-black border-2 px-2 uppercase iceland">View</span>
            </div>
          </button>
        </figure>
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

  const openAt = (idx) => {
    setStartIndex(idx);
    setOpen(true);
  };
  const close = () => setOpen(false);

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
