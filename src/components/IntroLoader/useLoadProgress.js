import { useEffect, useState } from 'react';
import heroUrl from '../../assets/img/sc2.webp';
import loadFont from './loadFont';

// Every signal below is a real load event — no cosmetic timers. Weights are
// roughly proportional to each resource's byte cost; only the hero image
// reports byte-level granularity, the rest are done/not-done milestones.
const WEIGHTS = { image: 0.5, chunk: 0.25, fonts: 0.15, decode: 0.1 };

// Safety valves, not pacing: a hung font CDN or dropped connection must never
// trap the visitor behind the loader.
const FONT_TIMEOUT_MS = 4000;
const HARD_CAP_MS = 8000;

export default function useLoadProgress(active) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    let cancelled = false;
    const parts = { image: 0, chunk: 0, fonts: 0, decode: 0 };
    const update = () => {
      if (cancelled) return;
      setProgress(
        Object.keys(WEIGHTS).reduce((sum, k) => sum + parts[k] * WEIGHTS[k], 0)
      );
    };

    // 1) Hero image, streamed so the bar tracks actual bytes. This is the same
    //    hashed URL Home imports, so the HTTP cache hands it straight to the
    //    hero <img> after the reveal — nothing downloads twice.
    const image = (async () => {
      try {
        const res = await fetch(heroUrl);
        const total = Number(res.headers.get('Content-Length'));
        if (res.body && total > 0) {
          const reader = res.body.getReader();
          let received = 0;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            received += value.byteLength;
            parts.image = Math.min(1, received / total);
            update();
          }
        } else {
          // No Content-Length (some dev servers) — settle for done/not-done.
          await res.blob();
        }
      } catch {
        // Offline or blocked: mark done rather than hold the site hostage.
      }
      parts.image = 1;
      update();
    })();

    // 2) Decode off the warm cache so the reveal never paints a half-decoded hero.
    const decode = image.then(async () => {
      try {
        const img = new Image();
        img.src = heroUrl;
        await img.decode();
      } catch {
        // decode() can reject on rare cache races; not worth blocking over.
      }
      parts.decode = 1;
      update();
    });

    // 3) The lazily-split Home chunk — same module App's lazy() resolves, so
    //    Vite dedupes and Suspense mounts Home instantly once the loader lifts.
    const chunk = import('../../pages/Home')
      .catch(() => {})
      .then(() => {
        parts.chunk = 1;
        update();
      });

    // 4) The display faces the loader and hero are typeset in.
    const fonts = Promise.allSettled([
      loadFont('300 64px Codystar', FONT_TIMEOUT_MS),
      loadFont('700 64px "Big Shoulders Display"', FONT_TIMEOUT_MS),
      loadFont('400 32px Iceland', FONT_TIMEOUT_MS),
    ]).then(() => {
      parts.fonts = 1;
      update();
    });

    const cap = setTimeout(() => {
      Object.keys(parts).forEach((k) => {
        parts[k] = 1;
      });
      update();
    }, HARD_CAP_MS);

    Promise.allSettled([image, decode, chunk, fonts]).then(() => clearTimeout(cap));

    return () => {
      cancelled = true;
      clearTimeout(cap);
    };
  }, [active]);

  return progress;
}
