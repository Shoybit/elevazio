/**
 * Measures the paint and layout-shift numbers quoted in the README, so the
 * documented figures come from a run rather than from memory.
 *
 * Usage:  node scripts/vitals.mjs [baseUrl] [route] [width] [height]
 */
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3314";
const route = process.argv[3] ?? "/";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 950);

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--force-color-profile=srgb", "--hide-scrollbars"],
});

try {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__vitals = { lcp: 0, cls: 0, fcp: 0, longTasks: 0, longTaskMs: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__vitals.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) window.__vitals.cls += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__vitals.fcp = e.startTime;
    }).observe({ type: "paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__vitals.longTasks += 1;
        window.__vitals.longTaskMs += e.duration;
      }
    }).observe({ type: "longtask", buffered: true });
  });

  await page.goto(base + route, { waitUntil: "load" });
  // Walk the page so lazy sections lay out too, then settle.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.9);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
  });
  await page.waitForTimeout(2500);

  const bytes = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .reduce((sum, e) => sum + (e.transferSize || 0), 0),
  );
  const v = await page.evaluate(() => window.__vitals);
  const rtt = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    return nav ? { ttfb: nav.responseStart, domContentLoaded: nav.domContentLoadedEventEnd } : null;
  });

  console.log(`${route} @${width}x${height}`);
  console.log(`  FCP                ${(v.fcp / 1000).toFixed(2)} s`);
  console.log(`  LCP                ${(v.lcp / 1000).toFixed(2)} s`);
  console.log(`  CLS                ${v.cls.toFixed(4)}`);
  console.log(`  TTFB               ${rtt ? (rtt.ttfb / 1000).toFixed(3) : "n/a"} s`);
  console.log(`  DCL                ${rtt ? (rtt.domContentLoaded / 1000).toFixed(2) : "n/a"} s`);
  console.log(`  long tasks         ${v.longTasks} (${Math.round(v.longTaskMs)} ms total)`);
  console.log(`  transferred        ${(bytes / 1024).toFixed(0)} KiB`);

  await context.close();
} finally {
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise((r) => setTimeout(r, 20_000)),
  ]);
}
