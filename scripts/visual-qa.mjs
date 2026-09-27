/**
 * Visual QA harness.
 *
 * The page is ~15 000px tall and uses sticky panels plus viewport-height
 * sections, so a `fullPage` capture is meaningless (Chrome resizes the viewport
 * and the sticky layout collapses). Instead we walk the real scroll position
 * and capture viewport-height slices at every breakpoint in the spec, while
 * auditing horizontal overflow, console errors and off-viewport elements.
 *
 * Usage:  node scripts/visual-qa.mjs [baseUrl] [outDir] [widthsCsv]
 */
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const baseUrl = process.argv[2] ?? "http://localhost:3311/";
const outDir = path.resolve(process.argv[3] ?? ".qa");
const only = process.argv[4];

const VIEWPORTS = [
  { name: "320", width: 320, height: 720 },
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "414", width: 414, height: 896 },
  { name: "640", width: 640, height: 900 },
  { name: "768", width: 768, height: 1024 },
  { name: "834", width: 834, height: 1112 },
  { name: "1024", width: 1024, height: 900 },
  { name: "1280", width: 1280, height: 900 },
  { name: "1440", width: 1440, height: 950 },
  { name: "1536", width: 1536, height: 950 },
  { name: "1920", width: 1920, height: 1080 },
  { name: "2560", width: 2560, height: 1200 },
];

const MAX_SLICES = 18;
const problems = [];
const report = [];

/**
 * Chrome process ids currently running.
 *
 * Playwright does not expose the browser's pid, and a renderer that ignores
 * `close()` leaves its helper processes behind forever. Snapshotting the set
 * before launch lets teardown reap exactly the processes this run created,
 * without touching a Chrome window the developer already had open.
 */
const chromePids = () => {
  const result = spawnSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      "(Get-Process chrome -ErrorAction SilentlyContinue).Id",
    ],
    { encoding: "utf8" },
  );
  return new Set(
    (result.stdout ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .map(Number),
  );
};

const chromeBeforeLaunch = chromePids();

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: [
    "--force-color-profile=srgb",
    "--hide-scrollbars",
    // Keeps long capture runs from exhausting shared memory on Windows.
    "--disable-dev-shm-usage",
    "--disable-gpu",
  ],
});

await mkdir(outDir, { recursive: true });
const reportPath = path.join(outDir, "report.txt");

const targets = only
  ? VIEWPORTS.filter((v) => only.split(",").includes(v.name))
  : VIEWPORTS;

for (const viewport of targets) {
  let context;
  try {
    context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => pageErrors.push(String(err)));
    page.on("requestfailed", (req) =>
      consoleErrors.push(`REQUEST FAILED ${req.url()}`),
    );

    await page.goto(baseUrl, { waitUntil: "load" });
    await page.waitForTimeout(400);

  // Walk the page so every IntersectionObserver reveal fires and lazy images
  // decode.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.75);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
  });
  await page.waitForTimeout(1200);
  await page
    .evaluate(() =>
      Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map((img) => img.decode().catch(() => undefined)),
      ),
    )
    .catch(() => undefined);

  const audit = await page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    const overflowing = [];

    /** True when an ancestor clips its overflow, so the bleed is intentional. */
    const isClipped = (el) => {
      let node = el.parentElement;
      while (node && node !== document.body) {
        const cs = getComputedStyle(node);
        if (
          cs.overflowX === "hidden" ||
          cs.overflowX === "clip" ||
          cs.overflowX === "auto" ||
          cs.overflowX === "scroll"
        ) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.right > clientWidth + 1.5 || r.left < -1.5) {
        const cs = getComputedStyle(el);
        if (cs.position === "fixed" || cs.pointerEvents === "none") return;
        if (el.closest("[aria-hidden='true']")) return;
        if (isClipped(el)) return;
        overflowing.push(
          `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 70)} right=${Math.round(r.right)} left=${Math.round(r.left)}`,
        );
      }
    });
    return {
      docWidth,
      clientWidth,
      scrollHeight: document.body.scrollHeight,
      overflowing: overflowing.slice(0, 10),
    };
  });

  if (audit.docWidth > audit.clientWidth + 1) {
    problems.push(
      `[${viewport.name}] horizontal overflow: scrollWidth=${audit.docWidth} clientWidth=${audit.clientWidth}`,
    );
  }
  if (audit.overflowing.length) {
    problems.push(
      `[${viewport.name}] elements outside viewport:\n    ` +
        audit.overflowing.join("\n    "),
    );
  }
  if (consoleErrors.length) {
    problems.push(
      `[${viewport.name}] console errors:\n    ${consoleErrors.join("\n    ")}`,
    );
  }
  if (pageErrors.length) {
    problems.push(
      `[${viewport.name}] page errors:\n    ${pageErrors.join("\n    ")}`,
    );
  }

  const total = audit.scrollHeight;
  const sliceCount = Math.min(
    Math.ceil(total / viewport.height),
    MAX_SLICES,
  );
  for (let i = 0; i < sliceCount; i += 1) {
    const y = Math.min(i * viewport.height, Math.max(total - viewport.height, 0));
    await page.evaluate((target) => window.scrollTo(0, target), y);
    await page.waitForTimeout(650);
    await page.screenshot({
      path: path.join(
        outDir,
        `vp${viewport.name}-${String(i).padStart(2, "0")}.jpg`,
      ),
      type: "jpeg",
      quality: 70,
      timeout: 30_000,
    });
  }

  report.push(
    `${String(viewport.name).padStart(5)}px  height=${String(total).padStart(6)}  slices=${String(sliceCount).padStart(2)}  overflowX=${audit.docWidth - audit.clientWidth}`,
  );
  console.error(`[qa] ${viewport.name} done (${sliceCount} slices)`);

    // Persist after every viewport so a long run is never lost.
    await writeFile(
      reportPath,
      `${report.join("\n")}\n\n=== PROBLEMS ===\n${problems.length ? problems.join("\n") : "none"}`,
      "utf8",
    );
  } catch (error) {
    // A crashed renderer must not abort the remaining viewports.
    problems.push(`[${viewport.name}] capture aborted: ${String(error)}`);
    console.error(`[qa] ${viewport.name} FAILED: ${String(error)}`);
  } finally {
    if (context) await context.close().catch(() => undefined);
  }
}

// Shutting down real Chrome costs ~15s bare and considerably longer after a
// full capture run, and a wedged renderer spins a core forever instead of ever
// settling. The close is therefore bounded so a stuck renderer cannot hang CI.
// A slow shutdown is not itself a failure: the audit has already been written,
// so this only decides how the process ends, never the verdict.
const closedInTime = await Promise.race([
  browser
    .close()
    .then(() => true)
    .catch(() => true),
  new Promise((resolve) => setTimeout(() => resolve(false), 60_000)),
]);
if (!closedInTime) {
  // Orphaned renderers never reap themselves, so end them explicitly rather
  // than leaking ~11 processes and a busy core into the next run.
  const orphans = [...chromePids()].filter((pid) => !chromeBeforeLaunch.has(pid));
  for (const pid of orphans) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // Already gone, or owned by another user session.
    }
  }
  console.error(
    `[qa] browser.close() timed out after 60s; reaped ${orphans.length} orphaned renderer process(es)`,
  );
}

await writeFile(
  reportPath,
  `${report.join("\n")}\n\n=== PROBLEMS ===\n${problems.length ? problems.join("\n") : "none"}`,
  "utf8",
);

console.log(report.join("\n"));
console.log("\n=== PROBLEMS ===");
console.log(problems.length ? problems.join("\n") : "none");

process.exitCode = problems.length ? 1 : 0;

// Only a wedged renderer keeps the loop alive, and only then is a forced exit
// needed. Forcing it unconditionally trips a libuv handle assertion on Windows
// (`handle->flags & UV_HANDLE_CLOSING`), which reports a bogus failure.
if (!closedInTime) setTimeout(() => process.exit(process.exitCode ?? 1), 500);
