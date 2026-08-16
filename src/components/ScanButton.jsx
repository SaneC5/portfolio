import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SIZES = {
  sm: 'gap-2 px-3 py-1.5 text-sm',
  md: 'gap-3 px-5 py-3 text-xl',
  lg: 'gap-2 px-8 py-3 text-base md:py-4 md:text-xl md:px-10',
};

/**
 * Framed action button: white uppercase pill inside the border-scan corner
 * brackets, with the hover scan-line. Renders a <Link> when given `to`, an
 * <a> when given `href` (plus `external`/`download`), a <button> when given
 * `type`, and a plain <span> otherwise (e.g. a "Not Live" tag).
 */
const ScanButton = ({
  to,
  href,
  external = false,
  download = false,
  type,
  size = 'md',
  full = false,
  ring = true,
  wrapperClassName = '',
  ariaLabel,
  disabled = false,
  icon,
  iconSpin = false,
  children,
}) => {
  const interactive = Boolean(to || href || type);
  const innerClassName = [
    'inline-flex items-center justify-center bg-white text-black iceland font-bold uppercase',
    interactive ? 'hover:bg-gray-200 hover:shadow-[0_0px_7px_black] transition-all cursor-pointer' : '',
    type ? 'disabled:opacity-60 disabled:cursor-not-allowed' : '',
    SIZES[size] || SIZES.md,
    full ? 'w-full' : '',
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {children}
      {icon && <FontAwesomeIcon icon={icon} spin={iconSpin} />}
    </>
  );

  const shared = { className: innerClassName, 'aria-label': ariaLabel };

  let inner;
  if (to) {
    inner = <Link to={to} {...shared}>{content}</Link>;
  } else if (href) {
    inner = (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(download ? { download: true } : {})}
        {...shared}
      >
        {content}
      </a>
    );
  } else if (type) {
    inner = <button type={type} disabled={disabled} {...shared}>{content}</button>;
  } else {
    inner = <span {...shared}>{content}</span>;
  }

  return (
    <div
      className={[
        'border-scan',
        ring ? 'border-scan-frame' : '',
        wrapperClassName,
      ].filter(Boolean).join(' ')}
    >
      {inner}
    </div>
  );
};

export default ScanButton;
