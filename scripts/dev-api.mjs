// Local stand-in for the Vercel Node runtime, for use without the Vercel CLI.
//
// It imports the REAL api/*.js handlers - the same files that deploy - and only
// emulates what Vercel wraps around them: path routing, body parsing, the
// res.status()/res.json() helpers, and the maxDuration cutoff.
//
// Run it alongside Vite: `npm run dev:api` in one terminal, `npm run dev` in
// another. vite.config.js proxies /api to this port.
//
// Known gaps vs. production (see README notes):
//   - VERCEL_ENV / VERCEL_GIT_COMMIT_SHA are absent, so /api/health reports
//     environment "local" and commit null. That is the correct answer here.
//   - x-forwarded-for is synthesised from the local socket, so the rate limiter
//     sees one key for every request from your machine.
//   - Each edit to a handler re-imports it, which behaves like a cold start and
//     resets the in-memory rate limiter.

import { createServer } from 'node:http';
import { stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.API_PORT) || 3001;
const MAX_DURATION_MS = 15_000; // mirrors the maxDuration in vercel.json

const ROUTES = {
  '/api/contact': `${ROOT}/api/contact.js`,
  '/api/health': `${ROOT}/api/health.js`,
};

// Cache handlers by mtime so editing a file picks up the change on next request.
const cache = new Map();

async function loadHandler(file) {
  const { mtimeMs } = await stat(file);
  const hit = cache.get(file);
  if (hit?.mtimeMs === mtimeMs) return hit.handler;

  const mod = await import(`${pathToFileURL(file).href}?v=${mtimeMs}`);
  const handler = mod.default;
  if (typeof handler !== 'function') throw new Error(`${file} has no default export function`);
  cache.set(file, { mtimeMs, handler });
  if (hit) console.log(`  reloaded ${file.replace(ROOT, '.')}`);
  return handler;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks);
  if (!raw.length) return undefined;

  const text = raw.toString('utf8');
  const type = (req.headers['content-type'] ?? '').split(';')[0].trim();
  if (type === 'application/json') {
    try {
      return JSON.parse(text);
    } catch {
      return text; // let the handler's own guard produce the 400
    }
  }
  return text;
}

function decorate(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    if (!res.headersSent && !res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(body));
    return res;
  };
  res.send = (body) => {
    res.end(typeof body === 'string' ? body : JSON.stringify(body));
    return res;
  };
  return res;
}

const server = createServer(async (req, res) => {
  const started = Date.now();
  const path = new URL(req.url, `http://localhost:${PORT}`).pathname;
  const file = ROUTES[path];

  decorate(res);

  if (!file) {
    res.status(404).json({ error: `No function for ${path}` });
    console.log(`  404  ${req.method} ${path}`);
    return;
  }

  // Vercel populates this from its edge proxy; the handler keys its rate
  // limiter on it, so give it something stable locally.
  if (!req.headers['x-forwarded-for']) {
    req.headers['x-forwarded-for'] = req.socket.remoteAddress ?? '127.0.0.1';
  }

  try {
    req.body = await readBody(req);
    const handler = await loadHandler(file);

    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('FUNCTION_INVOCATION_TIMEOUT')), MAX_DURATION_MS);
    });

    try {
      await Promise.race([handler(req, res), timeout]);
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    console.error(`  ERROR ${req.method} ${path}:`, error.message);
    if (!res.headersSent) {
      const timedOut = error.message === 'FUNCTION_INVOCATION_TIMEOUT';
      res.status(timedOut ? 504 : 500).json({
        success: false,
        message: timedOut ? 'Function exceeded maxDuration.' : 'Unhandled error in function.',
      });
    }
  }

  if (!res.writableEnded) res.end();
  console.log(`  ${res.statusCode}  ${req.method} ${path}  ${Date.now() - started}ms`);
});

const missing = ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_TO'].filter((k) => !process.env[k]);

server.listen(PORT, () => {
  console.log(`\nAPI functions on http://localhost:${PORT}`);
  for (const route of Object.keys(ROUTES)) console.log(`  ${route}`);
  if (missing.length) {
    console.log(`\n  WARNING: missing ${missing.join(', ')}`);
    console.log('  Create .env.local in the project root with those keys.');
    console.log('  Sends will fail with a 500 until you do.\n');
  } else {
    console.log('\n  Mail env vars loaded. Ready.\n');
  }
});
