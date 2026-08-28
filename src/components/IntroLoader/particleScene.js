import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

// This module is only ever loaded via dynamic import(), so ogl (~26KB gz)
// ships as its own chunk and never weighs down the eager bundle. If anything
// here fails (no WebGL, blocked canvas reads), createParticleScene returns
// null and IntroLoader falls back to its static DOM greeting.
//
// Architecture: TWO stacked layers.
//  - A WebGL particle layer that scatters, converges, and PACKS the glyph
//    interiors until the letters read as filled shapes.
//  - A crisp 2D-canvas text layer underneath, drawn in the same font with the
//    same mapping math. As the last particles settle, the layers cross-fade —
//    by then the packed particles already look essentially solid, so the
//    viewer sees dots tighten into type, never text "appearing".

// Choreography clock — deliberately independent of the load signal. The
// number shown to the visitor is real progress; these only pace the motion.
const CONVERGE_MS = 2400; // minimum time for scattered -> fully formed
// HOLD is sized so the whole ritual stays ~5s on a warm cache; the page-side
// 14s safety timers assume the worst case (8s load cap + full converge +
// hold + half burst ≈ 13s) — keep them in step if this changes.
const HOLD_MS = 1800; // solid text holds before releasing
const BURST_MS = 1100; // outward release
const CROSS_MS = 600; // packed particles -> solid text cross-fade
const TEXT_OUT_MS = 220; // solid text -> particles at burst
const BURST_IN_MS = 120; // particle layer returns for the burst

// Formed dots must TILE the glyph area. With random placement, coverage is
// Poisson: dotArea * count / inkArea ~ 3.6 leaves under ~3% pinholes, so the
// packed layer is near-indistinguishable from solid type. Dot size derives
// from this ratio at the current viewport, at every screen size and budget.
const PACK_RATIO = 3.6;

// The site's ink ladder, as both CSS fills (mask + crisp layer) and GL
// colors (particles). Display type is white with the accent reserved for
// punctuation — the SANE CHACKO. idiom — and labels sit a tier down (the
// hero's --hero-ink-label). The mask is DRAWN in these colors, every
// sampled pixel is classified back to its role, and the crisp layer paints
// the same segments in the same inks, so particles and text always agree.
const INK = {
  display: { css: '#ffffff', rgb: [1, 1, 1] },
  accent: { css: '#ff4500', rgb: [1, 69 / 255, 0] }, // CSS `orangered`
  // Orangered-as-text, lightened one step — the hero's --hero-accent-ink.
  accentInk: { css: '#ff5a1f', rgb: [1, 90 / 255, 31 / 255] },
  label: { css: '#a6a6a6', rgb: [166 / 255, 166 / 255, 166 / 255] },
};
// Index order must match the green-channel classification in the sampler.
const INK_RGB = [INK.display.rgb, INK.accent.rgb, INK.label.rgb, INK.accentInk.rgb];

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec3 aTarget;
attribute float aSeed;
attribute vec3 aColor;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uProgress;
uniform float uBurst;
uniform float uScale;
uniform float uDpr;
uniform float uFade;
uniform float uFormedPx;

varying float vAlpha;
varying vec3 vColor;

void main() {
    // Per-particle stagger: low-seed particles settle first, so the text
    // resolves progressively instead of snapping in as one block.
    float t = clamp(uProgress * 1.35 - aSeed * 0.35, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    float settle = 1.0 - t;

    // Scatter-field motion: a slow shared directional flow (the field slides
    // as one body, per-seed speed differences give parallax) plus a gentle
    // orbit, both dying out as the particle arrives on the glyph.
    float ang = uTime * (0.1 + aSeed * 0.3) + aSeed * 6.2831;
    vec3 swirl = vec3(cos(ang), sin(ang * 0.83 + aSeed * 4.0), sin(ang * 0.61)) * 0.5 * settle * settle;
    vec3 flow = vec3(0.05, -0.022, 0.03) * uTime * (0.4 + 0.6 * aSeed) * settle;

    vec3 pos = mix(position + swirl + flow, vec3(aTarget.xy * uScale, 0.0), t);

    // Exit: radiate from center and fade (uBurst goes 0 -> 1 once released).
    pos += normalize(pos + vec3(0.001, 0.002, 0.003)) * uBurst * uBurst * (2.5 + aSeed * 3.5);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Depth cue while scattered: nearer particles render bigger and brighter,
    // so the field reads as a volume, not flat noise. Formed size uFormedPx
    // is the packing diameter computed on resize (formed z == 0, so no
    // perspective correction is needed).
    float depthN = clamp((position.z + 1.5) / 3.0, 0.0, 1.0);
    float scatterSize = mix(1.6, 3.2, aSeed) * mix(0.55, 1.9, depthN) * uDpr * (3.0 / -mv.z);
    gl_PointSize = clamp(mix(scatterSize, uFormedPx, t), 1.0, 32.0);

    // uFade is the layer-level cross-fade (particles out at handoff, back in
    // for the burst); (1 - uBurst) fades the flying particles on exit.
    vAlpha = mix(mix(0.22, 0.75, depthN), 1.0, t) * (1.0 - uBurst) * uFade;
    vColor = aColor;
}
`;

const fragment = /* glsl */ `
precision highp float;

varying float vAlpha;
varying vec3 vColor;

void main() {
    // SQUARE sprite: Chebyshev distance (max of |x|,|y|) makes the falloff's
    // iso-lines square instead of round — a crisp square body with a thin
    // soft skirt for anti-aliasing and glow. Normal (non-additive) blending,
    // so dense overlaps can never brighten past their ink.
    vec2 p = abs(gl_PointCoord - 0.5);
    float d = max(p.x, p.y);
    float body = smoothstep(0.46, 0.36, d);
    float halo = smoothstep(0.5, 0.36, d) * 0.35;
    float a = min(body + halo * (1.0 - body), 1.0) * vAlpha;
    // Each particle carries its glyph's ink — white display, accent period,
    // label grey — assigned per target pixel when the mask is sampled.
    gl_FragColor = vec4(vColor, a);
}
`;

// Particle budget. Fewer, larger dots still pack filled letters (the sprite
// size compensates via PACK_RATIO), so phones run light: ~3,000 particles at
// 390x844, ~12,000 at 1911x890, capped at 20,000.
function particleCount() {
  const area = window.innerWidth * window.innerHeight;
  let n = Math.round(area / 140);
  if ((navigator.hardwareConcurrency || 8) <= 4) n = Math.min(n, 6000);
  return Math.max(3000, Math.min(n, 20000));
}

// Both greeting lines are particle-animated on every viewport. textCanvas is
// the crisp 2D layer this scene draws and cross-fades in at the handoff.
export function createParticleScene(canvas, { heading, headingMark, subtitle, textCanvas }) {
  try {
    if (!textCanvas) return null;
    // Mask resolution: half the old 3000x1400 — identical relative glyph
    // detail (the sample grid below halved with it, 2px -> 1px) for a quarter
    // of the main-thread getImageData readback (~4MB vs ~17MB) on low-end
    // phones.
    const W = 1500;
    const H = 700;
    // Iceland for BOTH the particle mask and the solid text layer — identical
    // font, size, and baseline math keeps the layers registered exactly.
    const FAMILY = 'Iceland, "Arial Narrow", sans-serif';
    // The hero seats its role brackets a 0.9rem flex-gap plus the line's
    // tracking away from the text — ~0.69em (desktop) to ~0.88em (phone) of
    // its fluid type. Target the middle (~0.75em): each segment already
    // trails its own 0.32em track, and this extra advance makes up the rest.
    const BRACKET_GAP = 0.75 - 0.32;
    const lines = [
      {
        px: 340,
        y: 240,
        weight: 400,
        family: FAMILY,
        fill: true,
        segments: [
          { text: heading, ink: INK.display },
          { text: headingMark || '', ink: INK.accent },
        ],
      },
      // The subtitle wears the hero role-line's bracket idiom — label-grey
      // [ ] seated a gap from accent-ink text — in tracked caps at the
      // kickers' 0.32em, sized against the capped display line at ~0.15,
      // the hero's label-to-display ratio. Tracking is applied identically
      // to both canvases (and to the fit measurement); engines without
      // ctx.letterSpacing ignore it on both layers alike, so registration
      // is never at risk.
      {
        px: 78,
        y: 540,
        weight: 400,
        family: FAMILY,
        track: 0.32,
        segments: [
          { text: '[', ink: INK.label, gap: BRACKET_GAP },
          { text: subtitle, ink: INK.accentInk, glow: true, gap: BRACKET_GAP },
          { text: ']', ink: INK.label },
        ],
      },
    ];

    const mask = document.createElement('canvas');
    mask.width = W;
    mask.height = H;
    const ctx = mask.getContext('2d', { willReadFrequently: true });
    // Segmented lines draw by cursor from a computed left edge (each segment
    // carries its own ink), so alignment is 'left', not 'center'.
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Does this engine hang letter-spacing off the LAST glyph too, CSS
    // style? Probed once and trusted for both layers — the same engine
    // renders both, and engines without ctx.letterSpacing measure 0 here.
    ctx.letterSpacing = '100px';
    const spacedProbe = ctx.measureText('A').width;
    ctx.letterSpacing = '0px';
    const TRAILING_TRACK = spacedProbe - ctx.measureText('A').width > 50 ? 1 : 0;

    // One type setter for measuring, the mask, and the crisp layer: same
    // font string, same letter-spacing (proportional to px, so the linear
    // fit math still holds) on every context that touches the glyphs.
    const setType = (c, line, px) => {
      c.font = `${line.weight} ${px}px ${line.family}`;
      c.letterSpacing = `${(line.track || 0) * px}px`;
    };
    const lineWidth = (c, line, px) => {
      setType(c, line, px);
      return line.segments.reduce(
        (sum, s) => sum + c.measureText(s.text).width + (s.gap || 0) * px,
        0
      );
    };
    // Draw a line's segments left-to-right in their own inks from a
    // glyph-centred start: the trailing letter-space the engine hangs off
    // the last glyph is excluded from the centring math (the DOM wordmark
    // cancels the same overhang with a negative margin). Shared by the mask
    // and the crisp layer, so their glyph positions agree by construction.
    const drawLine = (c, line, px, cx, y, glow) => {
      setType(c, line, px);
      const widths = line.segments.map((s) => c.measureText(s.text).width);
      const total = widths.reduce(
        (sum, wid, i) => sum + wid + (line.segments[i].gap || 0) * px,
        0
      );
      let x = cx - (total - (line.track || 0) * px * TRAILING_TRACK) / 2;
      line.segments.forEach((s, i) => {
        c.fillStyle = s.ink.css;
        // The hero role's soft accent glow (0 0 14px at 1.9rem ≈ 0.46em) —
        // crisp layer only: shadow pixels in the MASK would smear the
        // particle targets and misclassify their inks.
        if (glow && s.glow) {
          c.shadowColor = 'rgba(255, 69, 0, 0.4)';
          c.shadowBlur = 0.46 * px;
        } else {
          c.shadowColor = 'transparent';
          c.shadowBlur = 0;
        }
        c.fillText(s.text, x, y);
        x += widths[i] + (s.gap || 0) * px;
      });
    };
    // The fill line may not outgrow the height proportion the old greeting
    // proved out (1066/1400 of the mask) — narrower copy would otherwise
    // scale up until ascenders clip at the mask edge.
    const FILL_MAX = Math.floor(H * 0.76);
    const fittedPx = (line) => {
      const measured = lineWidth(ctx, line, line.px);
      // fill: grow OR shrink so the heading spans the mask; otherwise
      // shrink-only.
      if (line.fill || measured > W * 0.96) {
        const px = Math.floor((line.px * W * 0.96) / measured);
        return line.fill ? Math.min(px, FILL_MAX) : px;
      }
      return line.px;
    };

    // Rasterize all lines once; sample opaque pixels on a fine grid as the
    // particle target pool. Uniform random draws from this pool spread the
    // particles evenly across the ENTIRE filled letterform — interiors and
    // edges alike — so the glyphs pack, never outline.
    const fitted = lines.map((line) => fittedPx(line));
    lines.forEach((line, i) => drawLine(ctx, line, fitted[i], W / 2, line.y));
    const img = ctx.getImageData(0, 0, W, H).data;
    const pool = [];
    const poolInk = [];
    for (let y = 0; y < H; y += 1) {
      for (let x = 0; x < W; x += 1) {
        const o = (y * W + x) * 4;
        if (img[o + 3] > 128) {
          pool.push(x, y);
          // Classify the pixel back to its ink by green channel — display
          // g=255, label g=166, accent-ink g=90, accent g=69. Interior
          // pixels are exact fills, so the thresholds only arbitrate
          // anti-aliased edges. Order matches INK_RGB.
          const g = img[o + 1];
          poolInk.push(g > 200 ? 0 : g > 120 ? 2 : g > 79 ? 3 : 1);
        }
      }
    }
    if (pool.length < 8) return null;
    // Each pool entry stands for one mask px; total ink area in mask px^2
    // drives the packing-size computation in resize().
    const inkMaskArea = pool.length / 2;

    const count = particleCount();
    const targets = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const p = (Math.random() * (pool.length / 2)) | 0;
      // 1 world unit == full mask width; tiny jitter hides the sampling grid.
      targets[i * 3] = (pool[p * 2] - W / 2) / W + (Math.random() - 0.5) * 0.0015;
      targets[i * 3 + 1] = -(pool[p * 2 + 1] - H / 2) / W + (Math.random() - 0.5) * 0.0015;
      targets[i * 3 + 2] = 0;
      const ink = INK_RGB[poolInk[p]];
      colors[i * 3] = ink[0];
      colors[i * 3 + 1] = ink[1];
      colors[i * 3 + 2] = ink[2];
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new Renderer({ canvas, dpr, alpha: true, depth: false, antialias: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 45, near: 0.1, far: 60 });
    camera.position.z = 4;
    const visibleHeight = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);

    const scatter = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Wide scatter shell with real z-depth — particles drift in from
      // beyond the viewport edges; z stays in front of the camera.
      const r = 1.8 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      scatter[i * 3] = Math.cos(theta) * r;
      scatter[i * 3 + 1] = (Math.random() - 0.5) * 3.4;
      scatter[i * 3 + 2] = (Math.random() - 0.5) * 3.0;
      seeds[i] = Math.random();
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: scatter },
      aTarget: { size: 3, data: targets },
      aSeed: { size: 1, data: seeds },
      aColor: { size: 3, data: colors },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uBurst: { value: 0 },
        uScale: { value: 1 },
        uDpr: { value: dpr },
        uFade: { value: 1 },
        uFormedPx: { value: 6 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    // NORMAL alpha blending, not additive: overlapping sprites can't sum
    // past the base color, so the hue never drifts toward yellow.
    program.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const points = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    const tctx = textCanvas.getContext('2d');
    textCanvas.style.opacity = '0';

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / h });
      // The text block dominates: ~94% of the visible width, capped so it
      // never towers on ultrawide screens.
      const visibleWidth = visibleHeight * (w / h);
      const scale = Math.min(visibleWidth * 0.94, 5.2);
      program.uniforms.uScale.value = scale;

      // Packing size: spread the whole budget over the on-screen ink area at
      // PACK_RATIO coverage, so the converged dots read as filled letters.
      // Square sprites cover d^2 each, so no circle-area correction needed.
      const unit = (scale * (h / visibleHeight)) / W; // mask px -> css px
      const inkCss = inkMaskArea * unit * unit;
      const dCss = Math.sqrt((PACK_RATIO * inkCss) / count);
      program.uniforms.uFormedPx.value = Math.min(Math.max(dCss, 3), 15) * dpr;

      // Crisp text layer, registered EXACTLY onto the particle targets: the
      // same font string, the same middle baseline, and the same mask->world
      // ->screen mapping the targets go through. maskPx * unit == cssPx.
      textCanvas.width = Math.round(w * dpr);
      textCanvas.height = Math.round(h * dpr);
      textCanvas.style.width = `${w}px`;
      textCanvas.style.height = `${h}px`;
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tctx.clearRect(0, 0, w, h);
      tctx.textAlign = 'left';
      tctx.textBaseline = 'middle';
      lines.forEach((line, i) => {
        const worldY = (-(line.y - H / 2) / W) * scale;
        const sy = (0.5 - worldY / visibleHeight) * h;
        drawLine(tctx, line, fitted[i] * unit, w / 2, sy, true);
      });
    };
    resize();
    window.addEventListener('resize', resize);

    let ceiling = 0;
    let converge = 0;
    let lastTime = 0;
    let crossStart = 0;
    let burstQueued = false;
    let holdStart = 0;
    let onBurstDone = null;
    let lastTextOpacity = -1;
    let raf;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = lastTime ? Math.min(now - lastTime, 100) : 16;
      lastTime = now;
      program.uniforms.uTime.value = now * 0.001;

      // Convergence advances monotonically toward the real-progress ceiling,
      // rate-capped so scattered -> formed always takes at least CONVERGE_MS
      // of continuous one-directional motion. A fast load gets the full
      // cinematic; a stalled load holds mid-way and resumes — never snaps.
      converge = Math.min(ceiling, converge + dt / CONVERGE_MS);
      program.uniforms.uProgress.value = converge;

      // Handoff: the packed particle layer yields to the solid text — same
      // shape, same color, near-identical frames, so the swap is invisible.
      if (converge >= 1 && !crossStart) crossStart = now;
      const cross = crossStart ? Math.min((now - crossStart) / CROSS_MS, 1) : 0;

      if (burstQueued && !holdStart && converge >= 1) holdStart = now;
      let burstB = 0;
      let sinceBurst = -1;
      if (holdStart) {
        sinceBurst = now - holdStart - HOLD_MS;
        burstB = Math.min(Math.max(sinceBurst / BURST_MS, 0), 1);
        program.uniforms.uBurst.value = burstB * burstB;
        // Hand back to the overlay fade mid-burst so the two motions overlap.
        if (burstB >= 0.5 && onBurstDone) {
          onBurstDone();
          onBurstDone = null;
        }
      }

      // STAGED handoff: the text layer reaches full opacity in the first 55%
      // of the cross while the particles only start clearing after 45% — the
      // two overlap at near-full strength mid-way, so the glyphs' combined
      // opacity never dips and there is no visible seam between the packed
      // pieces and the font. At the burst the particles return (already on
      // the glyphs) while the text slips out underneath them.
      let textOpacity = Math.min(cross / 0.55, 1);
      let particleFade = 1 - Math.min(Math.max((cross - 0.45) / 0.55, 0), 1);
      if (sinceBurst >= 0) {
        particleFade = Math.max(particleFade, Math.min(sinceBurst / BURST_IN_MS, 1));
        textOpacity = cross * (1 - Math.min(sinceBurst / TEXT_OUT_MS, 1));
      }
      program.uniforms.uFade.value = particleFade;
      if (textOpacity !== lastTextOpacity) {
        textCanvas.style.opacity = String(textOpacity);
        lastTextOpacity = textOpacity;
      }

      renderer.render({ scene: points, camera });
    };
    raf = requestAnimationFrame(frame);

    return {
      setProgress(p) {
        // Monotonic by construction; snap the last fraction so float dust in
        // the weight sum can't leave the ceiling at 0.9999 forever.
        ceiling = Math.max(ceiling, p >= 0.999 ? 1 : p);
      },
      burst() {
        return new Promise((resolve) => {
          onBurstDone = resolve;
          burstQueued = true;
        });
      },
      destroy() {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      },
    };
  } catch {
    return null;
  }
}
