import homeMyProfile from '../assets/img/sc2.webp'
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import ScanButton from '../components/ScanButton';


const Home = () => {

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 home">
      <div className="flex flex-col md:flex-row items-center justify-between mt-3 mb-15 w-full">
        <div className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/5">
          <img
            src={homeMyProfile} alt="Sane Chacko" width={1137} height={1143} fetchPriority="high" className="w-full h-auto rounded-full ring-1 ring-white ring-offset-5 ring-offset-black shadow-2xl"
          />
        </div>
        <div className='md:pl-7'>
          {/* The "Hello!!! Welcome..." greeting now lives in the intro loader
              (IntroLoader), so the hero doesn't repeat it. */}
          <h1 className="mt-3 max-w-md mx-auto font-[Georgia] text-white text-1xl md:mt-5 lg:text-2xl md:max-w-3xl font-bold">
            I'm,<br/><span className="text-6xl sm:text-5xl md:text-[4.5rem] lg:text-[6rem] big-shoulder my-name-home">Sane Chacko...</span><br/>a <span className='text-3xl sm:text-4xl iceland'>Full Stack Web Developer</span>,<br/>passionate about creating amazing web experiences.
          </h1>
        </div>
      </div>
      <div className=' border-1 p-5 rounded-2xl border-gray-400 bg-white/5 text-[rgb(255,67,67)] font-semibold steve-quote text-justify'>
        <p className='text-2xl md:text-3xl lg:text-5xl'>"Everyone should learn to program a Computer, because it teaches you how to think."</p>
        <p className='text-right text-2xl md:text-3xl lg:text-4xl'>- Steve Jobs</p>
      </div>
      <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 ">
        <ScanButton
          to="/projects"
          size="lg"
          full
          wrapperClassName="shadow"
          ariaLabel="Discover my creations — view projects"
          icon={faBriefcase}
        >
          Discover My Creations
        </ScanButton>
      </div>
        

    </div>
  );
};

export default Home;
