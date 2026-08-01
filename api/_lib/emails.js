// Email templates + the sanitisers they depend on.
//
// Vercel ignores files under api/ whose name starts with `_`, so this is shared
// code, not a route. Every function here is pure: it takes validated values and
// returns { subject, html, text }. Nothing in this file knows how mail is sent,
// so the transport in api/contact.js stays swappable.
//
// HTML-email constraints this file works within: table-based layout, inline
// styles only, no flexbox/grid, no external assets, no web fonts.

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);

// Values interpolated into mail headers must not carry CR/LF, or a submitter
// can append headers of their own (a stray `Bcc:`) -- SMTP header injection.
export const singleLine = (value) => String(value).replace(/[\r\n]+/g, ' ').trim();

const BRAND = {
  name: 'Sane Chacko',
  role: 'Full Stack Web Developer',
  ink: '#1c1c1e',
  accent: '#ff6b1a',
  page: '#f4f4f5',
  card: '#ffffff',
  border: '#e5e7eb',
  muted: '#6b7280',
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const SOCIALS = [
  ['LinkedIn', 'https://www.linkedin.com/in/sane-chacko-a0969b33a'],
  ['Instagram', 'https://www.instagram.com/sane_chacko_95'],
  ['WhatsApp', 'https://wa.me/9594023995'],
];

const firstName = (name) => singleLine(name).split(/\s+/)[0] || 'there';

function receivedAt() {
  try {
    return new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    }) + ' IST';
  } catch {
    return new Date().toISOString();
  }
}

/** Renders user text as HTML paragraphs, escaped, with blank lines preserved. */
function paragraphs(text, style) {
  return escapeHtml(text)
    .split(/\n{2,}/)
    .map((block) => `<p style="${style}">${block.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/** Shared chrome: page background, 600px card, dark header, footer. */
function layout({ preheader, eyebrow, heading, body, footer }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(heading)}</title>
<style>
  @media screen and (max-width:600px){
    .card{width:100% !important;}
    .pad{padding-left:24px !important;padding-right:24px !important;}
    .h1{font-size:26px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:${BRAND.page};">
<div style="display:none;font-size:1px;color:${BRAND.page};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.page};">
<tr><td align="center" style="padding:32px 12px;">

  <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:${BRAND.card};border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

    <tr><td style="height:5px;background-color:${BRAND.accent};font-size:0;line-height:0;">&nbsp;</td></tr>

    <tr><td class="pad" style="background-color:${BRAND.ink};padding:30px 40px;">
      <p style="margin:0 0 8px;font-family:${BRAND.font};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${BRAND.accent};font-weight:700;">${escapeHtml(eyebrow)}</p>
      <h1 class="h1" style="margin:0;font-family:${BRAND.font};font-size:30px;line-height:1.25;color:#ffffff;font-weight:700;">${escapeHtml(heading)}</h1>
    </td></tr>

    <tr><td class="pad" style="padding:36px 40px 8px;">${body}</td></tr>

    <tr><td class="pad" style="padding:24px 40px 32px;border-top:1px solid ${BRAND.border};">${footer}</td></tr>

  </table>

  <p style="margin:18px 0 0;font-family:${BRAND.font};font-size:12px;color:${BRAND.muted};">
    ${BRAND.name} &middot; ${BRAND.role}
  </p>

</td></tr>
</table>
</body>
</html>`;
}

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="border-radius:8px;background-color:${BRAND.accent};">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 30px;font-family:${BRAND.font};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">${escapeHtml(label)}</a>
    </td>
  </tr></table>`;
}

const LABEL = `margin:0 0 6px;font-family:${BRAND.font};font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${BRAND.muted};font-weight:700;`;
const VALUE = `margin:0 0 22px;font-family:${BRAND.font};font-size:17px;line-height:1.5;color:${BRAND.ink};`;
const BODY = `margin:0 0 16px;font-family:${BRAND.font};font-size:16px;line-height:1.65;color:#374151;`;
const QUOTE = `margin:0 0 14px;font-family:${BRAND.font};font-size:16px;line-height:1.7;color:${BRAND.ink};`;
const SMALL = `margin:0;font-family:${BRAND.font};font-size:13px;line-height:1.6;color:${BRAND.muted};`;

/** Sent to the site owner. Optimised for fast triage and a one-tap reply. */
export function notificationEmail({ name, email, message }) {
  const when = receivedAt();
  const replyHref = `mailto:${encodeURIComponent(singleLine(email))}?subject=${encodeURIComponent(`Re: your message to ${BRAND.name}`)}`;

  const body = `
    <p style="${LABEL}">From</p>
    <p style="margin:0 0 4px;font-family:${BRAND.font};font-size:20px;line-height:1.4;color:${BRAND.ink};font-weight:700;">${escapeHtml(name)}</p>
    <p style="${VALUE}"><a href="mailto:${escapeHtml(singleLine(email))}" style="color:${BRAND.accent};text-decoration:none;">${escapeHtml(email)}</a></p>

    <p style="${LABEL}">Message</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
      <tr><td style="padding:20px 24px;background-color:#fafafa;border-left:3px solid ${BRAND.accent};border-radius:0 8px 8px 0;word-break:break-word;">
        ${paragraphs(message, QUOTE)}
      </td></tr>
    </table>

    ${button(replyHref, `Reply to ${firstName(name)}`)}
  `;

  const footer = `<p style="${SMALL}">Received ${escapeHtml(when)} &middot; sent from the contact form on your portfolio.<br>Replying to this email goes straight to ${escapeHtml(email)}.</p>`;

  return {
    subject: `New portfolio message from ${singleLine(name)}`,
    html: layout({
      preheader: `${singleLine(name)} (${singleLine(email)}): ${singleLine(message).slice(0, 90)}`,
      eyebrow: 'Contact form',
      heading: 'You have a new message',
      body,
      footer,
    }),
    text: [
      'NEW PORTFOLIO MESSAGE',
      '',
      `From:    ${name}`,
      `Email:   ${email}`,
      `Received:${when}`,
      '',
      'Message:',
      message,
      '',
      `Reply directly to this email to reach ${email}.`,
    ].join('\n'),
  };
}

/** Auto-reply to the person who submitted the form. */
export function autoReplyEmail({ name, message, siteUrl }) {
  const who = firstName(name);

  const body = `
    <p style="${BODY}">Hi <strong style="color:${BRAND.ink};">${escapeHtml(who)}</strong>,</p>
    <p style="${BODY}">Thanks for getting in touch — your message landed safely in my inbox, and I read every single one personally.</p>
    <p style="${BODY}">I'll get back to you within <strong style="color:${BRAND.ink};">24&ndash;48 hours</strong>. If it's urgent, just reply to this email and it'll come straight to me.</p>

    <p style="${LABEL}">What you sent</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
      <tr><td style="padding:20px 24px;background-color:#fafafa;border-left:3px solid ${BRAND.border};border-radius:0 8px 8px 0;word-break:break-word;">
        ${paragraphs(message, `${QUOTE}color:${BRAND.muted};`)}
      </td></tr>
    </table>

    ${siteUrl ? `${button(siteUrl, 'Explore my work')}<p style="height:24px;margin:0;font-size:0;line-height:0;">&nbsp;</p>` : ''}

    <p style="${BODY}">In the meantime, you'll find me here:</p>
    <p style="margin:0 0 24px;font-family:${BRAND.font};font-size:16px;">
      ${SOCIALS.map(([label, href]) => `<a href="${href}" style="color:${BRAND.accent};text-decoration:none;font-weight:600;">${label}</a>`).join(`<span style="color:${BRAND.border};"> &nbsp;|&nbsp; </span>`)}
    </p>
  `;

  const footer = `
    <p style="margin:0 0 2px;font-family:${BRAND.font};font-size:15px;color:${BRAND.ink};font-weight:700;">${BRAND.name}</p>
    <p style="${SMALL}">${BRAND.role} &middot; passionate about creating amazing web experiences</p>
    <p style="${SMALL}margin-top:12px;">This is an automatic confirmation — but a real reply is on its way.</p>
  `;

  return {
    subject: `Thanks for reaching out, ${singleLine(who)} — I've got your message`,
    html: layout({
      preheader: "Your message reached me safely. Here's what happens next.",
      eyebrow: 'Message received',
      heading: 'Thanks for reaching out!',
      body,
      footer,
    }),
    text: [
      `Hi ${who},`,
      '',
      'Thanks for getting in touch - your message landed safely in my inbox,',
      'and I read every single one personally.',
      '',
      "I'll get back to you within 24-48 hours. If it's urgent, just reply to",
      'this email and it will come straight to me.',
      '',
      'WHAT YOU SENT',
      message,
      '',
      ...(siteUrl ? [`Explore my work: ${siteUrl}`, ''] : []),
      'Find me here:',
      ...SOCIALS.map(([label, href]) => `  ${label}: ${href}`),
      '',
      '--',
      BRAND.name,
      `${BRAND.role} - passionate about creating amazing web experiences`,
      'This is an automatic confirmation, but a real reply is on its way.',
    ].join('\n'),
  };
}
