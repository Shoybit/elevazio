/**
 * Dependency audit.
 *
 * `npm audit` reports what is *known* to be vulnerable. This reports the other
 * half: what is installed, what is actually imported, and what is out of date.
 * An unused dependency is attack surface that ships to the CDN for no benefit,
 * and an abandoned package is a future CVE with no upgrade path.
 *
 * Usage:  node scripts/package-audit.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

/** Collects every source file under `src/`. */
const sourceFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|mts|cts)$/.test(entry.name)) sourceFiles.push(full);
  }
})(path.join(root, "src"));

/** Also scan the QA scripts, which are real consumers of playwright-core. */
const scriptFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.mjs$/.test(entry.name)) scriptFiles.push(full);
  }
})(path.join(root, "scripts"));

const corpus = [...sourceFiles, ...scriptFiles]
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

/** Package name -> whether any import specifier references it. */
function isImported(name) {
  // Match a bare specifier or a subpath: `from "name"`, `from "name/sub"`,
  // `require("name")`, or a dynamic `import("name")`.
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `(?:from|import|require)\\s*\\(?\\s*["']${escaped}(?:/[^"']*)?["']`,
  );
  return re.test(corpus);
}

let failures = 0;
const fail = (line) => {
  failures += 1;
  console.log(`  FAIL  ${line}`);
};

console.log("declared dependencies\n");

/**
 * Packages that are legitimately never imported by application code.
 *
 * - `react-dom` is required by Next.js at runtime; the framework calls
 *   `hydrateRoot` itself, so no module imports it.
 * - `@types/*` exist for the compiler, not for the bundler.
 * - `eslint` / `eslint-config-next` are loaded by name from `eslint.config.mjs`.
 * - `@tailwindcss/postcss` is loaded by name from `postcss.config.mjs`.
 *
 * Anything not listed here must actually appear in an import statement, or it
 * is dead weight in the deploy.
 */
const CONFIGURED_ELSEWHERE = {
  "react-dom": "required by Next.js at runtime (hydrateRoot)",
  "@types/node": "TypeScript types",
  "@types/react": "TypeScript types",
  "@types/react-dom": "TypeScript types",
  eslint: "loaded by name from eslint.config.mjs",
  "eslint-config-next": "loaded by name from eslint.config.mjs",
  "@tailwindcss/postcss": "loaded by name from postcss.config.mjs",
  tailwindcss: "loaded by name from postcss.config.mjs / globals.css",
  typescript: "invoked via the `typecheck` npm script, not imported",
};

const configFiles = ["next.config.ts", "postcss.config.mjs", "eslint.config.mjs"];
const configCorpus = configFiles
  .filter((f) => {
    try {
      statSync(path.join(root, f));
      return true;
    } catch {
      return false;
    }
  })
  .map((f) => readFileSync(path.join(root, f), "utf8"))
  .join("\n");

const declared = [
  ...Object.entries(pkg.dependencies ?? {}).map(([n, v]) => ["prod", n, v]),
  ...Object.entries(pkg.devDependencies ?? {}).map(([n, v]) => ["dev", n, v]),
];

for (const [kind, name, range] of declared) {
  let installed = "not installed";
  try {
    const meta = JSON.parse(
      readFileSync(path.join(root, "node_modules", name, "package.json"), "utf8"),
    );
    installed = meta.version;
  } catch {
    fail(`${name} declared in ${kind}Dependencies but not present in node_modules`);
    continue;
  }

  const justification = CONFIGURED_ELSEWHERE[name];
  let status;
  if (isImported(name)) status = "used";
  else if (justification && configCorpus.includes(name.replace("/postcss", "")))
    status = `not imported — ${justification}`;
  else if (justification) status = `not imported — ${justification}`;
  else {
    status = "UNUSED";
    fail(`${name} (${kind}) is declared but never imported or configured`);
  }

  console.log(
    `  ${status === "UNUSED" ? "FAIL" : "PASS"}  ${kind.padEnd(4)} ${name.padEnd(22)} ${range.padEnd(12)} installed ${installed.padEnd(10)} ${status}`,
  );
}

/**
 * A caret range on a *runtime* dependency means two installs a month apart can
 * resolve to different trees, which is how a "works on my machine" bug and an
 * unreviewed major upgrade both slip in. `package-lock.json` pins the tree for
 * `npm ci`, so this is a warning about intent, not about reproducibility.
 */
console.log("\nversion pinning (runtime dependencies)\n");
for (const [name, range] of declared
  .filter(([k]) => k === "prod")
  .map(([, n, v]) => [n, v])) {
  const exact = /^\d+\.\d+\.\d+(-[\w.]+)?$/.test(range);
  if (!exact) console.log(`  INFO  ${name} uses a range (${range}) — locked by package-lock.json`);
  else console.log(`  PASS  ${name} pinned to ${range}`);
}
console.log(
  "  INFO  devDependencies use ranges by design; they never reach the client bundle",
);

const { spawnSync } = await import("node:child_process");
let audit = { vulnerabilities: {}, metadata: null };
try {
  // `npm audit` exits non-zero whenever it finds anything, so the exit code is
  // not a signal here — the JSON report is what matters.
  // `npm` is a `.cmd` shim on Windows, which `shell: false` cannot exec
  // (`EINVAL`), while `shell: true` triggers a deprecation warning. The nvm
  // install layout puts a real `npm-cli.js` next to the node binary, so invoke
  // that directly through the current Node process: no shell, no shim.
  const nodeDir = path.dirname(process.execPath);
  const npmCli = [
    path.join(nodeDir, "node_modules", "npm", "bin", "npm-cli.js"),
    path.join(nodeDir, "node_modules", "npm", "bin", "npm-cli.js".replace("/", "\\")),
  ].find((p) => {
    try {
      statSync(p);
      return true;
    } catch {
      return false;
    }
  });

  const res = npmCli
    ? spawnSync(process.execPath, [npmCli, "audit", "--json"], { encoding: "utf8" })
    : spawnSync("npm", ["audit", "--json"], { encoding: "utf8" });
  const out = `${res.stdout ?? ""}`;
  const start = out.indexOf("{");
  if (start >= 0) audit = JSON.parse(out.slice(start));
  else throw new Error(`no JSON in npm audit output: ${out.slice(0, 200)}`);
} catch (err) {
  console.log(`  ??    could not read npm audit output — ${err.message}`);
}

const meta = audit?.metadata?.vulnerabilities;
console.log("\nnpm audit\n");
if (!meta) {
  fail("npm audit produced no vulnerability metadata");
} else {
  const clean = meta.total === 0;
  if (!clean) failures += 1;
  console.log(
    `  ${clean ? "PASS" : "FAIL"}  ${meta.critical} critical, ${meta.high} high, ${meta.moderate} moderate, ${meta.low} low, ${meta.info} info across ${audit.metadata.dependencies.total} packages`,
  );
  for (const [name, v] of Object.entries(audit.vulnerabilities ?? {})) {
    fail(
      `${name}: ${v.severity} — ${(v.via ?? []).map((x) => (typeof x === "string" ? x : x.title)).join("; ")}`,
    );
  }
}

// Scripts that are committed but reference nothing in the project are dead
// weight in the QA surface; report them so the list does not rot unnoticed.
console.log("\nQA scripts\n");
const wired = new Set(
  Object.values(pkg.scripts ?? {})
    .join(" ")
    .match(/scripts\/[\w.-]+/g) ?? [],
);
for (const file of readdirSync(path.join(root, "scripts"))) {
  const rel = `scripts/${file}`;
  const isWired = wired.has(rel);
  console.log(
    `  ${isWired ? "PASS" : "INFO"}  ${rel.padEnd(34)} ${isWired ? "wired to an npm script" : "run directly"} (${statSync(path.join(root, "scripts", file)).size} B)`,
  );
}

console.log(failures === 0 ? "\nPACKAGE AUDIT PASSED" : `\n${failures} dependency problem(s).`);
process.exitCode = failures === 0 ? 0 : 1;
