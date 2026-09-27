/**
 * Capture one element (or a scroll offset) for side-by-side reference
 * comparison. Section-by-section review needs a repeatable shot of a single
 * band rather than 18 full-page slices.
 *
 * Usage:
 *   node scripts/peek.mjs <url> <outDir> <name> [selector] [width] [height]
 *   node scripts/peek.mjs <url> <outDir> <name> @<scrollY> [width] [height]
 *
 * With no selector the current viewport is captured at scroll offset 0.
 */
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const url = process.argv[2] ?? "http://localhost:3311/";
const outDir = path.resolve(process.argv[3] ?? ".qa");
const name = process.argv[4] ?? "peek";
// `-` is an explicit "no target": shells drop empty string arguments, which
// would otherwise shift the viewport arguments across.
const rawTarget = process.argv[5] ?? "";
const target = rawTarget === "-" ? "" : rawTarget;
const width = Number(process.argv[6] ?? 1920);
const height = Number(process.argv[7] ?? 950);

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--force-color-profile=srgb", "--hide-scrollbars", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(400);

  // Fire every reveal so lazily-revealed sections are in their settled state.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.75);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
  });
  await page.waitForTimeout(1400);

  const file = path.join(outDir, `${name}.jpg`);

  if (target.startsWith("@")) {
    const y = Number(target.slice(1) || 0);
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(650);
    await page.screenshot({ path: file, type: "jpeg", quality: 78 });
  } else if (target) {
    const element = page.locator(target).first();
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await element.screenshot({ path: file, type: "jpeg", quality: 78 });
  } else {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(650);
    await page.screenshot({ path: file, type: "jpeg", quality: 78 });
  }

  const box = target && !target.startsWith("@")
    ? await page.locator(target).first().boundingBox()
    : null;
  console.log(
    box
      ? `${name}: ${Math.round(box.width)}x${Math.round(box.height)} @ ${Math.round(box.x)},${Math.round(box.y)}`
      : `${name}: ${width}x${height} viewport`,
  );
} finally {
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise((r) => setTimeout(r, 20_000)),
  ]);
}
