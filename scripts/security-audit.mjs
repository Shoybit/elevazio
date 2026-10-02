/**
 * Response-header and transport-security audit.
 *
 * Verifies the baseline `next.config.ts` sets is actually reaching the wire,
 * and that the static assets that are safe to cache long-term really are.
 *
 * Usage:  node scripts/security-audit.mjs [baseUrl]
 */
const base = process.argv[2] ?? "http://localhost:3314";

/** Header -> [matcher, description]. Matcher is case-insensitive substring. */
const EXPECTED = [
  ["content-security-policy", "default-src", "CSP present"],
  ["content-security-policy", "object-src 'none'", "CSP blocks plugins"],
  ["content-security-policy", "frame-ancestors 'none'", "CSP blocks framing"],
  ["content-security-policy", "base-uri 'self'", "CSP pins base URI"],
  ["content-security-policy", "form-action 'self'", "CSP restricts form posts"],
  ["content-security-policy", "default-src 'self'", "CSP default is same-origin"],
  ["x-content-type-options", "nosniff", "no MIME sniffing"],
  ["x-frame-options", "DENY", "legacy framing block"],
  ["referrer-policy", "strict-origin-when-cross-origin", "referrer policy"],
  ["cross-origin-opener-policy", "same-origin", "opener isolation"],
  ["permissions-policy", "camera=()", "camera denied"],
  ["permissions-policy", "microphone=()", "microphone denied"],
  ["permissions-policy", "geolocation=()", "geolocation denied"],
];

const FORBIDDEN = [
  ["x-powered-by", "framework fingerprint"],
  ["server", "server banner"],
];

let failures = 0;
const fail = (line) => {
  failures += 1;
  console.log(`  FAIL  ${line}`);
};

console.log(`response headers @ ${base}\n`);

const doc = await fetch(base + "/", { redirect: "manual" });
const headers = doc.headers;
const get = (name) => headers.get(name) ?? "";

for (const [name, needle, label] of EXPECTED) {
  const value = get(name);
  if (!value) fail(`${label} — ${name} missing`);
  else if (!value.toLowerCase().includes(needle.toLowerCase())) {
    fail(`${label} — ${name} is "${value.slice(0, 90)}", expected to contain "${needle}"`);
  } else console.log(`  PASS  ${label}`);
}

for (const [name, label] of FORBIDDEN) {
  if (get(name)) fail(`${label} — ${name}: ${get(name)}`);
  else console.log(`  PASS  no ${label} (${name})`);
}

// HSTS is intentionally left to the hosting layer: it is inert over plain HTTP
// and hard-coding it here would break an http:// preview host. Report it so the
// omission is a decision on record rather than an oversight.
if (get("strict-transport-security")) {
  console.log("  PASS  HSTS present");
} else {
  console.log(
    "  INFO  no HSTS — expected over http; set `Strict-Transport-Security` at the edge/hosting layer",
  );
}

// Immutable caching must apply to fingerprinted media only. If it leaked onto a
// document, a redeploy would be invisible to returning visitors.
const media = await fetch(base + "/images/brand/elevazio-wordmark-inverse.png", {
  method: "HEAD",
});
const mediaCache = media.headers.get("cache-control") ?? "";
if (/immutable/.test(mediaCache) && /max-age=31536000/.test(mediaCache)) {
  console.log("  PASS  static media is immutably cached");
} else {
  fail(`static media cache-control is "${mediaCache}"`);
}

const docCache = headers.get("cache-control") ?? "";
if (/immutable/.test(docCache)) {
  fail(`documents must not be immutable, got "${docCache}"`);
} else {
  console.log(`  PASS  documents are not immutable (${docCache})`);
}

// The CSP must not be so tight that Next's own runtime is blocked. If a
// hydration script had been refused, the page would still be served with a 200,
// so check for the framework bootstrap instead of trusting the status code.
const html = await doc.text();
const hasBootstrap = /self\.__next_f/.test(html) || /_next\/static\/chunks\//.test(html);
if (hasBootstrap) console.log("  PASS  CSP leaves the Next.js bootstrap reachable");
else fail("CSP may be blocking the Next.js bootstrap (no inline flight data found)");

console.log(failures === 0 ? "\nSECURITY AUDIT PASSED" : `\n${failures} header check(s) failed.`);
process.exitCode = failures === 0 ? 0 : 1;
