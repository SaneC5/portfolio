import React, { useState } from 'react';

// Gallery <img> that fades in once loaded. The caller must already reserve
// the image's space (width/height attributes or a fixed-size frame), so the
// fade itself never shifts layout. Pass a `key` tied to `src` when the source
// can change in place (sliders/lightboxes) so the fade re-runs per image.
const FadeImage = ({ className = '', onLoad, ...props }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      decoding="async"
      {...props}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={`${className} transition duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};

export default FadeImage;
