import { lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import IntroLoader from './components/IntroLoader/IntroLoader';

// Each page loads as its own chunk, so the initial bundle stays small and
// heavy per-page dependencies (GSAP, icon sets) load only when visited.
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Certificates = lazy(() => import('./pages/Certificates'));
const Contact = lazy(() => import('./pages/Contact'));
// Dev-only icon calibration page (/icon-lab), kept for tuning future
// signature icons. The guard is statically false in production builds,
// so the route and its chunk are tree-shaken out of the shipped bundle.
const IconLab = import.meta.env.DEV ? lazy(() => import('./pages/IconLab')) : null;

// React Router keeps the previous scroll position across navigations; without
// this, a new page opens mid-scroll and About's pinned section can activate
// at the wrong position.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      {/* First-visit welcome loader. Stays in the eager bundle so it paints
          before the lazy routes; it also prefetches the Home chunk + hero
          image, so the reveal underneath is instant. */}
      <IntroLoader />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="contact" element={<Contact />} />
          {import.meta.env.DEV && <Route path="icon-lab" element={<IconLab />} />}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
