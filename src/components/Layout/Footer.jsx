import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

// Same items and order as the header, so the strip reads as the nav's echo.
const NAV_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Certificates', path: '/certificates' },
  { name: 'Contact', path: '/contact' },
];

// Professional channels first. Email is deliberately absent here — it gets
// the featured slot in the endcap above.
const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sane-chacko-a0969b33a', icon: faLinkedin },
  { label: 'WhatsApp', href: 'https://wa.me/9594023995', icon: faWhatsapp },
  { label: 'Instagram', href: 'https://www.instagram.com/sane_chacko_95', icon: faInstagram },
];

const Footer = () => {
  const rootRef = useRef(null);
  const [shown, setShown] = useState(false);
  const { pathname } = useLocation();

  // Entrance trigger: plays once per document load, when the footer first
  // scrolls into view. Same contract as the hero/header choreography: while
  // the intro loader covers the page, hold — start observing at
  // 'intro:reveal' (fires on every exit path, skip included) — and never
  // stay hidden if the event is somehow missed. Reduced motion needs no
  // branch here: the state still flips and Footer.css collapses every
  // transition to an instant hop (the header's pattern).
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setShown(true);
      return undefined;
    }

    let observer;
    let fallback;
    let armed = false;
    // Idempotent: both the reveal event and the fallback timer funnel here.
    const arm = () => {
      if (armed || !rootRef.current) return;
      armed = true;
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setShown(true);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(rootRef.current);
    };

    if (document.querySelector('.intro-loader')) {
      window.addEventListener('intro:reveal', arm, { once: true });
      fallback = setTimeout(arm, 8000);
    } else {
      arm();
    }

    return () => {
      window.removeEventListener('intro:reveal', arm);
      clearTimeout(fallback);
      if (observer) observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <footer ref={rootRef} className={`site-footer ${shown ? 'is-shown' : ''}`}>
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-8 sm:px-6 sm:pt-20 lg:px-8">
        {/* Endcap — bookends the hero: FIG. 03 continues Home's figure
            sequence (01 hello, 02 portrait), and the giant line exits
            through the same mask the name entered through. */}
        <p className="footer-kicker iceland">
          <span className="footer-kicker-rule" aria-hidden="true" />
          FIG. 03 — NEXT STEP
        </p>

        {/* CTA + quote share a row on desktop (quote bottom-aligned to the
            giant line); on phones the wrapper is a column and the quote
            orders itself first, keeping the kicker -> quote -> CTA stack. */}
        <div className="footer-endcap-main">
          <Link
            to="/contact"
            className="footer-cta big-shoulder"
            aria-label="Let's talk — go to the contact page"
          >
            <span className="footer-cta-line">
              <span className="footer-cta-inner">
                LET'S TALK
                <span className="footer-cta-dot">
                  <span>.</span>
                  <span className="footer-cta-dot-glow" aria-hidden="true">.</span>
                </span>
              </span>
            </span>
          </Link>

          <p className="footer-quote oswald">
            "I chose this profession to leverage technology as a catalyst for innovation,
            solving complex challenges and driving meaningful change."
          </p>
        </div>

        <p className="footer-mail-row">
          <a href="mailto:sanechacko555@gmail.com" className="footer-mail iceland">
            sanechacko555@gmail.com
          </a>
        </p>

        {/* Utility strip — the title block */}
        <div className="footer-strip">
          <span className="footer-strip-rule" aria-hidden="true" />

          <p className="footer-copy iceland">© {new Date().getFullYear()} SANE CHACKO</p>

          <nav aria-label="Footer" className="footer-nav">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`nav-link text-[13px] ${pathname === item.path ? 'is-active' : ''}`}
                    aria-current={pathname === item.path ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-side">
            <ul className="footer-social" aria-label="Profiles">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="footer-social-link"
                  >
                    <FontAwesomeIcon icon={social.icon} />
                  </a>
                </li>
              ))}
            </ul>

            <button type="button" onClick={scrollToTop} className="footer-top iceland">
              TOP
              <svg
                className="footer-top-chevron"
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                aria-hidden="true"
              >
                <path d="M1 6 L6 1 L11 6" stroke="orangered" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
