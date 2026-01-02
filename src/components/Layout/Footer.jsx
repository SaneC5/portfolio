import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
const Footer = () => {
  return (
    <footer>
      <div className="max-w-7xl mx-auto py-9 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-white iceland text-sm md:text-lg uppercase">"I chose this profession to leverage technology as a catalyst for innovation, solving complex challenges and driving meaningful change."</p>
        <div className="flex flex-col md:flex-row justify-center items-center">
          <p className="text-white iceland text-lg uppercase">
            © {new Date().getFullYear()} Sane Chacko.
          </p>

          <div className="flex space-x-6 iceland uppercase text-white text-sm md:text-base md:ml-6">
            <a
              href="https://wa.me/9594023995"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-gray-300 transition flex items-center"
            >
              WhatsApp
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
            <a
              href="https://www.linkedin.com/in/sane-chacko-a0969b33a"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-gray-300 transition flex items-center"
            >
              LinkedIn
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a
              href="mailto:sanechacko555@gmail.com"
              aria-label="Email"
              className="hover:text-gray-300 transition flex items-center"
            >
              Email
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
            <a
              href="https://www.instagram.com/sane_chacko_95"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-gray-300 transition flex items-center"
            >
              Instagram
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
