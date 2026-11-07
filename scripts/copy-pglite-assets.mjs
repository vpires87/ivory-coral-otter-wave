#!/usr/bin/env node
/**
 * Nitro bundles PGLite but does not copy its wasm/data files next to the
 * rewritten import. The built server (no DATABASE_URL) crashes on boot without
 * them. Real Postgres skips PGLite; the files are only needed for that fallback.
 */
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const destDir = join(root, ".vercel/output/functions/__server.func/_libs");
if (!existsSync(destDir)) {
  console.log("[pglite] no server bundle — skip");
  process.exit(0);
}
const srcDir = join(root, "node_modules/@electric-sql/pglite/dist");
for (const name of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  copyFileSync(join(srcDir, name), join(destDir, name));
}
console.log("[pglite] copied wasm assets next to the server bundle");
