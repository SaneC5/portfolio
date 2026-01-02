import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Function to check if link is active
  const isActiveLink = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Common styles for navigation links
  const baseLinkStyles = "text-base font-medium transition-colors duration-200 nav-link";
  const activeLinkStyles = "text-[rgb(255,61,61)] font-semibold text-lg";
  const inactiveLinkStyles = "text-gray-300 hover:text-white";

  const getLinkStyles = (path) => {
    return `${baseLinkStyles} ${isActiveLink(path) ? `${activeLinkStyles} underline-active` : inactiveLinkStyles}`;
  };

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Certificates', path: '/certificates' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-15 md:px-0.5 lg:px-25">
        <div className="flex justify-between items-center my-5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link 
              to="/" 
              className="text-5xl md:text-6xl text-[rgb(243,64,23)] hover:text-[rgb(249,46,0)] transition-colors pl-5"
              onClick={closeMobileMenu}
            >
              <span className='my-name-nav font-bold'>Sane Chacko</span>
              <span className="block text-base iceland text-gray-300 mt-1">Full Stack Web Developer</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-8 pr-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={getLinkStyles(item.path)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className=" p-2 inline-flex items-center justify-center text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[rgb(249,46,0)]"
              onClick={toggleMobileMenu}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${getLinkStyles(item.path)} block px-3 py-2`}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
