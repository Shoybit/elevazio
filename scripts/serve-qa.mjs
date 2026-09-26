#!/usr/bin/env node
/**
 * QA helper: rebuild, restart a production server on a fixed port and wait
 * until every stylesheet actually resolves, so visual runs never measure a
 * half-initialised server.
 *
 * Usage:  node scripts/serve-qa.mjs [port]
 */
import { spawn, spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import path from "node:path";

const port = Number(process.argv[2] ?? 3314);
const base = `http://localhost:${port}`;

// Invoke the Next CLI through the current Node binary rather than a shell, so
// the child is spawned without `shell: true` (which both warns about unescaped
// arguments and needlessly widens the command surface).
const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");

// 1. Stop any previous instance bound to this project.
spawnSync("powershell", [
  "-NoProfile",
  "-Command",
  `Get-Process node -ErrorAction SilentlyContinue | ForEach-Object { try { $cl = (Get-CimInstance Win32_Process -Filter "ProcessId=$($_.Id)").CommandLine } catch { $cl = '' }; if($cl -match 'real_state_spaciaz' -and $cl -match 'next'){ Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue } }`,
]);
await delay(1500);

// 2. Fresh production build.
const build = spawnSync(process.execPath, [nextBin, "build"], { stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);

// 3. Start the server.
const server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
  detached: true,
  stdio: "ignore",
});
server.unref();

// 4. Wait for the HTML *and* every stylesheet to resolve.
let ready = false;
for (let attempt = 0; attempt < 40 && !ready; attempt += 1) {
  await delay(700);
  try {
    const html = await (await fetch(base)).text();
    const styles = [
      ...new Set([...html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g)].map((m) => m[1])),
    ];
    if (styles.length === 0) continue;
    const results = await Promise.all(
      styles.map((href) => fetch(base + href).then((r) => r.status)),
    );
    if (results.every((status) => status === 200)) {
      console.log(`ready: ${base} (${styles.length} stylesheet(s) verified)`);
      ready = true;
    }
  } catch {
    // keep polling
  }
}

// The server is detached and unref'd, so the loop drains on its own. Calling
// process.exit() here instead trips a libuv handle assertion on Windows
// (`handle->flags & UV_HANDLE_CLOSING`) while the spawn handle is still
// closing, which surfaces as a bogus non-zero exit code.
if (!ready) console.error("server did not become ready");
process.exitCode = ready ? 0 : 1;
