import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

import profilePic from '../assets/img/SC.webp';
import skillbg from '../assets/img/skills-img.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3Alt, faJsSquare, faReact, faNodeJs, faPython, faJava, faGitAlt, faBootstrap, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faGraduationCap, faPhone, faLaptopCode, faCodeBranch, faChalkboardTeacher, faUniversity, faUserGraduate, faDownload, faRobot, faCookieBite } from '@fortawesome/free-solid-svg-icons';
import { SiTailwindcss, SiExpress, SiFacebook, SiTwilio, SiGoogle, SiPostman, SiGithub, SiVercel, SiRender, SiMysql, SiPostgresql, SiMongodb, SiC, SiWordpress, SiN8N, SiMake, SiCaldotcom, SiNextdotjs, SiAstro, SiDocker, SiStripe, SiStrapi, SiTypescript, SiGooglemaps } from 'react-icons/si';
import { DiNodejs, DiVisualstudio } from 'react-icons/di';

const education = [
  {
    id: 1,
    title: 'Secondary School (10th)',
    institute: 'NBHS & Jr. College',
    year: "Jun '17 - Apr '18",
    score: '81.40%',
    icon: faChalkboardTeacher,
    description: 'This foundational phase built my core academic skills, instilled discipline, and sparked my initial curiosity in technology and problem-solving.'
  },
  {
    id: 2,
    title: 'Senior Secondary (12th)',
    institute: 'NBHS & Jr. College',
    year: "Apr '19 - Mar '20",
    score: '62.92%',
    icon: faGraduationCap,
    description: 'Despite academic hurdles, this period helped me realize my passion for computer science and set the direction for my future pursuits in tech.'
  },
  {
    id: 3,
    title: 'Bachelor of Computer Science',
    institute: 'A.S.M CSIT [SPPU]',
    year: "Aug '20 - Jun '23",
    score: '8.86 CGPA',
    icon: faUniversity,
    description: 'A transformative journey where I mastered fundamental concepts in programming, algorithms, and software development — laying a strong foundation for full-stack development.'
  },
  {
    id: 4,
    title: 'Masters of Computer Science',
    institute: 'H.P.T & R.Y.K College [SPPU]',
    year: "Aug '23 - Jun '25",
    score: '8.56 CGPA',
    icon: faUserGraduate,
    description: 'This postgraduate phase deepened my technical expertise in advanced computing concepts, data structures, and system design — sharpening both my theoretical and practical skills.'
  },
  {
    id: 5,
    title: 'Web Developer Internship',
    institute: 'SachiTech',
    year: "May '23 - Jun '25",
    score: 'HTML, CSS, Bootstrap, JS',
    icon: faLaptopCode,
    description: 'My first hands-on experience in the industry — I learned how to translate design into pixel-perfect code and became proficient in creating responsive user interfaces using modern web technologies.'
  },
  {
    id: 6,
    title: 'Full-Stack Intern',
    institute: 'ESTPL',
    year: "Jan '25 - Jul '25",
    score: 'React, NodeJs, ExpressJs, MySQL, HTML, CSS, Bootstrap, JS',
    icon: faCodeBranch,
    description: 'Here I stepped into the full-stack world, contributing to real-world projects involving frontend interfaces, backend APIs, and databases — gaining confidence in full application architecture and team collaboration.'
  }
];


const skills = {
  languages: [
    { id: 'html', icon: faHtml5, label: 'HTML5' },
    { id: 'css', icon: faCss3Alt, label: 'CSS3' },
    { id: 'js', icon: faJsSquare, label: 'JS/JSX' },
    { id: 'ts', icon: SiTypescript, label: 'TS/TSX' },
    { id: 'c', icon: SiC, label: 'C' },
    { id: 'python', icon: faPython, label: 'Python' },
    { id: 'java', icon: faJava, label: 'Java' }
  ],
  frameworks: [
    { id: 'react', icon: faReact, label: 'React' },
    { id: 'next', icon: SiNextdotjs, label: 'Next.js' },
    { id: 'astro', icon: SiAstro, label: 'Astro' },
    { id: 'express', icon: SiExpress, label: 'Express' },
    { id: 'bootstrap', icon: faBootstrap, label: 'Bootstrap' },
    { id: 'tailwind', icon: SiTailwindcss, label: 'Tailwind' }
  ],
  apis: [
    { id: 'stripe', icon: SiStripe, label: 'Stripe' },
    { id: 'facebook', icon: SiFacebook, label: 'Facebook' },
    { id: 'twilio', icon: SiTwilio, label: 'Twilio' },
    { id: 'googleAuth', icon: SiGoogle, label: 'G. Auth' },
    { id: 'linkedin', icon: faLinkedin, label: 'LinkedIn' },
    { id: 'googleMaps', icon: SiGooglemaps, label: 'G. Map' },
    { id: 'googleCaptcha', icon: faRobot, label: 'G. Captc...' }
  ],
  databases: [
    { id: 'mongo', icon: SiMongodb, label: 'MongoDB' },
    { id: 'mysql', icon: SiMysql, label: 'MySQL' },
    { id: 'postgresql', icon: SiPostgresql, label: 'PostgreSQL' }
  ],
  'tools & platforms': [
    { id: 'node', icon: DiNodejs, label: 'Node.js' },
    { id: 'git', icon: faGitAlt, label: 'Git' },
    { id: 'github', icon: SiGithub, label: 'GitHub' },
    { id: 'postman', icon: SiPostman, label: 'Postman' },
    { id: 'vscode', icon: DiVisualstudio, label: 'VSCode' },
    { id: 'docker', icon: SiDocker, label: 'Docker' },
    { id: 'vercel', icon: SiVercel, label: 'Vercel' },  // no icon, cloud for deployment
    { id: 'render', icon: SiRender, label: 'Render' },
    { id: 'wordpress', icon: SiWordpress, label: 'WordPress' },
    { id: 'strapi', icon: SiStrapi, label: 'Strapi' },
    { id: 'c15t', icon: faCookieBite, label: 'c15t' }
  ],
  automation: [
    { id: 'mcp', icon: () => ( <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 180 180"
          fill="none"
        >
          <path d="M18 84.8528L85.8822 16.9706C95.2548 7.59798 110.451 7.59798 119.823 16.9706V16.9706C129.196 26.3431 129.196 41.5391 119.823 50.9117L68.5581 102.177" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
          <path d="M69.2652 101.47L119.823 50.9117C129.196 41.5391 144.392 41.5391 153.765 50.9117L154.118 51.2652C163.491 60.6378 163.491 75.8338 154.118 85.2063L92.7248 146.6C89.6006 149.724 89.6006 154.789 92.7248 157.913L105.331 170.52" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
          <path d="M102.853 33.9411L52.6482 84.1457C43.2756 93.5183 43.2756 108.714 52.6482 118.087V118.087C62.0208 127.459 77.2167 127.459 86.5893 118.087L136.794 67.8822" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
        </svg>
      ),
      label: 'MCP'
    },
    { id: 'n8n', icon: SiN8N, label: 'n8n' },
    { id: 'make', icon: SiMake, label: 'Make' },
    { id: 'anythingllm', icon: () => ( <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 245 245"
          fill="currentColor"
        >
          <path d="M187.82 158.21v-72.5a.4.4 0 0 0-.4-.4h-25.49a1.81 1.8 18.9 0 0-1.42.69q-33.16 42.4-65.04 83.18-4.34 5.55-12.63 5.47-10.26-.09-22.81.07-7.4.09-10.66-1.5-5.05-2.47-7.05-7.65-1.09-2.8-1.05-7.46.28-37.24-.02-70.84-.06-6.28 1.38-9.13c2.81-5.53 7.74-8.21 13.93-8.18q15.04.09 27.62.04c5.48-.02 9.45 2.73 12.73 7.34q6.12 8.6 12.91 17.73.41.55.46 1.23c.1 1.49.32 3.06-.58 4.37q-2.1 3.05-4.22 5.16c-2.41 2.38-6.01 1.53-7.87-1.12q-7.1-10.11-13.98-19.09a.8.79 71 0 0-.63-.31H57.3q-.64 0-.64.64l-.01 72.5q0 .55.56.55h25.38a2.37 2.35-70.9 0 0 1.86-.91q32.58-41.63 64.63-82.6c3.02-3.86 7.31-5.6 12.29-5.55q12.57.14 24.86-.02 5.67-.07 8.94 1.43c4.8 2.21 8.04 7.06 8.03 12.39q-.04 40.1.03 76.89c.01 8.09-6.59 13.89-14.44 13.97q-14.85.13-28.3-.03-7.75-.1-12.27-6.59-6-8.59-11.78-16.56c-2.79-3.86-.01-7.25 3.05-10.75 2.31-2.66 6.29-2.81 8.4.14l12.59 17.67a1.24 1.24 0 0 0 1.01.52h25.54q.79 0 .79-.79" />
        </svg>
      ),
      label: 'AnythingLLM'
    },
    { id: 'wati', icon: () => ( <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 125.92 108.5"
          fill="currentColor"
        >
          <path d="M36.56,86.33h37.13l22.19,22.17v-22.17h9.48c11.31,0,20.56-9.25,20.56-20.56v-29.2c0-11.31-9.25-20.56-20.56-20.56H36.56c-11.31,0-20.56,9.25-20.56,20.56v29.2c0,11.31,9.25,20.56,20.56,20.56Z" />
          <path d="M83.9,102.17l-23.86-23.84H24.56c-13.54,0-24.56-11.02-24.56-24.56V24.56C0,11.02,11.02,0,24.56,0H93.36c13.54,0,24.56,11.02,24.56,24.56v29.2c0,13.54-11.02,24.56-24.56,24.56h-9.48v-8h9.48c9.13,0,16.56-7.43,16.56-16.56V24.56c0-9.13-7.43-16.56-16.56-16.56H24.56c-9.13,0-16.56,7.43-16.56,16.56v29.2c0,9.13,7.43,16.56,16.56,16.56H63.35l20.62,20.6-.07,11.24Z" />
        </svg>
      ),
      label: 'Wati'
    },
    { id: 'astra', icon: () => ( <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 28 30"
          fill="none"
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M13.9475 8.11966L24.913 15.0971L28 13.1407V10.9995C28 9.16688 27.1035 7.46478 25.6305 6.50062L24.7377 5.91621C23.11 5.14088 19.1724 3.92428 13.9475 8.11966Z" fill="currentColor" fillOpacity="0.55" />
          <path fillRule="evenodd" clipRule="evenodd" d="M24.7512 5.94676C22.6029 4.77289 18.5591 5.16064 16.5027 6.507L16.5018 6.50757L0 16.9426V10.972C0 9.10915 0.925989 7.38362 2.4379 6.42907L11.4379 0.746925C13.0162 -0.249507 14.9854 -0.249425 16.562 0.749875C19.4005 2.54899 21.0721 3.62131 24.7512 5.94676Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M14 21.9106L3.08694 14.9863L0 16.9427V19.0448C0 20.8987 0.917144 22.6172 2.41746 23.5748L2.93832 23.9072C3.16727 24.0533 3.40432 24.1824 3.65702 24.2748C5.22666 24.8489 9.22105 25.7479 14 21.9106Z" fill="currentColor" fillOpacity="0.55" />
          <path fillRule="evenodd" clipRule="evenodd" d="M3.24878 24.0535C5.39707 25.2273 9.44087 24.8396 11.4973 23.4932L11.4982 23.4926L28 13.0576V19.0282C28 20.8911 27.074 22.6166 25.5621 23.5711L16.5621 29.2533C14.9838 30.2497 13.0146 30.2496 11.438 29.2503C8.59943 27.4512 6.92786 26.3789 3.24878 24.0535Z" fill="currentColor" />
        </svg>
      ),
      label: 'Astra (Wati)'
    },
    { id: 'cal-com', icon: SiCaldotcom, label: 'Cal.com' },
    { id: 'retell', icon: () => ( <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="0 0 150 500"
          enableBackground="new 0 0 500 500"
          xmlSpace="preserve"
          style={{ fill: "white" }}
        >
          <g></g>
          <g>
            <path
              d="M25.105,258.98c0.801-0.768,1.561-1.584,2.41-2.294c3.201-2.676,7.468-2.48,10.327,0.437c2.794,2.851,2.852,7.437,0.13,10.338c-2.722,2.902-7.031,3.098-10.387,0.602c-0.88-0.655-1.051-2.127-2.48-2.099C25.105,263.636,25.105,261.308,25.105,258.98z"
            />
            <path
              d="M60.089,204.103c0.491,1.509,2.181,1.096,3.153,1.996c3.139,2.903,3.586,7.44,0.822,10.677c-2.599,3.044-7.693,3.418-10.722,0.787c-3.031-2.632-3.338-7.65-0.552-10.668c0.97-1.051,2.193-1.868,3.301-2.792C57.423,204.103,58.756,204.103,60.089,204.103z"
            />
            <path
              d="M80.079,295.897c-0.238-1.314-1.549-1.604-2.327-2.399c-2.687-2.744-2.854-5.969-1.287-9.127c1.586-3.197,4.663-4.06,8.027-3.504c3.274,0.542,5.268,2.569,5.778,5.886c0.565,3.674-0.793,6.43-4.139,8.127c-0.68,0.345-1.693,0.017-2.053,1.018C82.745,295.897,81.412,295.897,80.079,295.897z"
            />
            <path d="M91.604,251.899c-2.78-2.56-0.48-3.11,0.73-4.28c4.13-4.01,5.19-8.88,3.61-14.19c-1.49-5.02-5.23-8.08-10.3-9.1c-6.47-1.3-11.3,1.57-14.99,6.84c-0.52-0.62-0.93-1.13-1.36-1.61c-5.79-6.51-14.36-7.3-20.31-2.05c-4.84,4.27-6.72,15.38,0.63,20.65c3.03,2.17,0.66,2.95-0.7,4.22c-4.53,4.27-5.17,9.44-3.22,15.06c1.93,5.54,6.31,7.89,11.83,8.46c5.83,0.61,9.75-2.53,13.04-7.02c0.58,0.62,0.82,0.85,1.04,1.1c5.92,6.96,14.42,7.99,20.55,2.49C98.234,267.019,98.244,257.999,91.604,251.899z M70.824,255.529c-5.7-3.62-6.11-7.35-0.58-10.63c1.8,1.54,3.75,3.21,5.69,4.88C74.214,251.709,72.504,253.649,70.824,255.529z" />
            <path
              d="M116.234,237.479c0.106,4.418-2.945,7.624-7.303,7.676c-4.258,0.05-7.719-3.301-7.697-7.453c0.021-3.872,3.321-7.294,7.227-7.495C112.683,229.99,116.132,233.217,116.234,237.479z"
            />
            <path
              d="M63.286,288.37c-0.274,3.124-2.004,4.784-5.189,4.684c-3.274-0.102-4.856-2.208-4.77-5.182c0.088-3.061,2.04-4.907,5.199-4.749C61.647,283.279,63.285,285.128,63.286,288.37z"
            />
            <path
              d="M88.176,211.862c-0.606,3.261-2.277,5.134-5.411,5.008c-3.137-0.125-4.878-2.026-4.752-5.163c0.126-3.162,2.08-4.818,5.189-4.74C86.416,207.048,87.725,209.199,88.176,211.862z"
            />
            <path
              d="M31.321,232.818c4.435,0.055,6.132,1.936,6.145,4.959c0.013,3.107-2.023,4.985-5.055,4.989c-3.088,0.004-5.058-2.075-5.008-5.062C27.451,234.789,29.147,232.755,31.321,232.818z"
            />
            <path
              d="M108.798,267.177c-3.13-0.042-4.83-1.672-4.891-4.872c-0.062-3.255,1.878-5.026,4.878-5.078c3.059-0.053,4.989,1.935,5.057,4.988C113.912,265.324,112.118,267.075,108.798,267.177z"
            />
            <path
              d="M108.396,208.046c2.788,0.154,4.039,1.481,4.157,3.749c0.123,2.374-1.322,3.832-3.517,3.906c-2.388,0.081-4.029-1.236-3.974-3.91C105.112,209.37,106.689,208.437,108.396,208.046z"
            />
            <path
              d="M112.578,288.063c-0.174,2.207-1.196,3.782-3.631,3.807c-2.321,0.024-3.761-1.233-3.863-3.606c-0.103-2.407,1.278-3.722,3.602-3.819C111.042,284.347,112.386,285.61,112.578,288.063z"
            />
            <path
              d="M32.551,208.065c2.08,0.27,3.516,1.336,3.655,3.704c0.143,2.432-1.373,3.852-3.453,3.993c-2.417,0.163-4.089-1.402-4.056-3.935C28.726,209.604,30.072,208.25,32.551,208.065z"
            />
            <path
              d="M36.202,288.436c-0.172,1.986-1.353,3.388-3.73,3.44c-2.434,0.054-3.691-1.448-3.74-3.697c-0.051-2.336,1.335-3.748,3.72-3.721C34.738,284.484,36.214,285.599,36.202,288.436z"
            />
          </g>
        </svg>
      ),
      label: 'Retell AI'
    }
  ]
};


const About = () => {

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, Observer);

    // Animation constants
    let allowScroll = true;
    let scrollTimeout = gsap.delayedCall(1, () => (allowScroll = true)).pause();
    const time = 0.5;
    let animating = false;

    // Progressive enhancement
    gsap.set(".education-card", {
      y: (index) => 20 * index,
      transformOrigin: "center top"
    });

    // The timeline
    const tl = gsap.timeline({ paused: true });

    // Card 2 animation
    tl.add("card2");
    tl.to(".education-card:nth-child(1)", {
      scale: 0.75,
      duration: time,
      backgroundColor: "rgba(255, 255, 255, 0.04)"
    });
    tl.from(
      ".education-card:nth-child(2)",
      {
        y: () => window.innerHeight,
        duration: time
      },
      "<"
    );

    // Card 3 animation
    tl.add("card3");
    tl.to(".education-card:nth-child(2)", {
      scale: 0.8,
      duration: time,
      backgroundColor: "rgba(255, 255, 255, 0.04)"
    });
    tl.from(
      ".education-card:nth-child(3)",
      {
        y: () => window.innerHeight,
        duration: time
      },
      "<"
    );

    // Card 4 animation
    tl.add("card4");
    tl.to(".education-card:nth-child(3)", {
      scale: 0.85,
      duration: time,
      backgroundColor: "rgba(255, 255, 255, 0.04)"
    });
    tl.from(
      ".education-card:nth-child(4)",
      {
        y: () => window.innerHeight,
        duration: time
      },
      "<"
    );
    tl.add("card5");
    tl.to(".education-card:nth-child(4)", {
      scale: 0.9,
      duration: time,
      backgroundColor: "rgba(255, 255, 255, 0.04)"
    });
    tl.from(
      ".education-card:nth-child(5)",
      {
        y: () => window.innerHeight,
        duration: time
      },
      "<"
    );

    // Card 6 animation
    tl.add("card6");
    tl.to(".education-card:nth-child(5)", {
      scale: 0.95,
      duration: time,
      backgroundColor: "rgba(255, 255, 255, 0.04)"
    });
    tl.from(
      ".education-card:nth-child(6)",
      {
        y: () => window.innerHeight,
        duration: time
      },
      "<"
    );
    tl.add("card7");

    function tweenToLabel(direction, isScrollingDown) {
      if (
        (!tl.nextLabel() && isScrollingDown) ||
        (!tl.previousLabel() && !isScrollingDown)
      ) {
        cardsObserver.disable();
        return;
      }
      if (!animating && direction) {
        animating = true;
        tl.tweenTo(direction, { onComplete: () => (animating = false) });
      }
    }

    // Observer plugin
    const cardsObserver = Observer.create({
      wheelSpeed: -1,
      onDown: (self) => tweenToLabel(tl.previousLabel(), false),
      onUp: (self) => tweenToLabel(tl.nextLabel(), true),
      tolerance: 10,
      preventDefault: true,
      onEnable(self) {
        allowScroll = false;
        scrollTimeout.restart(true);
        let savedScroll = self.scrollY();
        self._restoreScroll = () => self.scrollY(savedScroll);
        document.addEventListener("scroll", self._restoreScroll, {
          passive: false
        });
      },
      onDisable: (self) =>
        document.removeEventListener("scroll", self._restoreScroll)
    });

    cardsObserver.disable();

    ScrollTrigger.matchMedia({

      // Desktop
      "(min-width: 1024px)": function () {
        ScrollTrigger.create({
          id: "EDUCATION-SCROLL",
          trigger: ".education-cards-section",
          pin: true,
          start: "top 22%",
          end: "+=100",
          onEnter: (self) => {
            if (cardsObserver.isEnabled) return;
            cardsObserver.enable();
          },
          onEnterBack: (self) => {
            if (cardsObserver.isEnabled) return;
            cardsObserver.enable();
          }
        });
      },

      // Mobile
      "(max-width: 1023.99px)": function () {
        ScrollTrigger.create({
          id: "EDUCATION-SCROLL",
          trigger: ".education-cards-section",
          pin: true,
          start: "top 13%",
          end: "+=100",
          onEnter: (self) => {
            if (cardsObserver.isEnabled) return;
            cardsObserver.enable();
          },
          onEnterBack: (self) => {
            if (cardsObserver.isEnabled) return;
            cardsObserver.enable();
          }
        });
      }

    });

    // Cleanup
    return () => {
      ScrollTrigger.getById("EDUCATION-SCROLL")?.kill();
      cardsObserver.kill();
      tl.kill();
    };
  }, []);


  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 about">
      <h2 className="w-50 text-4xl md:text-5xl font-extrabold text-black text-center bg-white px-4 py-2 mx-auto mb-4 uppercase big-shoulder">About Me</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* LEFT: Short summary */}
        <div>
          
          <p className="text-gray-300 leading-relaxed text-xl md:text-2xl mb-1 iceland">
            I am a detail-oriented Full Stack Web Developer with a passion for building
            performant, accessible and delightful web applications.
            I specialize in modern JavaScript stacks [React, Node] and enjoy
            taking a product from idea to production — writing clean, testable code,
            and focusing on great user experiences.
          </p>
          <p className="text-gray-300 leading-relaxed text-xl md:text-2xl mb-1 iceland">Over the years, I've worked on a few projects - always with a focus on usability, performance, and scalability. I thrive in collaborative environments and enjoy turning complex problems into elegant, user-centered experiences.</p>
          <p className="text-gray-300 leading-relaxed text-xl md:text-2xl mb-7 iceland">I'm always eager to learn, grow, and contribute to meaningful work.</p>

          <ul className="mt-6 space-y-3">
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 text-3xl bg-white/25 backdrop-blur-md text-white shadow">
                <FontAwesomeIcon icon={faReact} />
              </span>
              <div>
                <p className="font-medium text-white big-shoulder uppercase">What I do</p>
                <p className="text-md text-gray-300 iceland">
                  Frontend and full-stack development — building responsive UIs, APIs and backends.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 text-3xl bg-white/25 backdrop-blur-md text-white shadow">
                <FontAwesomeIcon icon={faNodeJs} />
              </span>
              <div>
                <p className="font-medium text-white big-shoulder uppercase">Focus</p>
                <p className="text-md text-gray-300 iceland">
                  Performance, scalability, and writing maintainable codebases.
                </p>
              </div>
            </li>
          </ul>

          <div className="mt-6 inline-block border-scan ring-1 ring-white ring-offset-4 ring-offset-black">
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-5 py-3 bg-white text-black iceland text-xl font-bold uppercase hover:bg-gray-200 hover:shadow-[0_0px_7px_black] transition-shadow"
            >
              Contact Me <FontAwesomeIcon icon={faPhone} />
            </a>
          </div>
        </div>

        {/* RIGHT: Profile picture */}
        <div className="flex justify-center md:justify-end">
          <div className="w-80 h-90 sm:w-100 sm:h-150 relative rounded-full overflow-hidden ring-1 ring-white ring-offset-5 ring-offset-black shadow-2xl">
            <img
              src={profilePic}
              alt="Profile — Sane Chacko"
              width={1542}
              height={2313}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* EDUCATION / CAREER CARDS */}
      <div className="mt-12">
        <h3 className="text-3xl font-semibold text-white uppercase big-shoulder mb-6">Education & Career</h3>

        <div className="education-cards-section overflow-hidden pb-26 lg:pb-0 relative grid md:gap-12 md:grid-cols-1 lg:grid-cols-[300px_auto]">
          <div className='corner-border'>
            <div className="bg-white lg:h-[500px] md:h-[200px] p-1 md:p-2 lg:p-5 flex flex-col justify-center items-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <h3 className="oswald text-xl lg:text-2xl mb-1 lg:mb-4 text-black uppercase">Steps That Shaped Me</h3>
              <p className='iceland text-lg lg:text-xl text-black text-left mb-1 lg:mb-4 italic'>"Education is not the filling of a pail, but the lighting of a fire." — William Butler Yeats</p>
              <p className='iceland text-lg lg:text-xl text-black text-left mb-1 lg:mb-4'>Scroll down to trace the steps that shaped my passion, purpose, and potential.</p>
              <p className='iceland text-lg lg:text-xl text-black text-left italic'>“Every chapter added a new perspective — a new spark — that continues to guide me.”</p>
            </div>
          </div>
          
          <div className='education-cards grid mt-1 relative'>
            {education.map((item, index) => (
              <div key={index} className="education-card border-scan w-full lg:h-[calc(100%-100px)] bg-white/7 backdrop-blur-md p-8 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-700 ease-in-out" aria-labelledby={`edu-${item.title}`}>
                <div className="flex items-center gap-4 justify-center">
                  <span className="text-white text-2xl bg-white/20 backdrop-blur-md p-3 rounded-full shadow">
                    <FontAwesomeIcon icon={item.icon} />
                  </span>
                  <h4 className='text-xl sm:text-3xl text-white oswald'>{item.title}</h4>
                </div>
                <p className="text-lg sm:text-2xl text-white mb-1 sm:mb-2 iceland">{item.institute}</p>
                <p className="text-lg sm:text-2xl text-white mb-1 sm:mb-2 iceland">Year: {item.year}</p>
                <p className="text-lg sm:text-2xl text-white mb-1 sm:mb-2 iceland">Result: {item.score}</p>
                <p className="text-lg sm:text-2xl text-white mb-1 sm:mt-2 iceland">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SKILLS */}
      <div className="mt-12 skill">
        <h3 className="text-3xl font-semibold text-white mb-4 uppercase big-shoulder">Skills</h3>
        <div className='relative'>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={skillbg}
              alt="A Robot handling Tesseract"
              width={465}
              height={391}
              className="w-[400px]"
            />
          </div>
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
            {Object.entries(skills).map(([category, skillList]) => (
              <div key={category} >
                <h4 className="text-lg text-white bg-white/20 backdrop-blur-md font-small uppercase oswald mb-3 py-4 text-center border-scan">{category}</h4>
                <div className="grid grid-cols-4 gap-4">
                  {skillList.map((s) => (
                    <div
                      key={s.id}
                      className="group h-17 flex flex-col items-center justify-center p-0.5 bg-white/20 backdrop-blur-md transform transition overflow-hidden"
                      title={s.label}
                      role="img"
                      aria-label={s.label}
                    >
                      <div className="w-12 h-15 flex pt-3 text-5xl items-center justify-center text-white transform transition-transform duration-300 group-hover:scale-70">
                        {typeof s.icon === 'function' ? (
                          <s.icon />
                        ) : (
                          <FontAwesomeIcon icon={s.icon} />
                        )}
                      </div>
                      <div className="text-xs font-small text-gray-200 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-2">{s.label}</div>
                    </div>
                  ))}
                </div>  
              </div>
            ))}
          </div>  
        </div>  
      </div>
      
      
      <div className="mt-15 max-w-md mx-auto sm:flex sm:justify-center md:mt-18 download-resume">
        <div className="shadow border-scan ring-1 ring-white ring-offset-4 ring-offset-black">
          <a
            href="/Sane_Resume.pdf"
            download
            className="w-full inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold text-black iceland uppercase bg-white hover:bg-gray-200 transition-all hover:shadow-[0_0px_7px_black] md:py-4 md:text-xl md:px-10"
            aria-label="Download My Resume"
          >
            Download My Resume <FontAwesomeIcon icon={faDownload} className='ml-2'/>
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
