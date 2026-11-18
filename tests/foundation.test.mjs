import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function readOrEmpty(path) {
  try {
    return await readFile(resolve(root, path), 'utf8');
  } catch {
    return '';
  }
}

test('the static project is configured for its GitHub Pages subpath', async () => {
  const config = await readOrEmpty('astro.config.mjs');
  const packageText = await readOrEmpty('package.json');
  const packageJson = packageText ? JSON.parse(packageText) : {};

  assert.match(config, /site:\s*["']https:\/\/ovallsn\.github\.io["']/);
  assert.match(config, /base:\s*["']\/oriol-portfolio["']/);
  assert.equal(packageJson.scripts?.build, 'astro build');
});

test('both built locale pages declare language and reciprocal alternates', async () => {
  const english = await readOrEmpty('dist/index.html');
  const spanish = await readOrEmpty('dist/es/index.html');

  assert.match(english, /<html[^>]+lang="en"/);
  assert.match(spanish, /<html[^>]+lang="es"/);
  assert.match(english, /hreflang="es"[^>]+\/oriol-portfolio\/es\//);
  assert.match(spanish, /hreflang="en"[^>]+\/oriol-portfolio\//);
});

test('the shared shell exposes keyboard-friendly theme and locale controls', async () => {
  const english = await readOrEmpty('dist/index.html');

  assert.match(english, /aria-label="Switch color theme"/);
  assert.match(english, /href="\/oriol-portfolio\/es\/"/);
  assert.match(english, /<main\b/);
  assert.match(english, /Skip to content/);
});
