const REQUIRED_ENV = ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_TO'];

/**
 * Smoke test for the contact function's configuration.
 *
 * Reports only which variable NAMES are absent — never a value — so it is safe
 * to hit on a public deployment. Its main job is catching env vars that were
 * set for Production but not Preview (or vice versa): compare `environment`
 * against where you think you are.
 */
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ status: 'error', message: 'Method not allowed.' });
  }

  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

  return res.status(missing.length ? 503 : 200).json({
    status: missing.length ? 'degraded' : 'ok',
    mailConfigured: missing.length === 0,
    missing,
    environment: process.env.VERCEL_ENV ?? 'local',
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
  });
}
