import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="relative bg-[black]">

      <div className="fixed -top-10 -left-10 md:-top-10 md:-left-10 w-45 h-45 md:w-55 md:h-55 bg-blue-300 opacity-10 rounded-full blur-3xl animate-pulse z-0" />
      <div className="fixed top-15 right-15 md:top-20 md:right-40 w-28 h-58 md:w-45 md:h-85 bg-white opacity-30 md:opacity-20 rounded-full -rotate-12 blur-3xl z-0" />
      <div className="fixed bottom-10 left-1/2 md:bottom-10 md:left-1/2 w-38 h-62 md:w-60 md:h-100 bg-red-500 opacity-25 rounded-full rotate-12 blur-2xl z-0" />
      <div className="fixed bottom-40 left-10 md:bottom-10 md:left-20 w-28 h-28 md:w-45 md:h-45 bg-white opacity-20 rounded-full animate-pulse blur-3xl z-0" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>

    
  );
};

export default Layout;
