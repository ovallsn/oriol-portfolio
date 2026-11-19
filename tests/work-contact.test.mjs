import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function readJson(path) {
  try {
    return JSON.parse(await readFile(resolve(root, path), 'utf8'));
  } catch {
    return {};
  }
}

async function readOrEmpty(path) {
  try {
    return await readFile(resolve(root, path), 'utf8');
  } catch {
    return '';
  }
}

test('selected work presents verified projects with private examples anonymized', async () => {
  const projects = (await readJson('src/data/portfolio.json')).projects ?? [];

  assert.deepEqual(projects.map((project) => project.id), [
    'internal-application',
    'client-operations',
    'valls-solutions',
    'letsstudy',
    'shopify-storefront',
    'dual-timezone-clock',
    'vallstv',
  ]);
  assert.ok(projects.every((project) => project.title?.en && project.title?.es));
  assert.ok(projects.every((project) => project.summary?.en && project.summary?.es));
  assert.ok(projects.every((project) => project.tools?.length));
  assert.ok(projects.filter((project) => project.confidentialityNote).length >= 2);
  assert.match(projects.find((project) => project.id === 'internal-application')?.confidentialityNote?.en ?? '', /anonymized/i);
});

test('business proof is attributed to Valls Solutions and its case links to the real site', async () => {
  const projects = (await readJson('src/data/portfolio.json')).projects ?? [];
  const proofCases = projects.filter((project) => project.proof);
  const business = projects.find((project) => project.id === 'valls-solutions');

  assert.deepEqual(proofCases.map((project) => project.id), ['valls-solutions']);
  assert.match(business?.proof?.en ?? '', /Valls Solutions/i);
  assert.match(business?.proof?.es ?? '', /Valls Solutions/i);
  assert.equal(business?.destinationUrl, 'https://vallssolutions.com');
});

test('LetsStudy is presented as a public project with its repository as the destination', async () => {
  const project = (await readJson('src/data/portfolio.json')).projects?.find((item) => item.id === 'letsstudy');

  assert.equal(project?.destinationUrl, 'https://github.com/ovallsn/letsstudy');
  assert.ok(project?.tools?.includes('Kotlin'));
  assert.ok(project?.tools?.includes('Jetpack Compose'));
});

test('contact links use the approved direct contact details in both locales', async () => {
  const contact = (await readJson('src/data/portfolio.json')).contact ?? {};

  assert.equal(contact.email, 'oriolvallsnunezz@gmail.com');
  assert.equal(contact.linkedin, 'https://www.linkedin.com/in/oriolvallsn/');
  assert.equal(contact.github, 'https://github.com/ovallsn');
  assert.equal(contact.business, 'https://vallssolutions.com');
});

test('both generated pages expose a usable contact route and linked project evidence', async () => {
  const english = await readOrEmpty('dist/index.html');
  const spanish = await readOrEmpty('dist/es/index.html');

  for (const html of [english, spanish]) {
    assert.match(html, /href="mailto:oriolvallsnunezz@gmail\.com"/);
    assert.match(html, /<form[^>]+action="https:\/\/formsubmit\.co\/oriolvallsnunezz@gmail\.com"[^>]+method="post"/);
    assert.match(html, /href="https:\/\/www\.linkedin\.com\/in\/oriolvallsn\/"/);
    assert.match(html, /href="https:\/\/vallssolutions\.com"/);
    assert.match(html, /LetsStudy/);
    assert.match(html, /href="https:\/\/github\.com\/ovallsn\/dual-timezone-clock-android"/);
    assert.match(html, /href="https:\/\/github\.com\/ovallsn\/shopify-pokemon-card-store"/);
    assert.match(html, /href="https:\/\/www\.twitch\.tv\/vallstv"/);
    assert.doesNotMatch(html, /contact-form-help|contact-draft-help/);
  }
});
