import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// Split around the wordmark by visual weight rather than count — three short
// labels on the left balance the two long ones on the right. `ring` is each
// link's distance from the wordmark; the entrance stagger ripples outward
// ring by ring.
const NAV_LEFT = [
  { name: 'Home', path: '/', ring: 3 },
  { name: 'About', path: '/about', ring: 2 },
  { name: 'Projects', path: '/projects', ring: 1 },
];

const NAV_RIGHT = [
  { name: 'Certificates', path: '/certificates', ring: 1 },
  { name: 'Contact', path: '/contact', ring: 2 },
];

const NAV_ALL = [...NAV_LEFT, ...NAV_RIGHT];

// How far you have to scroll before the bar takes on a background.
const SCROLL_THRESHOLD = 24;

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // entered: the entrance choreography has been triggered.
  // settled: it has finished — stagger delays are cleared afterwards so they
  // can't lag any later transition on the same elements.
  const [entered, setEntered] = useState(false);
  const [settled, setSettled] = useState(false);
  const location = useLocation();
  const barRef = useRef(null);

  const isActiveLink = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  // The header is fixed, so Layout reserves its height with a spacer sized by
  // --nav-h. Measure the real bar instead of hard-coding: the wordmark's
  // webfont swaps in after first paint and changes the height.
  //
  // Two rules keep the spacer from ever moving the page mid-scroll:
  //  - never measure while scrolled past the threshold (the condensed bar
  //    must not shrink the spacer), and
  //  - debounce ResizeObserver bursts, because the bar animates back to its
  //    expanded height while the page is already near the top — committing
  //    the intermediate heights is what made the page jump on scroll up.
  //    The settled height equals the value already stored, so waiting out
  //    the burst means --nav-h never visibly changes.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let timer;
    const commit = () => {
      if (window.scrollY > SCROLL_THRESHOLD) return;
      document.documentElement.style.setProperty('--nav-h', `${bar.offsetHeight}px`);
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(commit, 150);
    };

    // Initial paint: the bar is static and expanded — measure immediately.
    commit();
    const observer = new ResizeObserver(schedule);
    observer.observe(bar);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Entrance: hold the nav hidden while the intro loader covers the page,
  // then cascade in when it starts to fade ('intro:reveal' fires on every
  // exit path, skip included). If the loader isn't there — already gone, or
  // a hot reload — enter straight away. The timeout is a safety net so a
  // missed event can never leave the nav invisible.
  useEffect(() => {
    if (!document.querySelector('.intro-loader')) {
      setEntered(true);
      return undefined;
    }
    const enter = () => setEntered(true);
    window.addEventListener('intro:reveal', enter, { once: true });
    // The net outlasts the loader's slowest natural path (~13s on a stalled
    // connection: 8s load cap + full converge + hold + burst).
    const fallback = setTimeout(enter, 14000);
    return () => {
      window.removeEventListener('intro:reveal', enter);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!entered) return undefined;
    const timer = setTimeout(() => setSettled(true), 1500);
    return () => clearTimeout(timer);
  }, [entered]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // While the menu is open: hold the page still, close on Escape, and close if
  // the viewport grows past the breakpoint (the panel is hidden there, and a
  // hidden-but-open menu would leave the page permanently locked).
  useEffect(() => {
    if (!menuOpen) return;

    const desktop = window.matchMedia('(min-width: 768px)');
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const onBreakpoint = () => {
      if (desktop.matches) setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onBreakpoint);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onBreakpoint);
    };
  }, [menuOpen]);

  // The open panel needs the surface behind it even at the top of the page.
  const surfaceVisible = scrolled || menuOpen;

  // Wordmark lands first (no delay), then the links ripple outward.
  const enterDelay = (ring) => (entered && !settled ? `${90 + ring * 90}ms` : '0ms');
  const enterClasses = `transition-all duration-700 ease-out ${
    entered ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
  }`;

  const renderLink = (item, className = '') => (
    <Link
      to={item.path}
      className={`nav-link text-[13px] ${isActiveLink(item.path) ? 'is-active' : ''} ${className}`}
      aria-current={isActiveLink(item.path) ? 'page' : undefined}
    >
      {item.name}
    </Link>
  );

  const renderDesktopItem = (item) => (
    <li key={item.name} style={{ transitionDelay: enterDelay(item.ring) }} className={enterClasses}>
      {renderLink(item)}
    </li>
  );

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50">
      {/* Backdrop for the mobile panel: dims the page while the menu is open,
          and tapping it closes the menu. Positioned siblings below (the bar
          and the panel) paint above it. */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-500 ease-out md:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Once scrolled, the bar detaches into a floating card — inset from
          the edges, lifted off the top, rounded — instead of a full-width
          band. All of this happens inside the fixed header, out of the
          layout flow, so none of it can move the page below. */}
      <div
        ref={barRef}
        className={`relative transition-all duration-500 ease-out ${
          scrolled
            ? `mx-[var(--nav-inset)] mt-2 sm:mt-3 ${menuOpen ? 'rounded-t-2xl' : 'rounded-2xl'}`
            : 'mx-0 mt-0 rounded-none'
        }`}
      >
        {/* Surface. Kept on its own layer so the whole background — blur,
            tint, hairline and shadow — can cross-fade as one thing. It
            inherits the bar's radius so the card's corners clip cleanly. */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 overflow-hidden rounded-[inherit] border transition-all duration-[600ms] ease-out ${
            surfaceVisible ? 'opacity-100' : 'opacity-0'
          } ${scrolled ? 'border-white/10' : 'border-transparent'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-xl shadow-[0_16px_40px_-24px_rgba(0,0,0,0.95)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </div>

        <nav
          aria-label="Primary"
          className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"
        >
          {/* 1fr | auto | 1fr keeps the wordmark dead-centre in the viewport
              however wide either group of links grows. */}
          <div
            className={`grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center transition-[padding] duration-500 ease-out ${
              scrolled ? 'py-4 sm:py-5' : 'py-6 sm:py-10'
            }`}
          >
            {/* Both flanks stay in the grid at every breakpoint — a display:none
                grid item is removed from layout, which would re-place the
                wordmark into the first column and break the centring. */}
            <div className="flex items-center justify-end">
              <ul className="hidden items-center gap-6 lg:gap-10 md:flex">
                {NAV_LEFT.map(renderDesktopItem)}
              </ul>
            </div>

            <Link
              to="/"
              className={`wordmark-link flex flex-col items-center px-4 sm:px-8 lg:px-14 ${enterClasses}`}
              aria-label="Sane Chacko — home"
            >
              <span
                className={`wordmark uppercase transition-[font-size] duration-500 ease-out ${
                  scrolled ? 'text-[22px] sm:text-[26px]' : 'text-[22px] sm:text-[32px]'
                }`}
              >
                {/* Ghost copy at the hover tracking — reserves the widest
                    width so the grid column (and the links) never move while
                    the visible layer's tracking animates. */}
                <span className="wordmark-ghost" aria-hidden="true">
                  Sane Chacko
                </span>
                <span className="wordmark-live">
                  <span className="wordmark-text">
                    Sane <span className="wordmark-accent">Chacko</span>
                  </span>
                </span>
              </span>
              <span
                className={`wordmark-sub hidden overflow-hidden text-[10px] text-white transition-all duration-500 ease-out sm:block ${
                  scrolled ? 'mt-0 max-h-0 opacity-0' : 'mt-3 max-h-4 opacity-100'
                }`}
              >
                Full Stack Web Developer
              </span>
            </Link>

            <div className="flex items-center justify-start">
              <ul className="hidden items-center gap-6 lg:gap-10 md:flex">
                {NAV_RIGHT.map(renderDesktopItem)}
              </ul>

              <div
                style={{ transitionDelay: enterDelay(1) }}
                className={`ml-auto md:hidden ${enterClasses}`}
              >
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  aria-controls="primary-menu"
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  className="-mr-1.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors duration-300 hover:bg-white/5 hover:text-white focus-visible:outline-1 focus-visible:outline-white/40"
                >
                  <span className="relative block h-4 w-6">
                    <span
                      className={`nav-burger-line top-0 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
                    />
                    <span
                      className={`nav-burger-line top-1/2 -translate-y-1/2 ${
                        menuOpen ? 'scale-x-0 opacity-0' : ''
                      }`}
                    />
                    <span
                      className={`nav-burger-line bottom-0 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile panel. The 0fr → 1fr row animates to the panel's natural
          height, so nothing has to be measured or capped. Kept positioned so
          it paints above the backdrop. */}
      <div
        id="primary-menu"
        inert={!menuOpen}
        className={`relative grid transition-[grid-template-rows,margin] duration-500 ease-out md:hidden ${
          menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        } ${scrolled ? 'mx-[var(--nav-inset)]' : 'mx-0'}`}
      >
        <div className={`overflow-hidden ${scrolled ? 'rounded-b-2xl' : ''}`}>
          <div className="border-t border-white/10 bg-black/90 px-8 pb-8 pt-3 backdrop-blur-xl">
            <ul>
              {NAV_ALL.map((item, index) => (
                <li
                  key={item.name}
                  style={{ transitionDelay: menuOpen ? `${100 + index * 55}ms` : '0ms' }}
                  className={`border-b border-white/[0.06] last:border-b-0 transition-all duration-500 ease-out ${
                    menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                  }`}
                >
                  {renderLink(item, 'nav-link--stacked py-4')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
