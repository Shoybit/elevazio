/**
 * Capture the service cards at rest, mid-hover and fully hovered, so the
 * ring-origin lime expansion can be judged rather than assumed.
 *
 * Usage:  node scripts/hover-shot.mjs [baseUrl] [outDir] [width] [height]
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
  await page.goto(`${baseUrl}#services`, { waitUntil: "load" });
  await page.waitForTimeout(500);
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.75);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
  });

  const cards = page.locator("#services ul > li");
  const count = await cards.count();
  const grid = page.locator("#services ul");
  await grid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Resolve the clip once, up front. Calling locator.screenshot() mid-hover
  // re-scrolls the element, which moves content out from under the cursor and
  // restarts the transition, so the viewport is captured against a fixed clip.
  const clip = await grid.boundingBox();
  const shoot = (name) =>
    page.screenshot({
      path: path.join(outDir, `${name}-${width}.jpg`),
      type: "jpeg",
      quality: 82,
      clip: {
        x: Math.max(0, clip.x),
        y: Math.max(0, clip.y),
        width: Math.min(clip.width, width),
        height: Math.min(clip.height, 950 - Math.max(0, clip.y)),
      },
    });

  await page.mouse.move(0, 0);
  await page.waitForTimeout(800);
  await shoot("svc-rest");

  const target = cards.nth(1);
  await target.hover();
  await page.waitForTimeout(200);
  await shoot("svc-mid");
  await page.waitForTimeout(1000);
  await shoot("svc-hover");

  const geom = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll("#services ul > li"));
    const rects = items.map((el) => {
      const card = el.querySelector("div");
      const r = card.getBoundingClientRect();
      const img = el.querySelector("img");
      const ir = img ? img.getBoundingClientRect() : null;
      return {
        cardW: Math.round(r.width),
        cardH: Math.round(r.height),
        imgH: ir ? Math.round(ir.height) : 0,
        imgW: ir ? Math.round(ir.width) : 0,
        imgLeft: ir ? Math.round(ir.left - r.left) : 0,
        imgBottom: ir ? Math.round(r.bottom - ir.bottom) : 0,
      };
    });
    return rects;
  });

  console.log(`cards=${count} gridBox=${Math.round(clip.width)}x${Math.round(clip.height)}`);
  geom.forEach((g, i) =>
    console.log(
      `  card ${i + 1}: ${g.cardW}x${g.cardH}  image ${g.imgW}x${g.imgH}  offsetLeft=${g.imgLeft} offsetBottom=${g.imgBottom}`,
    ),
  );
  const topW = geom[0].cardW;
  const botW = geom[3].cardW;
  const ratio = botW / topW;
  console.log(`width ratio bottom/top = ${ratio.toFixed(3)} (target 1.500)`);
  const h1 = new Set(geom.slice(0, 3).map((g) => g.cardH));
  const h2 = new Set(geom.slice(3).map((g) => g.cardH));
  console.log(
    `row1 heights ${[...h1].join(",")}  row2 heights ${[...h2].join(",")}  imgHeights ${geom.map((g) => g.imgH).join(",")}`,
  );
} finally {
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise((r) => setTimeout(r, 20_000)),
  ]);
}
