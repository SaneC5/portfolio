import { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  // While the intro loader covers the page, everything beneath is inert —
  // without this, Tab and screen readers reach the covered page (the loader
  // is a sibling overlay, not a parent). Same contract as the header/hero/
  // footer entrances: lift at 'intro:reveal' (fires on every exit path, skip
  // included), with a net that outlasts the loader's slowest natural path
  // (~13s) so a missed event can never leave the page dead.
  const [covered, setCovered] = useState(false);
  useEffect(() => {
    if (!document.querySelector('.intro-loader')) return undefined;
    setCovered(true);
    const lift = () => setCovered(false);
    window.addEventListener('intro:reveal', lift, { once: true });
    const fallback = setTimeout(lift, 14000);
    return () => {
      window.removeEventListener('intro:reveal', lift);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div className="relative bg-[black]" inert={covered}>

      <div className="fixed -top-10 -left-10 md:-top-10 md:-left-10 w-45 h-45 md:w-55 md:h-55 bg-blue-300 opacity-10 rounded-full blur-3xl animate-pulse z-0" />
      <div className="fixed top-15 right-15 md:top-20 md:right-40 w-28 h-58 md:w-45 md:h-85 bg-white opacity-30 md:opacity-20 rounded-full -rotate-12 blur-3xl z-0" />
      {/* The red blob that used to sit here washed a dull maroon over the
          hero's CTA row (measurably cutting its contrast) and clashed with
          the orangered accent; removed rather than repurposed. */}
      <div className="fixed bottom-40 left-10 md:bottom-10 md:left-20 w-28 h-28 md:w-45 md:h-45 bg-white opacity-20 rounded-full animate-pulse blur-3xl z-0" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        {/* The header is fixed so it can float over the hero; this stands in
            for it in the flow. Header.jsx keeps --nav-h in sync with the real
            bar height. */}
        <div aria-hidden="true" className="h-[var(--nav-h)]" />
        <main className="flex-grow">
          {/* Fallback reserves a full viewport so the footer doesn't jump up
              during the brief page-chunk load. */}
          <Suspense fallback={<div className="min-h-screen" />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>

    
  );
};

export default Layout;
