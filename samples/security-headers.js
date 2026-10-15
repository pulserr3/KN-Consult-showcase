// Build a Content Security Policy that allows only our own files plus the
// hashes of the few inline scripts found in the generated pages.
const crypto = require('crypto');

function inlineScriptHashes(html) {
  const hashes = new Set();
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    hashes.add(`'sha256-${crypto.createHash('sha256').update(m[1]).digest('base64')}'`);
  }
  return hashes;
}

function buildCsp(hashes, formOrigin = '') {
  return [
    "default-src 'self'",
    `script-src 'self' ${[...hashes].join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${formOrigin}`,
    `form-action 'self'${formOrigin}`,
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    'upgrade-insecure-requests'
  ].join('; ');
}

module.exports = { inlineScriptHashes, buildCsp };
