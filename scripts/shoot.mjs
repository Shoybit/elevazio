/**
 * Screenshot one route at a set of viewports, for spot-checking inner pages.
 *
 * Usage:  node scripts/shoot.mjs <baseUrl> <outDir> <route> [width,height]
 */
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.argv[2] ?? "http://localhost:3317/";
const outDir = path.resolve(process.argv[3] ?? ".qa");
const route = process.argv[4] ?? "/";
const [w, h] = (process.argv[5] ?? "1440x950").split("x").map(Number);

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--hide-scrollbars", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.goto(baseUrl + route, { waitUntil: "load" });
await page.waitForTimeout(600);
await page.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.75);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1600);

const total = await page.evaluate(() => document.body.scrollHeight);
const name = route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, "");
for (let i = 0; i * h < total && i < 8; i += 1) {
  await page.evaluate((y) => window.scrollTo(0, y), i * h);
  await page.waitForTimeout(650);
  await page.screenshot({
    path: path.join(outDir, `${name}-${w}-${String(i).padStart(2, "0")}.jpg`),
    type: "jpeg",
    quality: 70,
  });
}
console.log(`${name} @${w}: ${total}px captured`);
await browser.close();
