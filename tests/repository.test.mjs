import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { renderExamples } from '../scripts/build-examples.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const text = file => readFile(path.join(root, file), 'utf8');
const cases = JSON.parse(await text('examples/cases.json'));
const strip = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

async function files(dir = root) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git', '.data', 'node_modules'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await files(full));
    else if (entry.isFile()) result.push(full);
  }
  return result;
}

test('skill has portable identity, narrow trigger and bounded size', async () => {
  const skill = await text('skills/ui-without-noise/SKILL.md');
  assert.match(skill, /^---\nname: ui-without-noise\ndescription: .+\n/);
  assert.match(skill, /license: MIT/);
  assert.match(skill, /Not a general visual redesign/);
  assert.ok(skill.split('\n').length <= 100, 'keep the loaded skill small');
  assert.ok(Buffer.byteLength(skill) < 9000);
});

test('the installed skill directory contains only guidance and license', async () => {
  const names = (await readdir(path.join(root, 'skills/ui-without-noise'))).sort();
  assert.deepEqual(names, ['LICENSE', 'SKILL.md']);
  assert.equal(await text('LICENSE'), await text('skills/ui-without-noise/LICENSE'));
});

test('all six examples retain their declared necessary facts and actions', () => {
  assert.equal(cases.length, 6);
  assert.equal(new Set(cases.map(item => item.id)).size, 6);
  for (const item of cases) {
    assert.match(item.id, /^[a-z]+(?:-[a-z]+)*$/);
    for (const required of item.protected) {
      assert.ok(strip(item.before).includes(required), `${item.id}: before missing ${required}`);
      assert.ok(strip(item.after).includes(required), `${item.id}: after missing ${required}`);
    }
    assert.ok(strip(item.after).length < strip(item.before).length, `${item.id}: no subtraction shown`);
    const buttonLabels = html => [...html.matchAll(/<button\b[^>]*>(.*?)<\/button>/gs)].map(match => strip(match[1]));
    assert.deepEqual(buttonLabels(item.after), buttonLabels(item.before), `${item.id}: actions changed`);
  }
});

test('form constraints and error associations survive on both sides', () => {
  const item = cases.find(item => item.id === 'form');
  for (const side of ['before', 'after']) {
    assert.ok(item[side].includes(`for="name-${side}"`));
    assert.ok(item[side].includes(`id="name-${side}"`));
    assert.match(item[side], /required maxlength="40" aria-invalid="true"/);
    assert.ok(item[side].includes(`aria-describedby="name-hint-${side} name-error-${side}"`));
  }
});

test('permission reason remains visibly associated; unknown and destructive facts stay', () => {
  const permission = cases.find(item => item.id === 'permission');
  for (const side of ['before', 'after']) {
    assert.ok(permission[side].includes(`disabled aria-describedby="permission-${side}"`));
    assert.ok(permission[side].includes(`id="permission-${side}"`));
  }
  assert.match(cases.find(item => item.id === 'unknown-result').after, /保存结果未知。先查询这次保存的结果，不要重复保存。/);
  assert.match(cases.find(item => item.id === 'destructive-action').after, /旅行计划.*12 条笔记，无法恢复/);
});

test('generated page exactly matches current fixtures and builder', async () => {
  const current = await text('examples/index.html');
  assert.equal(current, renderExamples(cases));
  const changed = structuredClone(cases);
  changed[0].change += ' synthetic drift';
  assert.notEqual(current, renderExamples(changed), 'non-protected fixture drift must also be detectable');
});

test('static demo includes all pairs, unique ids and no executable or remote assets', async () => {
  const html = await text('examples/index.html');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal((html.match(/data-variant="before"/g) || []).length, cases.length);
  assert.equal((html.match(/data-variant="after"/g) || []).length, cases.length);
  assert.doesNotMatch(html, /<script\b|\bon\w+\s*=|(?:src|href)="https?:/i);
  assert.match(html, /form-action 'none'/);
  assert.match(html, /不是 agent 运行效果测评/);
  const css = await text('examples/styles.css');
  assert.doesNotMatch(css, /display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:|line-clamp|text-overflow|@import|url\(/i);
});

test('all local Markdown links and image destinations resolve inside repository', async () => {
  let checked = 0;
  for (const file of (await files()).filter(file => file.endsWith('.md'))) {
    const source = (await readFile(file, 'utf8')).replace(/```[\s\S]*?```/g, '');
    for (const match of source.matchAll(/!?\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))\)/g)) {
      const href = match[1] ?? match[2];
      if (/^[a-z][a-z\d+.-]*:|^#/i.test(href)) continue;
      const filename = decodeURIComponent(href.split('#')[0]);
      const target = path.resolve(path.dirname(file), filename);
      assert.ok(target === root || target.startsWith(root + path.sep), `outside repository: ${href}`);
      await stat(target);
      checked++;
    }
  }
  assert.ok(checked >= 20);
});

test('render report binds screenshots to current inputs and successful viewport checks', async () => {
  const report = JSON.parse(await text('examples/render-report.json'));
  assert.equal(report.evidence, 'browser-rendered synthetic editorial examples; not an agent benchmark');
  assert.deepEqual(report.viewports, [1200, 390, 320]);
  assert.deepEqual(Object.keys(report.inputs).sort(), ['examples/cases.json', 'examples/styles.css', 'examples/index.html', 'scripts/build-examples.mjs', 'scripts/capture.mjs'].sort());
  assert.deepEqual(report.screenshots.map(shot => shot.file).sort(), [...cases.map(item => `assets/${item.id}.png`), 'assets/empty-state-mobile.png'].sort());
  for (const [file, expected] of Object.entries(report.inputs)) {
    assert.equal(sha(await readFile(path.join(root, file))), expected, `stale render input: ${file}`);
  }
  assert.equal(report.screenshots.length, 7);
  for (const shot of report.screenshots) {
    const bytes = await readFile(path.join(root, shot.file));
    assert.deepEqual([...bytes.subarray(0, 8)], [137,80,78,71,13,10,26,10]);
    assert.equal(bytes.readUInt32BE(16), shot.width, `screenshot width: ${shot.file}`);
    assert.equal(bytes.readUInt32BE(20), shot.height, `screenshot height: ${shot.file}`);
    assert.equal(sha(bytes), shot.sha256, `screenshot drift: ${shot.file}`);
  }
  assert.ok(report.checks.length >= 10);
  assert.ok(report.checks.every(check => check.passed), 'browser checks contain failures');
});
