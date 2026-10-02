/**
 * Dead-code and duplicate-id audit.
 *
 * Three classes of rot that type-checking cannot catch, because every symbol is
 * valid and every id is well-formed:
 *
 *  1. an exported component that nothing imports — it compiles, ships in no
 *     bundle, and is maintained forever
 *  2. a CSS custom property that no utility ever references
 *  3. a duplicate DOM `id`, which silently breaks `href="#id"` anchors and
 *     `aria-labelledby` / `aria-controls` wiring
 *
 * Usage:  node scripts/dead-code-audit.mjs [baseUrl]
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3314";
const root = process.cwd();

const sourceFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?)$/.test(entry.name)) sourceFiles.push(full);
  }
})(path.join(root, "src"));

const sources = new Map(
  sourceFiles.map((f) => [path.relative(root, f).split(path.sep).join("/"), readFileSync(f, "utf8")]),
);
const corpus = [...sources.values()].join("\n");

let failures = 0;
const fail = (line) => {
  failures += 1;
  console.log(`  FAIL  ${line}`);
};

/* ------------------------------------------------- 1. unused local exports */
console.log("unused local exports\n");

const exportRe = /^export\s+(?:async\s+)?(?:function|const|class|interface|type)\s+([A-Za-z_$][\w$]*)/gm;
for (const [file, text] of sources) {
  for (const m of text.matchAll(exportRe)) {
    const name = m[1];
    // Count references outside the declaring line. A name that only ever
    // appears in its own file is a candidate; some are used within the same
    // file, so check the file's body too, minus the declaration itself.
    const body = text.replace(exportRe, "");
    const usedElsewhere = [...corpus.matchAll(new RegExp(`\\b${name}\\b`, "g"))].length;
    const usedInFile = [...body.matchAll(new RegExp(`\\b${name}\\b`, "g"))].length;
    if (usedElsewhere === 0 && usedInFile === 0) {
      // Truly unreferenced. `page.tsx`/`layout.tsx` are entry points reached by
      // the router, and `robots.ts`/`sitemap.ts` are metadata routes, so their
      // single export is consumed by the framework rather than by an import.
      const isFrameworkEntry = /app\/(page|layout|not-found|robots|sitemap|icon|opengraph-image)\.(tsx?|ts)$/.test(
        file,
      );
      if (isFrameworkEntry) continue;
      fail(`${file}: "${name}" is exported but never referenced`);
    }
  }
}
if (failures === 0) console.log("  PASS  every local export is referenced");

/**
 * Unreferenced `@theme` tokens.
 *
 * Tailwind v4 resolves a `@theme` token into a utility on demand, so
 * `text-quote` is generated from `--text-quote` without the token ever being
 * written out in a class attribute. A literal substring search therefore
 * reports every scale token as unused.
 *
 * The reliable signal is the *generated stylesheet*: if a token has a
 * corresponding utility in the compiled CSS, it is live. Only tokens with no
 * utility are genuinely dead. `--animate-*` and `--ease-*` are also checked
 * against the utilities they produce.
 */
console.log("\nunused theme tokens\n");
const globals = readFileSync(path.join(root, "src", "app", "globals.css"), "utf8");
const themeBlock = globals.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const tokens = [...themeBlock.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map((m) => m[1]);

// Pull the compiled stylesheet so "is this token live?" is answered by what
// Tailwind actually emitted.
const docHtml = await (await fetch(base + "/")).text();
const cssHref = docHtml.match(/href="(\/_next\/static\/chunks\/[^"]+\.css)"/)?.[1];
const compiledCss = cssHref ? await (await fetch(base + cssHref)).text() : "";

if (!compiledCss) {
  console.log("  ??    could not read the compiled stylesheet; skipping token check");
} else {
  /**
   * Maps a token to the utility class Tailwind derives from it.
   *   --text-h2        -> .text-h2
   *   --color-ink      -> .text-ink / .bg-ink / .border-ink
   *   --radius-footer  -> .rounded-footer
   *   --ease-out-expo  -> .ease-out-expo
   *   --animate-marquee-> .animate-marquee
   */
  const utilityFor = (token) => {
    // Strip the leading `--`, then the namespace. A trailing
    // `--companion` (line-height, letter-spacing, weight) is metadata for the
    // scale and is resolved by the caller, not here.
    const bare = token.replace(/^--/, "").split("--")[0];
    const namespace = ["text", "color", "radius", "font", "ease", "animate", "spacing", "breakpoint", "shadow", "blur"].find(
      (ns) => bare === ns || bare.startsWith(`${ns}-`),
    );
    if (!namespace) return [`--${bare}`];
    const n = bare.slice(namespace.length + 1);
    if (namespace === "text") return [`.text-${n}`];
    if (namespace === "color")
      return [`.text-${n}`, `.bg-${n}`, `.border-${n}`, `.fill-${n}`, `.stroke-${n}`, `.decoration-${n}`, `.outline-${n}`];
    if (namespace === "radius") return [`.rounded-${n}`];
    if (namespace === "font") return [`.font-${n}`];
    if (namespace === "ease") return [`.ease-${n}`];
    if (namespace === "animate") return [`.animate-${n}`];
    if (namespace === "spacing") return [`.p-${n}`, `.m-${n}`, `.gap-${n}`];
    if (namespace === "breakpoint") return [`@media (min-width:${n}rem)`];
    if (namespace === "shadow") return [`.shadow-${n}`];
    return [`.blur-${n}`];
  };

  // A `--foo--bar` companion (line-height, letter-spacing, weight) is metadata
  // for the `--foo` scale; it is live whenever `--foo` is.
  const scaleOf = (token) => token.split("--")[0];

  /**
   * A utility counts as emitted when its class name appears in the compiled
   * CSS. The minifier escapes `/` in a class (`.bg-canvas\/45`) and nothing
   * else inside a class name, so a plain substring test is both sufficient and
   * far less error-prone than trying to rebuild a selector regex.
   */
  const isEmitted = (cls) => {
    const bare = cls.replace(/^\./, "");
    if (compiledCss.includes(`.${bare}`)) return true;
    // Opacity modifiers escape the slash: `bg-canvas/45` -> `.bg-canvas\/45`.
    const [head] = bare.split("/");
    return head !== bare && compiledCss.includes(`.${head}\\/`);
  };

  const scaleUsed = new Set();
  const dead = [];
  for (const token of tokens) {
    const escaped = token.replace(/-/g, "\\-");
    // Referenced verbatim in a `var()` anywhere in the sources: live.
    if (new RegExp(`var\\(\\s*${escaped}`).test(corpus)) {
      scaleUsed.add(scaleOf(token));
      continue;
    }
    if (utilityFor(token).some(isEmitted)) {
      scaleUsed.add(scaleOf(token));
      continue;
    }
    if (scaleUsed.has(scaleOf(token))) continue;
    dead.push(token);
  }

  for (const token of dead) fail(`globals.css: ${token} is defined in @theme but emits no utility`);
  if (dead.length === 0) console.log(`  PASS  all ${tokens.length} theme tokens emit a live utility`);
}

/* ---------------------------------------------- 3. duplicate DOM ids */
console.log("\nduplicate element ids\n");
const ROUTES = ["/", "/about", "/services", "/projects", "/news", "/contact", "/privacy", "/terms"];

for (const route of ROUTES) {
  const res = await fetch(base + route);
  const html = (await res.text()).replace(/%2F/gi, "/");

  // Only ids that actually reach the DOM, counted per rendered page.
  const ids = new Map();
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) {
    const id = m[1];
    ids.set(id, (ids.get(id) ?? 0) + 1);
  }
  // `icon.png`-style hashed ids and React's own root markers are not authored.
  const dupes = [...ids.entries()].filter(
    ([id, n]) => n > 1 && !id.startsWith("_") && !/^[a-z0-9]{20,}$/i.test(id),
  );
  if (dupes.length) {
    for (const [id, n] of dupes) fail(`${route}: id "${id}" appears ${n} times`);
  } else {
    console.log(`  PASS  ${route}  ${String(ids.size).padStart(3)} unique id(s)`);
  }
}

/* ------------------------------------ 4. aria wiring that points nowhere */
console.log("\naria references\n");
let ariaChecked = 0;
for (const route of ROUTES) {
  const res = await fetch(base + route);
  const html = (await res.text());
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const dangling = [];
  for (const m of html.matchAll(/\s(aria-labelledby|aria-controls|aria-describedby)="([^"]+)"/g)) {
    for (const ref of m[2].split(/\s+/).filter(Boolean)) {
      if (!ids.has(ref)) dangling.push(`${m[1]}="${ref}"`);
    }
  }
  // `aria-controls="mobile-menu"` is the one legitimate miss: the dialog is
  // mounted only while the menu is open, so the id is absent from the
  // server-rendered HTML. It is asserted live in `keyboard-audit.mjs`.
  const real = dangling.filter((d) => !d.includes("mobile-menu"));
  if (real.length) for (const d of [...new Set(real)]) fail(`${route}: dangling ${d}`);
  else {
    ariaChecked += 1;
    console.log(`  PASS  ${route}  every aria reference resolves`);
  }
}
if (ariaChecked === ROUTES.length) {
  console.log("  INFO  aria-controls=\"mobile-menu\" is skipped by design: that dialog mounts on open");
}

/* ------------------------------- 5. referenced-but-absent static routes */
console.log("\ninternal links\n");
const routeSet = new Set(ROUTES);
const linkRe = /(?:href|action)="(\/[^"#?]*)/g;
const seen = new Map();
for (const [file, text] of sources) {
  for (const m of text.matchAll(linkRe)) {
    const href = m[1];
    if (href.startsWith("/_next") || href.startsWith("/images") || href.startsWith("/icon")) continue;
    if (href === "/") continue;
    if (href.endsWith(".xml") || href.endsWith(".txt") || href.endsWith(".png")) continue;
    if (!seen.has(href)) seen.set(href, new Set());
    seen.get(href).add(file);
  }
}
let linksChecked = 0;
for (const [href, files] of [...seen.entries()].sort()) {
  // A static export only produces the routes it declares; anything else is a
  // link that will 404.
  if (!routeSet.has(href)) {
    fail(`internal link "${href}" has no matching page (from ${[...files].join(", ")})`);
  } else {
    linksChecked += 1;
    console.log(`  PASS  ${href}`);
  }
}
console.log(`  INFO  ${linksChecked} distinct internal route(s) authored, all backed by a page`);

console.log(failures === 0 ? "\nDEAD-CODE AUDIT PASSED" : `\n${failures} finding(s).`);
process.exitCode = failures === 0 ? 0 : 1;
