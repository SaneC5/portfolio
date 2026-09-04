import { Link } from 'react-router-dom';
import './sheet.css';

/**
 * Sheet endcap — the sheet's one centred action, set as a dimension line
 * gapped for its label (the hero HUD's idiom): rule segments with outer end
 * ticks flanking a text link. Sheets 01 and 02 close this way; Sheet 03
 * (Method) deliberately does not — the footer's LET'S TALK is its call to
 * action, and a third endcap in a row would compete with it.
 *
 * Presentational only. The owning section animates it from inside its own
 * gsap.context via playSheetEndcap() (sheetMotion.js).
 */
const SheetEndcap = ({ to, label, ariaLabel }) => (
  <div className="sheet-endcap">
    <span className="sheet-endcap-rule sheet-endcap-rule--l" aria-hidden="true" />
    <Link to={to} className="sheet-endcap-link" aria-label={ariaLabel}>
      {label}
    </Link>
    <span className="sheet-endcap-rule sheet-endcap-rule--r" aria-hidden="true" />
  </div>
);

export default SheetEndcap;
