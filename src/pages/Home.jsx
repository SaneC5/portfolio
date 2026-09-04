import Hero from '../components/Hero/Hero';
import SelectedWorks from '../components/Works/SelectedWorks';
import SheetNote from '../components/SheetNote';
import TechnicalSpec from '../components/Spec/TechnicalSpec';
import Method from '../components/Method/Method';

const Home = () => {
  return (
    <div className="home">
      {/* The old photo/heading block and the "Discover My Creations" button
          both live inside Hero now. */}
      <Hero />
      <SelectedWorks />

      {/* Quote between Sheets 01 and 02, hung on leaders between them. */}
      <SheetNote attribution="Steve Jobs">
        “Everyone should learn to program a computer, because it teaches you how to think.”
      </SheetNote>

      <TechnicalSpec />
      <Method />
    </div>
  );
};

export default Home;
