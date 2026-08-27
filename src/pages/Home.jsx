import Hero from '../components/Hero/Hero';

const Home = () => {
  return (
    <div className="home">
      {/* The old photo/heading block and the "Discover My Creations" button
          both live inside Hero now. */}
      <Hero />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="border-1 p-5 rounded-2xl border-gray-400 bg-white/5 text-[rgb(255,67,67)] font-semibold steve-quote text-justify">
          <p className="text-2xl md:text-3xl lg:text-5xl">
            "Everyone should learn to program a Computer, because it teaches you how to think."
          </p>
          <p className="text-right text-2xl md:text-3xl lg:text-4xl">- Steve Jobs</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
