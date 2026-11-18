import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function portfolioData() {
  try {
    return JSON.parse(await readFile(resolve(root, 'src/data/portfolio.json'), 'utf8'));
  } catch {
    return {};
  }
}

test('English and Spanish position Oriol for technical and application support', async () => {
  const data = await portfolioData();

  assert.equal(data.copy?.en?.hero?.headline, 'Technical & Application Support');
  assert.equal(data.copy?.es?.hero?.headline, 'Soporte técnico y de aplicaciones');
  assert.match(data.copy?.en?.hero?.summary ?? '', /follow cases through/i);
  assert.match(data.copy?.es?.hero?.summary ?? '', /hago seguimiento/i);
});

test('both role-focused CV links point to the existing public PDFs in each language', async () => {
  const links = (await portfolioData()).cvLinks;

  assert.match(links?.support?.en ?? '', /Technical_Support_Client_Operations_EN\.pdf$/);
  assert.match(links?.support?.es ?? '', /Soporte_Tecnico_Operaciones_Cliente_ES\.pdf$/);
  assert.match(links?.application?.en ?? '', /Backend_Application_Support_EN\.pdf$/);
  assert.match(links?.application?.es ?? '', /Backend_Soporte_Aplicaciones_ES\.pdf$/);
});

test('skill groups show verified tools and a localized example of use', async () => {
  const groups = (await portfolioData()).skillGroups ?? [];
  const ids = groups.map((group) => group.id);

  assert.deepEqual(ids, ['support', 'systems', 'applications', 'operations']);
  assert.ok(groups.every((group) => group.label?.en && group.label?.es));
  assert.ok(groups.every((group) => group.example?.en && group.example?.es));
  assert.ok(groups.some((group) => group.skills?.en?.includes('Laravel / PHP')));
  assert.ok(groups.some((group) => group.skills?.en?.includes('Microsoft 365')));
});

test('the experience timeline keeps each verified role and Valls Solutions distinct', async () => {
  const entries = (await portfolioData()).experience ?? [];
  const companies = entries.map((entry) => entry.company);

  assert.deepEqual(companies, [
    'Valls Solutions',
    'Cero Agency',
    'Foment Formació',
    'Foment Formació',
    'UOC',
  ]);
  assert.ok(entries.every((entry) => entry.title?.en && entry.title?.es));
  assert.ok(entries.every((entry) => entry.dates?.en && entry.dates?.es));
});
