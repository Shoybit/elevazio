/**
 * Print the document offset and height of every landmark section, so targeted
 * screenshots can be aimed at the right scroll positions.
 *
 * Usage:  node scripts/sections.mjs [baseUrl] [width] [height]
 */
import { chromium } from "playwright-core";

const baseUrl = process.argv[2] ?? "http://localhost:3311/";
const width = Number(process.argv[3] ?? 1920);
const height = Number(process.argv[4] ?? 950);

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--hide-scrollbars", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(baseUrl, { waitUntil: "load" });
  await page.waitForTimeout(600);
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.75);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);

  const rows = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("section[id], section, footer").forEach((el) => {
      const rect = el.getBoundingClientRect();
      const top = Math.round(rect.top + window.scrollY);
      const heading = el.querySelector("h1, h2");
      out.push({
        id: el.id || el.tagName.toLowerCase(),
        top,
        height: Math.round(rect.height),
        heading: heading ? heading.textContent.trim().slice(0, 42) : "",
      });
    });
    return { total: document.body.scrollHeight, out };
  });

  console.log(`total=${rows.total} @${width}x${height}`);
  for (const r of rows.out) {
    console.log(
      `  ${String(r.top).padStart(6)}  h=${String(r.height).padStart(5)}  #${r.id.padEnd(14)} ${r.heading}`,
    );
  }
} finally {
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise((r) => setTimeout(r, 20_000)),
  ]);
}
