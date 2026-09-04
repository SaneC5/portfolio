import './sheet.css';

/**
 * Sheet header — the drawing-set convention shared by every homepage section
 * between the hero and the footer: kicker rule + tracked Iceland caps (the
 * hero kicker's geometry), a Big Shoulders title in a masked line window,
 * and a full-width hairline rule. Sections are numbered as SHEETs so the
 * labels never collide with Home's FIG sequence (hero 01–02, footer 03).
 *
 * Presentational only — it renders the finished frame. The owning section
 * animates it from inside its own gsap.context via playSheetHeader()
 * (sheetMotion.js). With JS disabled or reduced motion nothing ever hides
 * (the hero's contract).
 */
const SheetHeader = ({ index, kicker, title, id }) => (
  <header className="sheet-header">
    <p className="sheet-kicker iceland">
      <span className="sheet-kicker-rule" aria-hidden="true" />
      SHEET {index} — {kicker}
    </p>
    <h2 id={id} className="sheet-title big-shoulder">
      <span className="sheet-title-line">
        <span className="sheet-title-inner">
          {title}
          <span className="sheet-title-dot">.</span>
        </span>
      </span>
    </h2>
    <span className="sheet-rule" aria-hidden="true" />
  </header>
);

export default SheetHeader;
