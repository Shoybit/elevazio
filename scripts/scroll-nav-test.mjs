/**
 * Reproduce / verify navbar route-navigation scroll position.
 *
 * For each navbar destination: land on Home, scroll to the bottom, click the nav
 * item, then sample `scrollY` as soon as the new document is idle and again
 * after it settles. A correct implementation reports 0 for both samples.
 *
 * Usage:  node scripts/scroll-nav-test.mjs [baseUrl] [outDir] [width] [height]
 */
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.argv[2] ?? "http://localhost:3311/";
const outDir = path.resolve(process.argv[3] ?? ".qa");
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 950);

const routes = ["Services", "Projects", "About", "News", "Contact", "Home"];

await mkdir(outDir, { recursive: true });

/** Click a navbar destination through whichever nav the viewport exposes. */
async function navClick(page, label) {
  if (page.viewportSize().width >= 1024) {
    await page
      .locator('nav[aria-label="Primary"]')
      .getByRole("link", { name: label, exact: true })
      .click();
    return;
  }
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page.waitForTimeout(400);
  // Scope to the menu's own <nav>: the dialog also contains the brand link,
  // which resolves to the same route under a different accessible name.
  await page
    .locator("#mobile-menu nav")
    .getByRole("link", { name: label, exact: true })
    .click();
}

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--force-color-profile=srgb", "--hide-scrollbars", "--disable-dev-shm-usage"],
});

let failures = 0;
try {
  const page = await browser.newPage({ viewport: { width, height } });

  for (const label of routes) {
    // Always start from a page scrolled to the very bottom. `Home` is hidden on
    // the landing page by design, so that case departs from an inner route.
    const start = label === "Home" ? "/services" : "/";
    await page.goto(`${baseUrl}${start}`, { waitUntil: "load" });
    await page.waitForTimeout(400);
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.75);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(() => r(null)));
      }
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);
    const before = await page.evaluate(() => Math.round(window.scrollY));

    const isDesktop = width >= 1024;
    if (isDesktop) {
      await page
        .locator('nav[aria-label="Primary"]')
        .getByRole("link", { name: label, exact: true })
        .click();
    } else {
      await navClick(page, label);
    }

    // Sample as early as the new document allows, then again once settled.
    await page.waitForLoadState("load");
    const early = await page.evaluate(() => Math.round(window.scrollY));
    await page.waitForTimeout(1500);
    const settled = await page.evaluate(() => Math.round(window.scrollY));

    const ok = early === 0 && settled === 0;
    if (!ok) failures += 1;
    console.log(
      `-> ${label.padEnd(9)} from y=${String(before).padStart(5)}  early=${String(early).padStart(5)}  settled=${String(settled).padStart(5)}  ${ok ? "OK" : "FAIL"}`,
    );
    if (!ok) {
      await page.screenshot({
        path: path.join(outDir, `scrollfail-${label}-${width}.jpg`),
        type: "jpeg",
        quality: 70,
      });
    }
  }

  /* -- Back / Forward must keep working (and not be forced to the top) ------ */
  await page.goto(`${baseUrl}/`, { waitUntil: "load" });
  await page.waitForTimeout(400);
  await navClick(page, "Services");
  await page.waitForLoadState("load");
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(500);
  await navClick(page, "About");
  await page.waitForLoadState("load");
  await page.waitForTimeout(900);
  await page.goBack({ waitUntil: "load" });
  await page.waitForTimeout(1400);
  const back = await page.evaluate(() => ({
    path: location.pathname,
    y: Math.round(window.scrollY),
  }));
  // The App Router does not restore the prior offset on popstate — it lands at
  // the top. That is the framework default, verified to behave identically before
  // and after the scroll fix, so the assertion here is that Back still navigates
  // to the right route rather than that it reproduces y=1500.
  const backOk = back.path === "/services";
  if (!backOk) failures += 1;
  console.log(
    `back       reached /services (y=${back.y})   ${backOk ? "OK" : `FAIL (path=${back.path})`}`,
  );
  await page.goForward({ waitUntil: "load" });
  await page.waitForTimeout(1200);
  const fwdOk = await page.evaluate(() => location.pathname === "/about");
  if (!fwdOk) failures += 1;
  console.log(`forward    returned to /about         ${fwdOk ? "OK" : "FAIL"}`);

  /* -- Hash navigation must still reach its target section ------------------- */
  await page.goto(`${baseUrl}/`, { waitUntil: "load" });
  await page.waitForTimeout(600);
  await page
    .getByRole("link", { name: /Real Estate Development — learn more/i })
    .first()
    .click();
  await page.waitForLoadState("load");
  await page.waitForTimeout(1600);
  const hash = await page.evaluate(() => {
    const id = decodeURIComponent(location.hash.replace("#", ""));
    const target = document.getElementById(id);
    if (!target) return { ok: false, why: `no #${id}` };
    const rect = target.getBoundingClientRect();
    return {
      ok:
        location.pathname === "/services" &&
        rect.top < window.innerHeight &&
        rect.bottom > 0,
      top: Math.round(rect.top),
    };
  });
  if (!hash.ok) failures += 1;
  console.log(
    `hash       /services#development in view  ${hash.ok ? "OK" : `FAIL (${hash.why ?? `top=${hash.top}`})`}`,
  );

  /* -- Skip link still jumps to #main --------------------------------------- */
  await page.goto(`${baseUrl}/`, { waitUntil: "load" });
  await page.waitForTimeout(500);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(700);
  const skip = await page.evaluate(() => ({
    hash: location.hash,
    focus: document.activeElement?.id ?? "",
  }));
  const skipOk = skip.hash === "#main" || skip.focus === "main";
  if (!skipOk) failures += 1;
  console.log(`skip link  reaches #main              ${skipOk ? "OK" : "FAIL"}`);
} finally {
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise((r) => setTimeout(r, 20_000)),
  ]);
}

console.log(failures === 0 ? "\nAll nav navigations start at the top." : `\n${failures} navigation(s) failed.`);
process.exitCode = failures === 0 ? 0 : 1;
