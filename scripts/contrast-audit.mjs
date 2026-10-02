/**
 * Contrast audit for the design tokens.
 *
 * Reads the resolved custom properties out of a running page and checks every
 * foreground/background pair the stylesheet actually composes against WCAG
 * 2.1 AA. Computes from the live computed values rather than a hard-coded
 * table, so a token change fails this instead of quietly regressing.
 *
 * Usage:  node scripts/contrast-audit.mjs [baseUrl]
 */
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3314";

/** [label, foreground token, background token, minimum ratio] */
const PAIRS = [
  ["body copy on canvas", "--color-ink", "--color-canvas", 4.5],
  ["body copy on warm surface", "--color-ink", "--color-surface-warm", 4.5],
  ["body copy on surface", "--color-ink", "--color-surface", 4.5],
  ["secondary copy on canvas", "--color-ink-light", "--color-canvas", 4.5],
  ["secondary copy on warm surface", "--color-ink-light", "--color-surface-warm", 4.5],
  ["secondary copy on surface", "--color-ink-light", "--color-surface", 4.5],
  ["headings on canvas", "--color-accent", "--color-canvas", 4.5],
  ["headings on warm surface", "--color-accent", "--color-surface-warm", 4.5],
  ["white on accent (dark surfaces)", "--color-canvas", "--color-accent", 4.5],
  ["lime CTA text on accent", "--color-primary", "--color-accent", 4.5],
  ["accent text on lime CTA", "--color-accent", "--color-primary", 4.5],
  ["accent text on soft lime", "--color-accent", "--color-primary-soft", 4.5],
];

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--hide-scrollbars"],
});

let failures = 0;
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();
  await page.goto(base + "/", { waitUntil: "load" });

  const tokens = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const out = {};
    for (const name of [
      "--color-primary",
      "--color-primary-hover",
      "--color-primary-soft",
      "--color-accent",
      "--color-ink",
      "--color-ink-light",
      "--color-canvas",
      "--color-surface",
      "--color-surface-warm",
    ]) {
      out[name] = cs.getPropertyValue(name).trim();
    }
    return out;
  });

  const toRgb = (hex) => {
    const h = hex.replace("#", "");
    const full =
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  };
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const luminance = (hex) => {
    const [r, g, b] = toRgb(hex);
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const ratio = (a, b) => {
    const l1 = luminance(a);
    const l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  console.log("token contrast (WCAG 2.1 AA)\n");
  for (const [label, fg, bg, min] of PAIRS) {
    const a = tokens[fg];
    const b = tokens[bg];
    if (!a || !b) {
      console.log(`  ??    ${label} — ${!a ? fg : bg} not resolvable`);
      failures += 1;
      continue;
    }
    const r = ratio(a, b);
    const ok = r >= min;
    if (!ok) failures += 1;
    console.log(
      `  ${ok ? "PASS" : "FAIL"}  ${label.padEnd(34)} ${a} on ${b}  ${r.toFixed(2)}:1 (needs ${min})`,
    );
  }

  await context.close();
} finally {
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise((r) => setTimeout(r, 20_000)),
  ]);
}

console.log(failures === 0 ? "\nCONTRAST AUDIT PASSED" : `\n${failures} contrast check(s) failed.`);
process.exitCode = failures === 0 ? 0 : 1;
