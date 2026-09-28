/**
 * Screenshot the open mobile navigation, which cannot be reached through a
 * static capture because it only exists after a click.
 *
 * Usage:  node scripts/menu-shot.mjs [baseUrl] [outDir] [width] [height]
 */
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.argv[2] ?? "http://localhost:3311/";
const outDir = path.resolve(process.argv[3] ?? ".qa");
const width = Number(process.argv[4] ?? 390);
const height = Number(process.argv[5] ?? 844);

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--hide-scrollbars", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(baseUrl, { waitUntil: "load" });
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: path.join(outDir, `mobile-menu-${width}.jpg`),
    type: "jpeg",
    quality: 80,
  });
  const labels = await page
    .locator("#mobile-menu nav a")
    .allTextContents();
  console.log(`mobile-menu-${width}.jpg  items: ${labels.join(", ")}`);
} finally {
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise((r) => setTimeout(r, 20_000)),
  ]);
}
