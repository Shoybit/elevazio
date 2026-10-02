/**
 * Route-wide regression audit.
 *
 * Walks every public route (plus a deliberate 404) against a running server
 * and asserts the things that silently rot during a content or refactor pass:
 * exactly one `<h1>`, no heading-level skips, no empty label pills left behind
 * by a failed lookup, no stretched `next/image` bitmaps, no `cursor-pointer`
 * parked on a non-interactive element, no horizontal overflow, and a clean
 * console/network log.
 *
 * This complements `overflow-audit.mjs` (which sweeps widths on one route) and
 * `interaction-qa.mjs` (which drives the interactive states on one route).
 *
 * Usage:  node scripts/route-audit.mjs [baseUrl]
 */
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3314";
/** Included to prove the not-found boundary still renders and stays clean. */
const NOT_FOUND_ROUTE = "/definitely-not-a-page";
const routes = [
  "/",
  "/about",
  "/services",
  "/projects",
  "/news",
  "/contact",
  "/privacy",
  "/terms",
  NOT_FOUND_ROUTE,
];

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--force-color-profile=srgb", "--hide-scrollbars", "--disable-dev-shm-usage"],
});

let failures = 0;
const report = (ok, line) => {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${line}`);
};

try {
  for (const route of routes) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
    const page = await context.newPage();
    const problems = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") problems.push(`[${m.type()}] ${m.text()}`);
    });
    page.on("pageerror", (e) => problems.push(`[pageerror] ${e.message}`));
    page.on("requestfailed", (r) => problems.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText ?? ""}`));
    page.on("response", (r) => {
      if (r.status() >= 400) problems.push(`[http ${r.status()}] ${r.url()}`);
    });

    await page.goto(base + route, { waitUntil: "load" });
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.8);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(() => r(null)));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    const facts = await page.evaluate(() => {
      const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => Number(h.tagName[1]));
      let skips = 0;
      for (let i = 1; i < headings.length; i += 1) {
        if (headings[i] - headings[i - 1] > 1) skips += 1;
      }
      // A "pill" is a filled, fully rounded chip that is meant to carry a
      // label. An empty one is a silent data bug: a lookup that missed, or a
      // field that was never populated. Purely decorative dots and icon
      // circles are excluded by the aria-hidden / no-background guards.
      const emptyBadges = [
        ...document.querySelectorAll("main span, main p, main div"),
      ]
        .filter((el) => {
          if (el.getAttribute("aria-hidden") === "true") return false;
          if (el.children.length > 0) return false;
          if (el.textContent.trim()) return false;
          const cls = typeof el.className === "string" ? el.className : "";
          return /\brounded-full\b/.test(cls) && /\bbg-(?!transparent|none)[\w/-]+/.test(cls);
        })
        .map((el) => (typeof el.className === "string" ? el.className : "").slice(0, 70));
      // `fill` means the `object-fit` utility is missing or misspelled, so the
      // bitmap is stretched into the box instead of being cropped.
      const stretchedImages = [...document.querySelectorAll("img[data-nimg='fill']")]
        .filter((i) => getComputedStyle(i).objectFit === "fill")
        .map((i) => (i.currentSrc || i.src).slice(-42));
      // Only images actually on screen are required to have decoded. Anything
      // further out is `loading="lazy"` working as designed — and a bitmap that
      // 404s is already caught by the network assertions below.
      const notDecoded = [...document.querySelectorAll("img[data-nimg='fill']")]
        .filter((i) => {
          if (i.naturalWidth) return false;
          const r = i.getBoundingClientRect();
          return (
            r.width > 0 &&
            r.height > 0 &&
            r.right > 0 &&
            r.left < window.innerWidth &&
            r.bottom > 0 &&
            r.top < window.innerHeight
          );
        })
        .map((i) => (i.currentSrc || i.src).slice(-42));      const clickableNonControls = [...document.querySelectorAll('[class*="cursor-pointer"]')]
        .map((el) => el.tagName)
        .filter((t) => !["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "LABEL"].includes(t));
      return {
        h1Count: document.querySelectorAll("h1").length,
        headingSkips: skips,
        emptyBadges,
        stretchedImages,
        notDecoded,
        clickableNonControls: [...new Set(clickableNonControls)],
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        main: !!document.querySelector("main#main"),
        canonical: document.querySelector('link[rel=canonical]')?.href,
        ogImage: document.querySelector('meta[property="og:image"]')?.content,
        lang: document.documentElement.lang,
        skipLink: !!document.querySelector('a[href="#main"]'),
      };
    });

    // A route that is expected to 404 should not be reported as a broken
    // request; only its console noise beyond the status line matters.
    const expected404 = route === NOT_FOUND_ROUTE;
    const unique = [
      ...new Set(
        expected404
          ? problems.filter((p) => !p.includes("404"))
          : problems,
      ),
    ];
    report(facts.h1Count === 1, `${route}  exactly one <h1> (${facts.h1Count})`);
    report(facts.headingSkips === 0, `${route}  no heading-level skips (${facts.headingSkips})`);
    report(
      facts.emptyBadges.length === 0,
      `${route}  no empty pill badges${facts.emptyBadges.length ? " -> " + facts.emptyBadges.slice(0, 3).join(" | ") : ""}`,
    );
    report(
      facts.stretchedImages.length === 0,
      `${route}  every fill image is object-cover (${facts.stretchedImages.join(", ") || "ok"})`,
    );
    report(
      facts.notDecoded.length === 0,
      `${route}  every on-screen fill image decoded (${facts.notDecoded.join(", ") || "ok"})`,
    );
    report(facts.clickableNonControls.length === 0, `${route}  no cursor-pointer on non-controls (${facts.clickableNonControls.join(",") || "ok"})`);
    report(facts.overflowX <= 1, `${route}  no horizontal overflow (${facts.overflowX})`);
    report(facts.main, `${route}  has <main id="main">`);
    report(facts.lang === "en", `${route}  lang="${facts.lang}"`);
    report(!!facts.skipLink, `${route}  skip link present`);
    report(unique.length === 0, `${route}  console/network clean${unique.length ? " -> " + unique.slice(0, 4).join(" | ") : ""}`);
    console.log(`      canonical=${facts.canonical} og:image=${facts.ogImage}`);
    await context.close();
  }
} finally {
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise((r) => setTimeout(r, 20_000)),
  ]);
}

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} check(s) failed.`);
process.exitCode = failures === 0 ? 0 : 1;
