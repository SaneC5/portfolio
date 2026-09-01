import { m } from 'motion/react';
import ScanButton from '../components/ScanButton';
import BriefcaseIcon from '../components/icons/BriefcaseIcon';
import SendPlaneIcon from '../components/icons/SendPlaneIcon';
import DownloadTrayIcon from '../components/icons/DownloadTrayIcon';
import PhoneIcon from '../components/icons/PhoneIcon';

/**
 * Dev-only calibration page at /icon-lab (excluded from production
 * builds by the import.meta.env.DEV guard in App.jsx). Shows every
 * signature icon at production button size and magnified next to type,
 * so optical weight is compared in one place instead of per-page — add
 * new icons to SPECIMENS when calibrating them. The magnified tiles are
 * motion parents, so hovering them previews the choreography at large
 * scale; the pinned rows freeze end poses via initial=. The intro loader
 * runs here like everywhere else — press Escape to skip it.
 */
const SPECIMENS = [
  { label: 'Send Message', icon: SendPlaneIcon, size: 'md', note: 'reference' },
  { label: 'Discover My Creations', icon: BriefcaseIcon, size: 'lg' },
  { label: 'Download My Resume', icon: DownloadTrayIcon, size: 'lg' },
  { label: 'Contact Me', icon: PhoneIcon, size: 'md' },
];

const IconLab = () => (
  <div className="mx-auto max-w-5xl px-4 py-16 flex flex-col gap-14">
    <section>
      <h1 className="iceland text-2xl text-white uppercase mb-6">Icon lab — production size</h1>
      <div className="flex flex-wrap items-start gap-6">
        {SPECIMENS.map(({ label, icon, size }) => (
          <ScanButton key={label} to="/icon-lab" size={size} icon={icon}>
            {label}
          </ScanButton>
        ))}
      </div>
    </section>

    <section>
      <h2 className="iceland text-2xl text-white uppercase mb-6">Magnified — hover to preview</h2>
      <div className="flex flex-wrap gap-6">
        {SPECIMENS.map(({ label, icon: Icon, note }) => (
          <m.div
            key={label}
            initial="rest"
            whileHover="hover"
            whileTap="press"
            className="bg-white text-black iceland font-bold uppercase inline-flex items-end gap-4 px-6 py-5"
            style={{ fontSize: '80px', lineHeight: 1 }}
            title={note ? `${label} (${note})` : label}
          >
            AB
            <Icon />
          </m.div>
        ))}
      </div>
    </section>

    {/* States frozen via initial= — resolved to static styles at render,
        so end poses are inspectable (and screenshotable headlessly)
        without holding a pointer or relying on mount-time animation. */}
    <PinnedRow title="Pinned hover — magnified" state="hover" fontSize="80px" />
    <PinnedRow title="Pinned hover — production floor (16px)" state="hover" fontSize="16px" />
    <PinnedRow title="Pinned press — magnified" state="press" fontSize="80px" />
  </div>
);

const PinnedRow = ({ title, state, fontSize }) => (
  <section>
    <h2 className="iceland text-2xl text-white uppercase mb-6">{title}</h2>
    <div className="flex flex-wrap gap-6">
      {SPECIMENS.map(({ label, icon: Icon }) => (
        <m.div
          key={label}
          initial={state}
          className="bg-white text-black iceland font-bold uppercase inline-flex items-end gap-4 px-6 py-5"
          style={{ fontSize, lineHeight: 1 }}
        >
          AB
          <Icon />
        </m.div>
      ))}
    </div>
  </section>
);

export default IconLab;
