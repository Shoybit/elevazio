/**
 * Asset integrity audit.
 *
 * Catches the two failure modes that are invisible while browsing but break a
 * deploy:
 *
 *  1. a referenced file that does not exist (broken OG card, missing logo)
 *  2. a case-mismatched path — fine on a case-insensitive filesystem, a hard
 *     404 on Linux, which is where most hosting actually runs
 *
 * Every route is fetched, the HTML and the `src/config` + `src/components` and
 * `src/app` sources are scanned, and each referenced path is checked for exact
 * case against `public/`.
 *
 * Usage:  node scripts/asset-audit.mjs [baseUrl]
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3314";
const root = process.cwd();
const publicDir = path.join(root, "public");

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/projects",
  "/news",
  "/contact",
  "/privacy",
  "/terms",
  "/icon.png",
  "/robots.txt",
  "/sitemap.xml",
];

/** Matches `/images/...` plus the extension, in HTML or in a source string. */
const ASSET = /\/images\/[A-Za-z0-9_\-./]+\.(?:png|jpe?g|webp|avif|svg|ico|gif)/g;

const disk = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else disk.push("/" + path.relative(publicDir, full).split(path.sep).join("/"));
  }
})(publicDir);
const diskSet = new Set(disk);

/** Lowercased basename -> actual on-disk name, for case diagnostics. */
const byLowerName = new Map();
for (const file of disk) {
  const key = file.toLowerCase();
  if (!byLowerName.has(key)) byLowerName.set(key, []);
  byLowerName.get(key).push(file);
}

const referenced = new Set();
for (const route of ROUTES) {
  const res = await fetch(base + route);
  // `next/image` percent-encodes the source path inside the `srcset` query, so
  // only the separators need undoing. A blanket `decodeURIComponent` throws on
  // any stray `%` in the document, which is why this is a targeted replace.
  const html = (await res.text()).replace(/%2F/gi, "/").replace(/%3A/gi, ":");
  for (const m of html.matchAll(ASSET)) referenced.add(m[0]);
}

const sourceFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry.name)) sourceFiles.push(full);
  }
})(path.join(root, "src"));
for (const file of sourceFiles) {
  for (const m of readFileSync(file, "utf8").matchAll(ASSET)) referenced.add(m[0]);
}

let failures = 0;
const fail = (line) => {
  failures += 1;
  console.log(`  FAIL  ${line}`);
};

console.log(`asset integrity @ ${base}\n`);
console.log(`  ${referenced.size} referenced path(s), ${disk.length} file(s) in public/\n`);

for (const ref of [...referenced].sort()) {
  if (diskSet.has(ref)) {
    console.log(`  PASS  ${ref}`);
    continue;
  }
  const candidates = byLowerName.get(ref.toLowerCase());
  if (candidates?.length) {
    fail(
      `case mismatch: ${ref} -> rename to ${candidates[0]} (a hard 404 on any case-sensitive host)`,
    );
  } else {
    fail(`missing: ${ref}`);
  }
}

// An unreferenced file is dead weight in the deploy, not a defect, so it is
// reported as information rather than failing the audit.
const unused = [...diskSet].filter((f) => !referenced.has(f)).sort();
if (unused.length) {
  const bytes = unused.reduce((sum, f) => sum + statSync(path.join(publicDir, f)).size, 0);
  console.log(
    `\n  INFO  ${unused.length} unreferenced file(s), ${(bytes / 1024 / 1024).toFixed(2)} MiB — not requested at runtime, safe to prune:\n        ${unused.join("\n        ")}`,
  );
}

console.log(failures === 0 ? "\nASSET AUDIT PASSED" : `\n${failures} asset problem(s).`);
process.exitCode = failures === 0 ? 0 : 1;
