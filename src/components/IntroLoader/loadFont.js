// document.fonts.load() resolves immediately with an empty match list when
// the @font-face isn't registered yet — and ours arrive late, via Google's
// CSS @import. So poll until the face exists and actually loads, bounded by
// a timeout so a hung font CDN can't stall anything that awaits this.
export default async function loadFont(spec, timeoutMs) {
  const deadline = performance.now() + timeoutMs;
  for (;;) {
    try {
      const faces = await document.fonts.load(spec);
      if (faces.length > 0) return true;
    } catch {
      // Malformed/unknown spec — treat like "not registered yet" and retry.
    }
    if (performance.now() >= deadline) return false;
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
}
