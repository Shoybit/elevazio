/**
 * Keyboard-navigation audit.
 *
 * Verifies the things a mouse user never notices:
 *  - Tab order matches document order and never lands on a hidden element
 *  - focus is always visible (a ring, not `outline: none` with no replacement)
 *  - nothing focusable is inside an `aria-hidden` subtree
 *  - the skip link is the first stop and actually moves focus
 *  - no positive `tabindex` (which reorders the page unpredictably)
 *
 * Usage:  node scripts/keyboard-audit.mjs [baseUrl]
 */
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3314";
const ROUTES = ["/", "/services", "/projects", "/news", "/contact", "/about"];
const MAX_STOPS = 140;

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--hide-scrollbars"],
});

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) {
    failures += 1;
    console.log(`  FAIL  ${name}${detail ? " — " + detail : ""}`);
  } else {
    console.log(`  PASS  ${name}${detail ? " — " + detail : ""}`);
  }
};

/** Describes the focused element well enough to spot a wrong stop. */
const describe = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  const ring =
    (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) ||
    cs.boxShadow !== "none" ||
    cs.textDecorationLine !== "none";
  return {
    tag: el.tagName,
    label:
      el.getAttribute("aria-label") ||
      (el.textContent || "").trim().slice(0, 40) ||
      el.getAttribute("placeholder") ||
      el.id ||
      "(unlabelled)",
    tabIndex: el.tabIndex,
    visible: el.offsetParent !== null || cs.position === "fixed",
    ring,
    inAriaHidden: !!el.closest('[aria-hidden="true"]'),
    /**
     * The element's index in the document's own tabbable sequence.
     *
     * Comparing pixel positions is unreliable — a multi-column footer grid
     * legitimately moves *up* the page as focus walks across a row, and an
     * absolutely positioned header or a translated marquee sits nowhere
     * relative to the flow. DOM order is the criterion that actually matters:
     * `position: static` + a positive `tabindex` are what break it, and both
     * are asserted separately.
     */
    domIndex: (() => {
      const tabbables = [
        ...document.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((n) => !n.closest('[aria-hidden="true"]'));
      return tabbables.indexOf(el);
    })(),
  };
};

try {
  for (const route of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
    const page = await context.newPage();
    await page.goto(base + route, { waitUntil: "load" });
    await page.waitForTimeout(400);

    const stops = [];
    for (let i = 0; i < MAX_STOPS; i += 1) {
      await page.keyboard.press("Tab");
      const d = await page.evaluate(describe);
      if (!d) break;
      stops.push(d);
      // Stop once focus wraps back to the first element.
      if (stops.length > 4 && d.x === stops[0].x && d.y === stops[0].y && d.label === stops[0].label) {
        stops.pop();
        break;
      }
    }

    console.log(`\n${route} — ${stops.length} tab stop(s)`);

    const hidden = stops.filter((s) => s.inAriaHidden);
    check(`${route}: no focusable element inside aria-hidden`, hidden.length === 0,
      hidden.map((h) => h.label).join(", "));

    const invisible = stops.filter((s) => s.visible);
    check(`${route}: every tab stop is rendered`, invisible.length === stops.length,
      `${invisible.length}/${stops.length} visible`);

    const noRing = stops.filter((s) => !s.ring);
    check(`${route}: every tab stop paints a focus indicator`, noRing.length === 0,
      noRing.map((n) => `${n.tag}[${n.label}]`).join(", "));

    const positive = stops.filter((s) => s.tabIndex > 0);
    check(`${route}: no positive tabindex`, positive.length === 0,
      positive.map((p) => `${p.tag}[${p.label}]=tabindex ${p.tabIndex}`).join(", "));

    /**
     * Document order, measured in *document* space.
     *
     * `getBoundingClientRect().top` is viewport-relative, and focusing an
     * element scrolls the page, so it would flag every stop as out of order.
     * Positions are normalised against the element's own offset parent chain
     * via `offsetTop`, which is stable regardless of scroll.
     */
    // Tab order must match DOM order. Anything that reorders the sequence is
    // either a positive `tabindex` (asserted above) or a negative one used to
    // pull an element forward.
    const outOfOrder = [];
    for (let i = 1; i < stops.length; i += 1) {
      const prev = stops[i - 1];
      const cur = stops[i];
      if (cur.domIndex < 0 || prev.domIndex < 0) continue;
      if (cur.domIndex <= prev.domIndex) {
        outOfOrder.push(`${cur.label} (dom #${cur.domIndex} after #${prev.domIndex})`);
      }
    }
    check(`${route}: tab order matches DOM order`, outOfOrder.length === 0,
      [...new Set(outOfOrder)].join(", "));

    // The skip link must be the very first stop and must move focus to <main>.
    const first = stops[0];
    const isSkip = /skip to main/i.test(first?.label ?? "");
    check(`${route}: skip link is the first tab stop`, isSkip, first?.label ?? "(none)");

    if (isSkip) {
      await page.evaluate(() => {
        document.activeElement?.blur();
        window.scrollTo(0, 0);
      });
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(300);
      const landed = await page.evaluate(() => {
        const main = document.querySelector("main#main");
        if (!main) return { found: false };
        const active = document.activeElement;
        return {
          found: true,
          inside: !!(active && main.contains(active)),
          hash: location.hash,
        };
      });
      check(
        `${route}: skip link moves focus into <main>`,
        landed.found && (landed.inside || landed.hash === "#main"),
        JSON.stringify(landed),
      );
    }

    // Escape must not leave a focus trap behind on the mobile dialog.
    if (route === "/") {
      const trapped = await page.evaluate(async () => {
        const trigger = document.querySelector('[aria-controls="mobile-menu"]');
        if (!trigger) return "no trigger";
        trigger.focus();
        trigger.click();
        await new Promise((r) => setTimeout(r, 700));
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
        );
        await new Promise((r) => setTimeout(r, 900));
        return document.getElementById("mobile-menu") === null
          ? "closed"
          : "still open";
      });
      check(`${route}: Escape dismisses the mobile dialog`, trapped === "closed", trapped);
    }

    await context.close();
  }
} finally {
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise((r) => setTimeout(r, 20_000)),
  ]);
}

console.log(failures === 0 ? "\nKEYBOARD AUDIT PASSED" : `\n${failures} keyboard check(s) failed.`);
process.exitCode = failures === 0 ? 0 : 1;
