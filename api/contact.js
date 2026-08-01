import nodemailer from 'nodemailer';

const MIN_ELAPSED_MS = 3000; // fastest a human plausibly fills out the form
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = Number(process.env.CONTACT_MAX_PER_HOUR) || 5;
const MAX_TRACKED_IPS = 500; // bounds memory on a long-lived warm instance

const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
};

// same shape as the client-side check in src/pages/Contact.jsx
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GENERIC_FAILURE =
  'Something went wrong sending your message. Please email me directly instead.';

// Best-effort only: every warm instance keeps its own Map and a cold start wipes
// it, so this bounds casual abuse rather than enforcing an exact quota. Swap in
// Vercel KV / Upstash if the volume ever justifies it.
const hits = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  if (hits.size > MAX_TRACKED_IPS) {
    for (const [key, times] of hits) {
      const live = times.filter((t) => t > cutoff);
      if (live.length) hits.set(key, live);
      else hits.delete(key);
    }
  }

  const recent = (hits.get(ip) ?? []).filter((t) => t > cutoff);
  if (recent.length >= MAX_PER_WINDOW) {
    return {
      allowed: false,
      retryAfter: Math.ceil((recent[0] + RATE_LIMIT_WINDOW_MS - now) / 1000),
    };
  }

  recent.push(now);
  hits.set(ip, recent);
  return { allowed: true };
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded) && forwarded.length) return forwarded[0].split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

function readBody(req) {
  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) return req.body;
  return null;
}

// Anything interpolated into a mail header must not carry CR/LF, or a submitter
// can append headers of their own (a stray `Bcc:`, say) — SMTP header injection.
const singleLine = (value) => value.replace(/[\r\n]+/g, ' ').trim();

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (value) => value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);

function validate(body) {
  const errors = {};
  const field = (key) => (typeof body[key] === 'string' ? body[key].trim() : '');

  const name = field('name');
  const email = field('email');
  const message = field('message');

  if (!name) errors.name = 'Full name is required.';
  else if (name.length < LIMITS.name.min) errors.name = 'Please enter your full name.';
  else if (name.length > LIMITS.name.max)
    errors.name = `Name must be ${LIMITS.name.max} characters or fewer.`;

  if (!email) errors.email = 'Email is required.';
  else if (email.length > LIMITS.email.max || !EMAIL_RE.test(email))
    errors.email = 'Enter a valid email address.';

  if (!message) errors.message = 'Message cannot be empty.';
  else if (message.length < LIMITS.message.min)
    errors.message = 'Message should be at least 10 characters.';
  else if (message.length > LIMITS.message.max)
    errors.message = `Message must be ${LIMITS.message.max} characters or fewer.`;

  return { errors, values: { name, email, message } };
}

// ─── Email transport ────────────────────────────────────────────────────────
// Everything above is transport-agnostic. Moving to Resend (or any HTTP mail
// API) means replacing only this section; the handler just calls
// sendContactEmail({ name, email, message }) and expects it to throw on failure.

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      // Every timeout stays under the function's maxDuration (see vercel.json)
      // so a stalled handshake fails as a 500 rather than a platform timeout.
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    });
  }
  return transporter;
}

async function sendContactEmail({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  await getTransporter().sendMail({
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: singleLine(email),
    subject: `Portfolio Contact: Message from ${singleLine(name)}`,
    text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
      <hr>
      <p><em>Sent from your portfolio contact form</em></p>
    `,
  });
}
// ─── End email transport ────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const body = readBody(req);
  if (!body) {
    return res.status(400).json({ success: false, message: 'Malformed request body.' });
  }

  // Rate limit first so abusive traffic is capped regardless of which later
  // check it would have failed.
  const limit = rateLimit(clientIp(req));
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfter));
    return res.status(429).json({
      success: false,
      message: 'Too many messages from this connection. Please try again later.',
    });
  }

  // Honeypot: a field only an automated form-filler would populate. Answer with
  // success so the bot books a win and moves on, but send nothing.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    console.warn('Contact form: honeypot triggered');
    return res.status(200).json({ success: true });
  }

  // Timing gate. The client measures the interval itself via performance.now(),
  // so a wrong or skewed device clock can never lock a real visitor out.
  const elapsedMs = Number(body.elapsedMs);
  if (!Number.isFinite(elapsedMs) || elapsedMs < MIN_ELAPSED_MS) {
    return res.status(400).json({
      success: false,
      message: 'That came through unusually fast. Please try submitting again.',
    });
  }

  const { errors, values } = validate(body);
  if (Object.keys(errors).length) {
    return res.status(400).json({
      success: false,
      message: 'Please correct the highlighted fields.',
      errors,
    });
  }

  const missingEnv = ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_TO'].filter((key) => !process.env[key]);
  if (missingEnv.length) {
    console.error('Contact form: missing environment variables', missingEnv);
    return res.status(500).json({ success: false, message: GENERIC_FAILURE });
  }

  try {
    await sendContactEmail(values);
    return res.status(200).json({ success: true });
  } catch (error) {
    // Full detail to the runtime log, generic text to the browser — SMTP errors
    // name the account and the infrastructure behind it.
    console.error('Contact form: send failed', error);
    if (error?.response) console.error('SMTP response:', error.response);
    return res.status(500).json({ success: false, message: GENERIC_FAILURE });
  }
}
