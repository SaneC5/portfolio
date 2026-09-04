import { Fragment, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SheetHeader from '../SheetHeader';
import SheetEndcap from '../SheetEndcap';
import { playSheetHeader, playSheetEndcap } from '../sheetMotion';
import './TechnicalSpec.css';

gsap.registerPlugin(ScrollTrigger);

// Capability schedule — what Sane can be hired to do, one row per kind of
// work. SPEC lines come from the projects' builtWith and the About page's
// skills data; REFs are Projects page slugs (src/pages/Projects.jsx), so the
// sheet cross-references Sheet 01 instead of repeating its stacks. The
// Motion row's evidence is this site itself, so it stays plain text — a link
// to its own card would be circular. Rows are unnumbered: they are not a
// sequence, and the page already carries SHEET and PLATE numbers.
//
// TODO(copy): `desc` lines are best-guess drafts — plain sentences, no
// figures — for Sane to rewrite.
const ROWS = [
  {
    name: 'WEB APPLICATIONS',
    desc: 'Product-grade apps with accounts, billing, admin tooling and WCAG auditing built in.',
    spec: ['NEXT.JS', 'REACT', 'TYPESCRIPT', 'NODE.JS', 'EXPRESS', 'SQL', 'STRIPE'],
    refs: [{ label: 'ZYLYN', to: '/projects#zylyn' }],
  },
  {
    name: 'E-COMMERCE',
    desc: 'Storefronts, carts and order management — custom-built or on WooCommerce.',
    spec: ['NODE.JS', 'SQL', 'WOOCOMMERCE', 'PHP', 'MYSQL'],
    refs: [
      { label: 'KONDAJI', to: '/projects#kondaji' },
      { label: 'SHAY & COMPANY', to: '/projects#shay-and-company' },
    ],
  },
  {
    name: 'MARKETING SITES & CMS',
    desc: 'Static-first marketing sites with headless or classic WordPress editing behind them.',
    spec: ['ASTRO', 'REACT', 'WORDPRESS', 'TAILWIND'],
    refs: [
      { label: 'ZUPER', to: '/projects#zuper' },
      { label: 'MILL PLAIN DENTAL', to: '/projects#mill-plain-dental' },
    ],
  },
  {
    name: 'AUTOMATION & AI WORKFLOWS',
    desc: 'Calling, scheduling and data hand-offs wired through automation platforms and AI agents.',
    spec: ['MAKE.COM', 'RETELL AI', 'CAL.COM', 'GOOGLE SHEETS', 'MCP'],
    refs: [{ label: 'AI CALLING', to: '/projects#retell' }],
  },
  {
    name: 'MOTION & INTERFACE',
    desc: 'Animated, accessible front-ends where the motion is measured and supports the content.',
    spec: ['GSAP', 'MOTION', 'WEBGL', 'TAILWIND'],
    refs: [{ label: 'THIS SITE' }],
  },
];

const TechnicalSpec = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    // Reduced motion: no entrance. Every hidden state below is applied by
    // GSAP, so bailing out here leaves the finished frame.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      playSheetHeader(rootRef.current.querySelector('.sheet-header'));

      // The sheet rules itself first — every hairline draws left-to-right in
      // a short cascade — then the rows rise into the ruled space.
      gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: '.spec-schedule', start: 'top 78%', once: true },
        })
        .fromTo('.spec-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut', stagger: 0.06 }, 0)
        .fromTo('.spec-row-inner', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 }, 0.25);

      playSheetEndcap(rootRef.current.querySelector('.sheet-endcap'));
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="technical-spec"
      aria-labelledby="spec-title"
      className="spec sheet mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <SheetHeader index="02" kicker="TECHNICAL SPEC" title="Scope of work" id="spec-title" />

      <div className="spec-schedule mt-12 lg:mt-14">
        <span className="spec-rule" aria-hidden="true" />
        <ul aria-label="Capabilities">
          {ROWS.map((row) => (
            <li key={row.name} className="spec-row">
              <div className="spec-row-inner">
                <div className="spec-term">
                  <h3 className="spec-name big-shoulder">{row.name}</h3>
                  <p className="spec-desc oswald">{row.desc}</p>
                </div>

                <dl className="spec-meta iceland">
                  <div className="spec-meta-row">
                    <dt>SPEC</dt>
                    <dd>
                      {row.spec.map((item) => (
                        <span key={item} className="spec-item">
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div className="spec-meta-row">
                    <dt>REF</dt>
                    <dd>
                      {row.refs.map((ref, i) => (
                        <Fragment key={ref.label}>
                          {i > 0 && (
                            <span className="spec-sep" aria-hidden="true">
                              /
                            </span>
                          )}
                          {ref.to ? (
                            <Link to={ref.to} className="sheet-link" aria-label={`${ref.label} — project details`}>
                              {ref.label}
                            </Link>
                          ) : (
                            <span className="spec-ref-plain">{ref.label}</span>
                          )}
                        </Fragment>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
              <span className="spec-rule" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>

      {/* Capabilities → credentials: the sheet closes on the certificates page,
          the way Sheet 01 closes on all projects. */}
      <SheetEndcap to="/certificates" label="Certificates" ariaLabel="View certificates" />
    </section>
  );
};

export default TechnicalSpec;
