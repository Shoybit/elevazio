/**
 * Overflow / console-error audit across breakpoints, without capturing slices.
 *
 * The slice capture is the slow, occasionally flaky part of the visual sweep;
 * the layout audit itself only needs layout, so this runs the same checks
 * across every width in a couple of seconds and prints one line per width.
 *
 * Usage:  node scripts/overflow-audit.mjs [baseUrl] [widthsCsv]
 */
import { chromium } from "playwright-core";

// Default matches `qa:serve` (3314) so `npm run qa:all` works with no arguments.
const baseUrl = (process.argv[2] ?? "http://localhost:3314/").replace(/\/?$/, "/");
const widths = (process.argv[3] ?? "320,375,390,414,640,768,834,1024,1280,1440,1536,1920")
  .split(",")
  .map(Number);

const HEIGHTS = { 320: 720, 375: 812, 390: 844, 414: 896 };

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--force-color-profile=srgb", "--hide-scrollbars", "--disable-dev-shm-usage"],
});

let failures = 0;
try {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: HEIGHTS[width] ?? 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("requestfailed", (r) => errors.push(`REQUEST FAILED ${r.url()}`));

    await page.goto(baseUrl, { waitUntil: "load" });
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.75);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(() => r(null)));
      }
    });
    await page.waitForTimeout(600);

    const audit = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      height: document.body.scrollHeight,
    }));

    const overflow = audit.scrollWidth - audit.clientWidth;
    const ok = overflow <= 1 && errors.length === 0;
    if (!ok) failures += 1;
    console.log(
      `${String(width).padStart(5)}px  height=${String(audit.height).padStart(6)}  overflowX=${overflow}  errors=${errors.length}  ${ok ? "OK" : "FAIL"}`,
    );
    if (errors.length) errors.slice(0, 5).forEach((e) => console.log(`        ${e}`));
    await context.close();
  }
} finally {
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise((r) => setTimeout(r, 20_000)),
  ]);
}

console.log(failures === 0 ? "\nAll widths clean." : `\n${failures} width(s) failed.`);
process.exitCode = failures === 0 ? 0 : 1;
