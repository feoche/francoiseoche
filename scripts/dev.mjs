import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const browserSync = require('browser-sync').create();

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildScript = path.join(rootDir, 'scripts', 'build.mjs');

// Source paths that feed the build. Editing any of these regenerates docs/.
const watchTargets = [
  'styles.css',
  'index.js',
  'en.html',
  'fr.html',
  'site.config.json',
  'data',
  'js',
  'cv',
  'assets',
  'scripts'
];

function runBuild() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [buildScript], { cwd: rootDir, stdio: 'inherit' });
    child.on('close', (code) => resolve(code === 0));
  });
}

// Coalesce bursts of fs events into a single rebuild.
let rebuildTimer = null;
let rebuilding = false;
function scheduleRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(async () => {
    if (rebuilding) {
      scheduleRebuild();
      return;
    }
    rebuilding = true;
    const ok = await runBuild();
    rebuilding = false;
    if (ok) browserSync.reload();
  }, 150);
}

await runBuild();

browserSync.init({
  server: { baseDir: path.join(rootDir, 'docs') },
  open: true,
  notify: true,
  ghostMode: false,
  ui: false
});

for (const target of watchTargets) {
  watch(path.join(rootDir, target), { recursive: true }, scheduleRebuild);
}

console.log('Watching source files — edits trigger a rebuild + reload.');
