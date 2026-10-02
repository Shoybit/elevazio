/**
 * Motion behaviour checks that a screenshot cannot prove:
 *  - both marquees animate, at the duration their call site asks for
 *  - hovering/focusing a marquee genuinely pauses it (WCAG 2.2.2)
 *  - the loop is seamless (no half-gap jump on wrap)
 *  - `prefers-reduced-motion` stops the marquees and the parallax/ring
 *
 * Usage:  node scripts/motion-audit.mjs [baseUrl]
 */
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3314";
const failures = [];
const check = (name, ok, detail = "") => {
  if (!ok) failures.push(`  FAIL  ${name}${detail ? " — " + detail : ""}`);
  else console.log(`  PASS  ${name}${detail ? " — " + detail : ""}`);
};

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--force-color-profile=srgb", "--hide-scrollbars"],
});

/**
 * Scrolls a section into view through JS rather than Playwright's
 * `scrollIntoViewIfNeeded`, which waits for the element to stop moving — a
 * permanently-running marquee never satisfies that and the call times out.
 */
const revealSection = (page, id) =>
  page.evaluate((target) => {
    document.getElementById(target)?.scrollIntoView({ block: "center" });
  }, id);

const left = (page, sel) => page.locator(sel).evaluate((el) => el.getBoundingClientRect().left);
const playState = (page, sel) =>
  page.locator(sel).evaluate((el) => getComputedStyle(el).animationPlayState);
const duration = (page, sel) =>
  page.locator(sel).evaluate((el) => getComputedStyle(el).animationDuration);

try {
  /* ------------------------------------------------------- default motion */
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
    const page = await context.newPage();
    await page.goto(base + "/", { waitUntil: "load" });

    for (const id of ["partners", "news"]) {
      const sel = `#${id} .animate-marquee`;
      await revealSection(page, id);
      await page.waitForTimeout(400);
      const a = await left(page, sel);
      await page.waitForTimeout(1200);
      const b = await left(page, sel);
      check(`${id}: marquee animates`, Math.abs(a - b) > 8, `moved ${(a - b).toFixed(1)}px in 1.2s`);

      const dur = await duration(page, sel);
      check(
        `${id}: configured duration is honoured`,
        dur === (id === "partners" ? "36s" : "42s"),
        `computed ${dur}`,
      );

      // Hover pause, driven through a real input event so `:hover` applies.
      // The pointer is aimed at the visible centre of the clipping wrapper, not
      // at a card: the track scrolls, so a card's box is often partly outside
      // the viewport and the synthesised move lands nowhere.
      const target = await page.evaluate((section) => {
        const r = document
          .querySelector(`#${section} .animate-marquee`)
          .parentElement.getBoundingClientRect();
        return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
      }, id);
      await page.mouse.move(target.x, target.y);
      await page.waitForTimeout(300);
      const state = await playState(page, sel);
      const c = await left(page, sel);
      await page.waitForTimeout(900);
      const d = await left(page, sel);
      check(`${id}: hover pauses the strip`, state === "paused", `play-state ${state}`);
      check(`${id}: paused strip does not drift`, Math.abs(c - d) < 1, `drift ${(c - d).toFixed(2)}px`);
      await page.mouse.move(2, 2);
      await page.waitForTimeout(300);
      check(
        `${id}: leaving the strip resumes it`,
        (await playState(page, sel)) === "running",
      );
    }

    // Seamless wrap: the track's trailing padding must equal its gap, so that
    // -50% lands exactly on the start of the first copy.
    const seam = await page.locator("#news .animate-marquee").evaluate((el) => {
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const padEnd = parseFloat(getComputedStyle(el).paddingRight) || 0;
      return { gap, padEnd, delta: Math.abs(padEnd - gap) };
    });
    check(
      "news: track padding matches the gap so the loop is seamless",
      seam.delta < 0.5,
      `gap ${seam.gap} / padding-right ${seam.padEnd}`,
    );

    // Duplicated half must be hidden from assistive tech and untabbable.
    const dupes = await page.locator("#news .animate-marquee article").evaluateAll((els) =>
      els.map((el) => ({
        hidden: el.getAttribute("aria-hidden"),
        tabbableLinks: [...el.querySelectorAll("a")].filter((a) => a.tabIndex !== -1).length,
      })),
    );
    const half = dupes.length / 2;
    check(
      "news: duplicated half is aria-hidden",
      // React serialises `aria-hidden={false}` as "false" rather than omitting it.
      dupes.slice(half).every((d) => d.hidden === "true") &&
        dupes.slice(0, half).every((d) => d.hidden !== "true"),
      JSON.stringify(dupes.map((d) => d.hidden)),
    );
    check(
      "news: duplicated links are removed from the tab order",
      dupes.slice(half).every((d) => d.tabbableLinks === 0),
    );

    await context.close();
  }

  /* --------------------------------------------------------- reduced motion */
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 950 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(base + "/", { waitUntil: "load" });

    for (const id of ["partners", "news"]) {
      const sel = `#${id} .animate-marquee`;
      await revealSection(page, id);
      await page.waitForTimeout(400);
      const a = await left(page, sel);
      await page.waitForTimeout(900);
      const b = await left(page, sel);
      check(`${id}: reduced motion stops the marquee`, Math.abs(a - b) < 1);
    }

    const transforms = await page.evaluate(() =>
      [...document.querySelectorAll("[data-motion-transform]")]
        .map((el) => getComputedStyle(el).transform)
        .filter((t) => t !== "none"),
    );
    check(
      "reduced motion: every data-motion-transform offset is neutralised",
      transforms.length === 0,
      transforms.slice(0, 3).join(" | ") || "ok",
    );

    // Content must still be readable when the reveal offsets are removed.
    const heroVisible = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      return h1 ? h1.getBoundingClientRect().width > 0 && h1.textContent.length > 0 : false;
    });
    check("reduced motion: hero headline is still laid out and populated", heroVisible);

    await context.close();
  }
} finally {
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise((r) => setTimeout(r, 20_000)),
  ]);
}

console.log(failures.length === 0 ? "\nMOTION AUDIT PASSED" : "\n" + failures.join("\n"));
process.exitCode = failures.length === 0 ? 0 : 1;
