import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('browser-only behavior is not evaluated from Astro server frontmatter', async () => {
  const layout = await readFile(resolve(root, 'src/layouts/SiteLayout.astro'), 'utf8');
  const frontmatter = layout.match(/^---([\s\S]*?)---/)?.[1] ?? '';

  assert.doesNotMatch(frontmatter, /scripts\/site/);
});
