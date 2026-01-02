import React, { useState, useRef, useEffect } from 'react';

// importing spenca website image
import SpencaImg1 from '../assets/img/projects/spenca-1.png';
import SpencaImg2 from '../assets/img/projects/spenca-2.png';
import SpencaImg3 from '../assets/img/projects/spenca-3.png';
import SpencaImg4 from '../assets/img/projects/spenca-4.png';
import SpencaImg5 from '../assets/img/projects/spenca-5.png';
// importing Skycab website image
import SkyCabImg1 from '../assets/img/projects/skycab-1.png';
import SkyCabImg2 from '../assets/img/projects/skycab-2.png';
import SkyCabImg3 from '../assets/img/projects/skycab-3.png';
import SkyCabImg4 from '../assets/img/projects/skycab-4.png';
// importing Piano web image
import PianoImg1 from '../assets/img/projects/piano-1.png';
import PianoImg2 from '../assets/img/projects/piano-2.png';
import PianoImg3 from '../assets/img/projects/piano-3.mp4';
// importing Age Calculator web image
import AgeCalImg1 from '../assets/img/projects/agecal-1.png';
import AgeCalImg2 from '../assets/img/projects/agecal-2.mp4';
// importing Dice Game website image
import DiceGameImg1 from '../assets/img/projects/dice-1.png';
import DiceGameImg2 from '../assets/img/projects/dice-2.png';
import DiceGameImg3 from '../assets/img/projects/dice-3.mp4';
// importing Music Background web image
import MusicBgImg1 from '../assets/img/projects/musicbg-1.png';
import MusicBgImg2 from '../assets/img/projects/musicbg-2.png';
import MusicBgImg3 from '../assets/img/projects/musicbg-3.mp4';
import MusicBgImg4 from '../assets/img/projects/musicbg-4.png';
// importing Search Movie web image
import MovieDbImg1 from '../assets/img/projects/movieDb-1.png';
import MovieDbImg2 from '../assets/img/projects/movieDb-2.png';
// importing ESTPL website image
import estplImg1 from '../assets/img/projects/estpl-1.png';
import estplImg2 from '../assets/img/projects/estpl-2.png';
import estplImg3 from '../assets/img/projects/estpl-3.mp4';
// importing Kondaji website image
import KondajiImg1 from '../assets/img/projects/Kondaji-1.png';
import KondajiImg2 from '../assets/img/projects/Kondaji-2.png';
import KondajiImg3 from '../assets/img/projects/Kondaji-3.png';
import KondajiImg4 from '../assets/img/projects/Kondaji-4.png';
import KondajiImg5 from '../assets/img/projects/Kondaji-5.png';
import KondajiImg6 from '../assets/img/projects/Kondaji-6.png';
import KondajiImg7 from '../assets/img/projects/Kondaji-7.png';
import KondajiImg8 from '../assets/img/projects/Kondaji-8.png';
import KondajiImg9 from '../assets/img/projects/Kondaji-9.png';
import KondajiImg10 from '../assets/img/projects/Kondaji-10.mp4';
// importing Zylyn website image
import ZylynImg1 from '../assets/img/projects/zylyn-1.png';
import ZylynImg2 from '../assets/img/projects/zylyn-2.png';
import ZylynImg3 from '../assets/img/projects/zylyn-3.png';
// importing Automated calling image
import AiCallingImg1 from '../assets/img/projects/aiCalling-1.png';
import AiCallingImg2 from '../assets/img/projects/aiCalling-2.png';
import AiCallingImg3 from '../assets/img/projects/aiCalling-3.png';
// importing MPDC website image
import MPDCImg1 from '../assets/img/projects/mpdc-1.png';
import MPDCImg2 from '../assets/img/projects/mpdc-2.png';
import MPDCImg3 from '../assets/img/projects/mpdc-3.png';
// importing Funndrive website image
import FunndriveImg1 from '../assets/img/projects/funDrive-1.png';
import FunndriveImg2 from '../assets/img/projects/funDrive-2.png';
import FunndriveImg3 from '../assets/img/projects/funDrive-3.png';
import FunndriveImg4 from '../assets/img/projects/funDrive-4.png';
// importing Personal website image
import PortfolioImg1 from '../assets/img/projects/porfolio-1.png';
import PortfolioImg2 from '../assets/img/projects/porfolio-2.png';
import PortfolioImg3 from '../assets/img/projects/porfolio-3.png';
import PortfolioImg4 from '../assets/img/projects/porfolio-4.png';
import PortfolioImg5 from '../assets/img/projects/porfolio-5.png';

// Sample projects data — replace  paths and URLs with your real project assets
const MY_PROJECTS = [
  {
    id: 'p14',
    title: 'Personal Portfolio',
    type: 'Portfolio Website',
    builtWith: 'React (Vite), Tailwind CSS, GSAP, Express.js, Node.js',
    liveUrl: 'https://portfolio-4h0m.onrender.com/',
    description: 'Personal Portfolio is a modern, animated showcase featuring projects, certificates, and contact sections. Built with React and Vite for optimal performance, styled with Tailwind CSS, enhanced with GSAP animations, and integrated with Node.js backend for contact form submissions.',
    media: [
      { type: 'image', src: PortfolioImg1 },
      { type: 'image', src: PortfolioImg2 },
      { type: 'image', src: PortfolioImg3 },
      { type: 'image', src: PortfolioImg4 },
      { type: 'image', src: PortfolioImg5 },
    ],
  },
  {
    id: 'p13',
    title: 'Funndrive - Car Rental',
    type: 'Rental Service Website',
    builtWith: 'HTML, CSS, Bootstrap, JavaScript',
    liveUrl: 'https://www.funndrive.com/',
    description: 'Funndrive is a Goa-based car and yacht rental platform featuring comprehensive vehicle listings with automated WhatsApp booking integration. Includes blog section, direct call-to-action buttons, and auto-generated messages with selected vehicle details for seamless customer communication.',
    media: [
      { type: 'image', src: FunndriveImg1 },
      { type: 'image', src: FunndriveImg2 },
      { type: 'image', src: FunndriveImg3 },
      { type: 'image', src: FunndriveImg4 },
    ],
  },
  {
    id: 'p12',
    title: 'Mill Plain Dental Center',
    type: 'WordPress Website',
    builtWith: 'WordPress, HTML, JavaScript, Node.js, Express.js, MySQL',
    liveUrl: 'https://millplaindentalcenter.com/',
    description: 'Mill Plain Dental Center is a professional dental practice website built on WordPress with custom form integration. Features comprehensive practice information, services showcase, and custom-built backend using Node.js and MySQL for secure patient inquiry management.',
    media: [
      { type: 'image', src: MPDCImg1 },
      { type: 'image', src: MPDCImg2 },
      { type: 'image', src: MPDCImg3 },
    ],
  },
  {
    id: 'p11',
    title: 'AI Automation Calling System',
    type: 'AI Workflow Automation',
    builtWith: 'Make.com, Retell AI, Google Sheets, Cal.com',
    liveUrl: null,
    description: 'AI Automation Calling System integrates Retell AI with Google Sheets via Make.com for automated outbound calls. Features AI-powered conversational agents, automatic meeting scheduling through Cal.com, and real-time call summary storage for streamlined communication workflows.',
    media: [
      { type: 'image', src: AiCallingImg1 },
      { type: 'image', src: AiCallingImg2 },
      { type: 'image', src: AiCallingImg3 },
    ],
  },
  {
    id: 'p10',
    title: 'Zylyn - Accessibility Checker',
    type: 'Full-Stack Web Application',
    builtWith: 'HTML, CSS, Bootstrap, JavaScript, Node.js, Express.js, SQL',
    liveUrl: 'https://zylyn.co/',
    description: 'Zylyn is a web accessibility auditing tool that scans any URL for WCAG compliance violations. Features automated accessibility testing, detailed violation reports with severity scores, and database integration for scan history tracking using full-stack architecture.',
    media: [
      { type: 'image', src: ZylynImg1 },
      { type: 'image', src: ZylynImg2 },
      { type: 'image', src: ZylynImg3 },
    ],
  },
  {
    id: 'p9',
    title: 'Kondaji Chivda',
    type: 'Full-Stack E-Commerce Website',
    builtWith: 'HTML, CSS, Bootstrap, JavaScript, Node.js, Express.js, SQL',
    liveUrl: 'https://kondajichivda.shop/',
    description: 'Kondaji Chivda is a complete e-commerce platform featuring product catalog, shopping cart, order management, and comprehensive admin panel. Built with full-stack architecture using Node.js backend, SQL database, and responsive frontend for seamless online shopping experience.',
    media: [
      { type: 'image', src: KondajiImg1 },
      { type: 'image', src: KondajiImg2 },
      { type: 'image', src: KondajiImg3 },
      { type: 'image', src: KondajiImg4 },
      { type: 'image', src: KondajiImg5 },
      { type: 'image', src: KondajiImg6 },
      { type: 'image', src: KondajiImg7 },
      { type: 'image', src: KondajiImg8 },
      { type: 'image', src: KondajiImg9 },
      { type: 'video', src: KondajiImg10 },
    ],
  },
  {
    id: 'p8',
    title: 'ESTPL - IT Company',
    type: 'Concept Corporate Website',
    builtWith: 'HTML, CSS, Bootstrap',
    liveUrl: null,
    description: 'ESTPL is a modern corporate website featuring dynamic typing animations, interactive cube boxes with hover color transitions, and animated team section with sequential social media icon reveals. Built with Bootstrap for responsive design and smooth user experience.',
    media: [
      { type: 'image', src: estplImg1 },
      { type: 'image', src: estplImg2 },
      { type: 'video', src: estplImg3 },
    ],
  },
  {
    id: 'p7',
    title: 'Movie Search App',
    type: 'Interactive Web Application',
    builtWith: 'HTML, CSS, JavaScript, OMDb API',
    liveUrl: 'https://sanec5.github.io/search-movie/',
    description: 'Movie Search App is a dynamic web application utilizing OMDb API to search and display movie information. Features include real-time search, detailed movie pages with ratings and cast, localStorage for search history, and a responsive grid layout.',
    media: [
      { type: 'image', src: MovieDbImg1 },
      { type: 'image', src: MovieDbImg2 },
    ],
  },
  {
    id: 'p6',
    title: 'Music Player',
    type: 'Interactive Web Application',
    builtWith: 'HTML, CSS, JavaScript, Web Audio API',
    liveUrl: 'https://sanec5.github.io/bg-music/',
    description: 'Music Player is a feature-rich web application with real-time audio visualization using Web Audio API. Includes playlist controls, keyboard shortcuts, volume adjustment, theme toggle, and animated equalizer bars with peak-hold effects and mirror reflections.',
    media: [
      { type: 'image', src: MusicBgImg1 },
      { type: 'image', src: MusicBgImg2 },
      { type: 'video', src: MusicBgImg3 },
      { type: 'image', src: MusicBgImg4 },
    ],
  },
  {
    id: 'p5',
    title: 'Dice Game',
    type: 'Interactive Web Game',
    builtWith: 'HTML, CSS, JavaScript, jQuery',
    liveUrl: 'https://sanec5.github.io/dice-game/',
    description: 'Dice Game is a two-player web game featuring animated dice rolls with shake and jump effects. Players click to roll, and the winner is instantly determined with vibrant neon styling and sound effects for an engaging experience.',
    media: [
      { type: 'image', src: DiceGameImg1 },
      { type: 'image', src: DiceGameImg2 },
      { type: 'video', src: DiceGameImg3 },
    ],
  },
  {
    id: 'p4',
    title: 'Age Calculator',
    type: 'Interactive Web Application',
    builtWith: 'HTML, CSS, JavaScript, jQuery',
    liveUrl: 'https://sanec5.github.io/age-calculator/',
    description: 'Age Calculator is an immersive web application featuring animated starry skies and falling comets. Users enter their birthdate to receive precise age calculations with personalized life-stage messages in a beautifully crafted cosmic interface.',
    media: [
      { type: 'image', src: AgeCalImg1 },
      { type: 'video', src: AgeCalImg2 },
    ],
  },
  {
    id: 'p3',
    title: 'Virtual Piano',
    type: 'Interactive Web Application',
    builtWith: 'HTML, CSS, JavaScript, jQuery',
    liveUrl: 'https://sanec5.github.io/piano/',
    description: 'Virtual Piano – Interactive Music Application is a responsive web experience featuring a two-octave keyboard. Users can play notes via clicks or keyboard keys, while animated musical symbols enhance the visual feedback for an engaging, immersive experience.',
    media: [
      { type: 'image', src: PianoImg1 },
      { type: 'image', src: PianoImg2 },
      { type: 'video', src: PianoImg3 },
    ],
  },
  {
    id: 'p2',
    title: 'SkyCab Booking',
    type: 'Concept Brand Website',
    builtWith: 'HTML, CSS, Bootstrap',
    liveUrl: 'https://sanec5.github.io/SkyCab/',
    description:
      'Skycab - Cab Service Website is a modern, responsive single-page website designed to showcase a reliable cab service. The project focuses on clean visuals, smooth navigation, and a user-friendly interface that reflects efficiency, convenience, and trustworthiness.',
    media: [
      { type: 'image', src: SkyCabImg1 },
      { type: 'image', src: SkyCabImg2 },
      { type: 'image', src: SkyCabImg3 },
      { type: 'image', src: SkyCabImg4 },
    ],
  },
  {
    id: 'p1',
    title: 'Spenca - Mineral Water',
    type: 'Concept Brand Website',
    builtWith: 'HTML, CSS, Bootstrap',
    liveUrl: 'https://sanec5.github.io/spenca/',
    description:
      'Spenca – Mineral Water Website is a modern, responsive web experience designed to represent a premium bottled water brand. The project focuses on clean visuals, smooth animations, and a fresh UI that reflects purity, health, and trust.',
    media: [
      { type: 'image', src: SpencaImg1 },
      { type: 'image', src: SpencaImg2 },
      { type: 'image', src: SpencaImg3 },
      { type: 'image', src: SpencaImg4 },
      { type: 'image', src: SpencaImg5 },
    ],
  },
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

const IconPlus = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Helper function to determine if media is video
const isVideo = (src) => {
  if (typeof src === 'string') {
    return /\.(mp4|webm|ogg|mov)$/i.test(src);
  }
  return false;
};

// MediaRenderer component - renders either image or video
const MediaRenderer = ({ media, alt = "Project media", className, controls = false, autoPlay = false, loading = "lazy" }) => {
  const src = typeof media === 'string' ? media : media?.src;
  const type = typeof media === 'object' && media?.type ? media.type : (isVideo(src) ? 'video' : 'image');

  if (type === 'video') {
    return (
      <video
        src={src}
        className={className}
        controls={controls}
        autoPlay={autoPlay}
        loop
        muted
        playsInline
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
    />
  );
};

/* ---------------------
   LightboxModal
   --------------------- */
const LightboxModal = ({ open, onClose, media = [], startIndex = 0 }) => {
  const [index, setIndex] = useState(startIndex);
  const modalRef = useRef(null);
  const prevActiveEl = useRef(null);

  useEffect(() => {
    if (open) {
      prevActiveEl.current = document.activeElement;
      setIndex(startIndex);
      // focus modal
      setTimeout(() => modalRef.current?.focus(), 0);
      // lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      // restore scroll & focus
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
  }, [open, index]);

  const prev = () => setIndex((i) => (i - 1 + media.length) % media.length);
  const next = () => setIndex((i) => (i + 1) % media.length);

  if (!open) return null;

  return (
    // overlay
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
      tabIndex={-1}
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
    >
      <div className="relative w-full max-w-5xl mx-auto corner-border">
        {/* close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-30 rounded-md border-2 bg-white hover:scale-105 transition-transform duration-300 text-black py-[2px] px-[8px] cursor-pointer"
        >
          ✕
        </button>

        {/* image area */}
        <div className="relative bg-black overflow-hidden">
          <MediaRenderer
            media={media[index]}
            alt={`Preview ${index + 1}`}
            className="w-full h-[66vh] object-contain bg-black"
            controls={true}
            loading="eager"
          />

          {/* left arrow */}
          <button
            aria-label="Previous Media"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md border-2 bg-white hover:scale-105 transition-transform duration-300 text-black p-1 cursor-pointer"
          >
            <IconLeft />
          </button>

          {/* right arrow */}
          <button
            aria-label="Next Media"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border-2 bg-white hover:scale-105 transition-transform duration-300 text-black p-1 cursor-pointer"
          >
            <IconRight />
          </button>

          {/* small counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md text-black border-3 text-sm px-3 py-1 bg-white">
            {index + 1} / {media.length}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------
   MediaSlider (card-level)
   - shows single image at a time
   - left/right arrows and + (open) icon
   - keeps its own index state
   --------------------- */
const MediaSlider = ({ media = [], onOpen }) => {
  const [idx, setIdx] = useState(0);

  const prev = (e) => {
    e?.stopPropagation();
    setIdx((i) => (i - 1 + media.length) % media.length);
  };
  const next = (e) => {
    e?.stopPropagation();
    setIdx((i) => (i + 1) % media.length);
  };

  return (
    <div className="relative bg-gray-50 overflow-hidden">
      <div className="w-full h-60 sm:h-62 md:h-60 lg:h-66 relative bg-gray-100 flex items-center justify-center">
        <MediaRenderer
          media={media[idx]}
          alt={`Project image ${idx + 1}`}
          className="w-full h-full object-cover"
          controls={false}
          autoPlay={true}
          loading="lazy"
        />

        {/* left arrow */}
        <button
          onClick={prev}
          aria-label="Previous media"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-white border-2 hover:bg-white hover:scale-105 transition-transform duration-300 p-1 shadow cursor-pointer"
        >
          <IconLeft />
        </button>

        {/* right arrow */}
        <button
          onClick={next}
          aria-label="Next media"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-white border-2 hover:scale-105 transition-transform duration-300 p-1 shadow cursor-pointer"
        >
          <IconRight />
        </button>

        {/* plus icon (open lightbox) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(idx);
          }}
          aria-label="Open larger view"
          className="absolute right-3 top-3 rounded-md bg-white border-2 hover:scale-105 transition-transform duration-300 p-1 shadow cursor-pointer"
        >
          <IconPlus />
        </button>
      </div>

      {/* small thumbnails strip (optional) */}
      {media.length > 1 && (
        <div className="px-3 py-2 bg-black border-t flex items-center gap-2 overflow-x-auto">
          {media.map((item, i) => {
            const src = typeof item === 'string' ? item : item?.src;
            const type = typeof item === 'object' && item?.type ? item.type : (isVideo(src) ? 'video' : 'image');

            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`relative w-14 h-10 overflow-hidden border ${i === idx ? 'ring-2 ring-white' : 'opacity-80'}`}
                aria-label={`Show ${type} ${i + 1}`}
              >
                {type === 'video' ? (
                  <>
                    <video src={src} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5 3.5v9l7-4.5-7-4.5z"/>
                      </svg>
                    </div>
                  </>
                ) : (
                  <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ---------------------
   ProjectCard
   --------------------- */
const ProjectCard = ({ project, onOpenLightbox }) => {
  return (
    <article className="bg-black corner-border shadow-sm hover:shadow-md overflow-hidden flex flex-col">
      <MediaSlider media={project.media} onOpen={(startIndex) => onOpenLightbox(project.media, startIndex)} />

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-3 justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white uppercase big-shoulder">{project.title}</h3>
            <p className="text-sm text-gray-100 iceland">{project.type}</p>
          </div>

          <div className="ml-4 border-scan self-start">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-black text-sm iceland font-bold uppercase hover:opacity-95"
                aria-label={`View live site for ${project.title}`}
              >
                View Live
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-black text-sm iceland font-bold uppercase hover:opacity-95">Not Live</span>
            )}
          </div>
        </div>

        <p className="mt-4 text-lg leading-tight text-gray-100 iceland flex-1">{project.description}</p>

        <div className="mt-4 text-sm text-gray-400 iceland">Built with: <span className="text-gray-600">{project.builtWith}</span></div>
      </div>
    </article>
  );
};

/* ---------------------
   Projects page (default export)
   --------------------- */
const Projects = ({ projects = MY_PROJECTS }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState([]);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  const openLightbox = (media, startIndex = 0) => {
    setLightboxMedia(media && media.length ? media : []);
    setLightboxStartIndex(startIndex);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  return (
    <section className="max-w-[1600px] mx-auto py-12 px-4 sm:px-6 lg:px-8 projects">
      <div className="max-w-[1400px] mx-auto">
      <h2 className="w-70 text-4xl md:text-5xl font-extrabold text-black text-center bg-white px-4 py-2 mx-auto mb-7 uppercase big-shoulder">My Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(280px,1fr))] xl:grid-cols-[repeat(3,minmax(320px,1fr))] 2xl:grid-cols-[repeat(3,minmax(360px,1fr))] gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onOpenLightbox={openLightbox} />
          ))}
        </div>
      </div>

      <LightboxModal open={lightboxOpen} onClose={closeLightbox} media={lightboxMedia} startIndex={lightboxStartIndex} />
    </section>
  );
};

export default Projects;
