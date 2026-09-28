/**
 * Capture the header and the hero feature cards, the two areas under review.
 *
 * Usage:  node scripts/hero-shot.mjs [baseUrl] [outDir] [width] [height]
 */
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.argv[2] ?? "http://localhost:3311/";
const outDir = path.resolve(process.argv[3] ?? ".qa");
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 950);

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--force-color-profile=srgb", "--hide-scrollbars", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(baseUrl, { waitUntil: "load" });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(outDir, `hdr-${width}.jpg`),
    type: "jpeg",
    quality: 82,
  });

  // The cards sit at the very bottom of the hero, so scroll them into view.
  const cards = page.locator("#hero-features");
  await cards.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  // `hover` as the 6th argument captures the middle card mid-interaction.
  if (process.argv[6] === "hover") {
    await cards.locator("article").nth(1).hover();
    await page.waitForTimeout(900);
  }
  await cards.screenshot({
    path: path.join(outDir, `cards-${width}.jpg`),
    type: "jpeg",
    quality: 82,
  });
  const box = await cards.boundingBox();
  const titles = await cards.locator("h3").allTextContents();
  console.log(
    `cards @${width}: ${Math.round(box.width)}x${Math.round(box.height)}  titles: ${titles.join(" / ")}`,
  );
} finally {
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise((r) => setTimeout(r, 20_000)),
  ]);
}
