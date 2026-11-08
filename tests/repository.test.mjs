import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { renderExamples, renderPreviews } from '../scripts/build-examples.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const text = file => readFile(path.join(root, file), 'utf8');
const cases = JSON.parse(await text('examples/cases.json'));
const strip = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

function assertCaptureBounds(shot) {
  const bounds = shot.domBounds;
  assert.ok(bounds && Object.values(bounds).every(Number.isFinite), 'finite measured DOM bounds required');
  assert.ok(bounds.right > bounds.left && bounds.bottom > bounds.top, 'positive measured component size');
  const x = Math.floor(bounds.left);
  const y = Math.floor(bounds.top);
  assert.deepEqual({ x: shot.x, y: shot.y, width: shot.width, height: shot.height }, {
    x, y, width: Math.ceil(bounds.right) - x, height: Math.ceil(bounds.bottom) - y,
  }, 'capture must match rounded component bounds, without padding or truncation');
  assert.deepEqual(shot.domBoundsAfterCapture, bounds, 'component must not move during capture');
  assert.equal(shot.contentFits, true, 'component content must fit inside its measured bounds');
}

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

test('all recommended variants retain their declared necessary facts and actions', () => {
  assert.equal(cases.length, 13);
  assert.deepEqual([...new Set(cases.map(item => item.decision))].sort(), ['add', 'expand', 'keep', 'reduce', 'retain']);
  assert.equal(new Set(cases.map(item => item.id)).size, cases.length);
  for (const item of cases) {
    assert.match(item.id, /^[a-z]+(?:-[a-z]+)*$/);
    for (const required of item.protected) {
      assert.ok(strip(item.before).includes(required), `${item.id}: before missing ${required}`);
      assert.ok(strip(item.after).includes(required), `${item.id}: after missing ${required}`);
    }
    assert.ok(strip(item.after).length > 0, `${item.id}: recommended screen is blank`);
    for (const fact of item.learning ?? []) assert.ok(strip(item.after).includes(fact), `${item.id}: missing learning cue ${fact}`);
    const buttonLabels = html => [...html.matchAll(/<button\b[^>]*>(.*?)<\/button>/gs)].map(match => strip(match[1]));
    assert.deepEqual(buttonLabels(item.after), buttonLabels(item.before), `${item.id}: actions changed`);
  }
});

test('non-reductive examples demonstrate keeping, adding and purposeful repetition', () => {
  const kept = cases.find(item => item.id === 'already-sufficient');
  assert.equal(kept.decision, 'keep');
  assert.equal(kept.after, kept.before, 'already sufficient means no forced edit');
  for (const id of ['add-context', 'guided-start']) {
    const item = cases.find(item => item.id === id);
    assert.ok(item.context);
    assert.ok(item.learning.some(fact => !strip(item.before).includes(fact)), `${id}: demonstrate a genuinely missing explanation`);
    assert.match(renderExamples([item]), new RegExp(item.decision === 'add' ? '建议 · 补充必要说明' : '建议 · 增加分步引导'));
  }
  assert.equal((cases.find(item => item.id === 'guided-start').after.match(/<li>/g) ?? []).length, 3);
  const repeated = cases.find(item => item.id === 'purposeful-repetition');
  assert.equal(repeated.before.replaceAll('-before', '-after'), repeated.after);
  for (const side of ['before', 'after']) {
    assert.ok(repeated[side].includes(`href="#repeat-name-${side}"`));
    assert.ok(repeated[side].includes(`id="repeat-name-${side}"`));
    assert.equal(repeated[side].split('名称已被使用，请换一个名称。').length - 1, 2, 'same error supports navigation and local correction');
  }
});

test('capture bounds reject padded, truncated, shifted or overflowing evidence without comparing heights', () => {
  const valid = { x: 10, y: 20, width: 411, height: 101, domBounds: { left: 10.25, top: 20.5, right: 420.25, bottom: 120.5 }, domBoundsAfterCapture: { left: 10.25, top: 20.5, right: 420.25, bottom: 120.5 }, contentFits: true };
  assert.doesNotThrow(() => assertCaptureBounds(valid));
  for (const height of [51, 201]) assert.doesNotThrow(() => assertCaptureBounds({ ...valid, height, domBounds: { ...valid.domBounds, bottom: 20.5 + height - 1 }, domBoundsAfterCapture: { ...valid.domBounds, bottom: 20.5 + height - 1 } }));
  for (const change of [{ height: 102 }, { height: 100 }, { x: 11 }, { contentFits: false }, { domBoundsAfterCapture: { ...valid.domBounds, top: 21.5 } }]) assert.throws(() => assertCaptureBounds({ ...valid, ...change }));
});

test('overtrimmed examples are labeled counterexamples, not recommendations', () => {
  const triples = cases.filter(item => item.overtrimmed);
  assert.deepEqual(triples.map(item => item.id), ['empty-state', 'filtered-results', 'favorites', 'quiet-notifications']);
  for (const item of triples) {
    assert.ok(item.context, `${item.id}: audience and state context required`);
    assert.notEqual(item.overtrimmed, item.after);
    assert.match(renderExamples([item]), /data-variant="overtrimmed" aria-label="删得过头 · 反例"/);
    const missingMeaning = [...item.protected, ...(item.learning ?? [])].some(fact => !strip(item.overtrimmed).includes(fact));
    assert.ok(missingMeaning, `${item.id}: explain the counterexample's comprehension gap`);
  }
  const quiet = cases.find(item => item.id === 'quiet-notifications');
  assert.doesNotMatch(quiet.after, /<button|<p\b/);
  assert.match(quiet.after, /暂时没有新通知/);
});

test('guidance preserves learning and rejects word-count-only quality claims', async () => {
  const skill = await text('skills/ui-without-noise/SKILL.md');
  assert.match(skill, /least information sufficient/);
  assert.match(skill, /First use \/ unfamiliar feature/);
  assert.match(skill, /Temporarily nothing to do/);
  assert.match(skill, /Do not equate lower word count/);
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

test('README previews contain only unchanged before/after components', async () => {
  const html = await text('examples/previews.html');
  assert.equal(html, renderPreviews(cases));
  assert.equal((html.match(/class="component-comparison pair"/g) || []).length, cases.length);
  assert.equal((html.match(/data-variant="before"/g) || []).length, cases.length);
  assert.equal((html.match(/data-variant="after"/g) || []).length, cases.length);
  assert.doesNotMatch(html, /case-heading|case-number|variant-title|class="context"|class="change"|data-variant="overtrimmed"|page-header|<script\b|\bon\w+\s*=|(?:src|href)="https?:/i);
  for (const item of cases) for (const side of ['before', 'after']) assert.ok(html.includes(`>${item[side]}</article>`), `${item.id}/${side}: component markup must be unchanged`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.match(html, /form-action 'none'/);
  const readme = await text('README.md');
  assert.doesNotMatch(readme, /三方对照|<details>|<summary>/);
  assert.match(readme, /两张图片独立展示/);
  const previewImages = [...readme.matchAll(/!\[[^\]]*\]\(<(assets\/[^>]+\.png)>\)/g)].map(match => match[1]);
  assert.deepEqual(previewImages, ['empty-state', 'filtered-results', 'favorites', 'quiet-notifications', 'section-heading', 'form', 'permission', 'unknown-result', 'destructive-action', 'already-sufficient', 'add-context', 'guided-start', 'purposeful-repetition'].flatMap(id => [`assets/${id}-before.png`, `assets/${id}-after.png`]));
  assert.match(await text('.github/workflows/check.yml'), /run: node scripts\/build-examples\.mjs --check/);
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
  assert.deepEqual(report.viewports, [1440, 1024, 900, 390, 320]);
  assert.equal(report.screenshotSource, 'examples/previews.html; each before/after component captured separately; no teaching chrome');
  assert.deepEqual(Object.keys(report.inputs).sort(), ['examples/cases.json', 'examples/styles.css', 'examples/index.html', 'examples/previews.html', 'scripts/build-examples.mjs', 'scripts/capture.mjs'].sort());
  const expectedShots = [...cases.flatMap(item => ['before', 'after'].map(side => `assets/${item.id}-${side}.png`)), ...cases.filter(item => item.overtrimmed || item.decision !== 'reduce').flatMap(item => ['before', 'after'].map(side => `assets/${item.id}-mobile-${side}.png`))];
  assert.deepEqual((await readdir(path.join(root, 'assets'))).sort(), expectedShots.map(file => path.basename(file)).sort(), 'assets must contain only current independent captures');
  assert.deepEqual(report.screenshots.map(shot => shot.file).sort(), expectedShots.sort());
  for (const [file, expected] of Object.entries(report.inputs)) {
    assert.equal(sha(await readFile(path.join(root, file))), expected, `stale render input: ${file}`);
  }
  assert.equal(report.screenshots.length, 42);
  for (const shot of report.screenshots) {
    assert.ok(['before', 'after'].includes(shot.variant));
    assert.ok(cases.some(item => item.id === shot.caseId));
    assert.equal(shot.selector, `#${shot.caseId} [data-variant="${shot.variant}"]`);
    assert.equal(shot.viewportWidth, shot.file.includes('-mobile-') ? 390 : 900);
    assertCaptureBounds(shot);
    assert.ok(shot.width < (shot.viewportWidth === 900 ? 450 : 390), 'capture must be one component, not a combined pair');
    const bytes = await readFile(path.join(root, shot.file));
    assert.deepEqual([...bytes.subarray(0, 8)], [137,80,78,71,13,10,26,10]);
    assert.equal(bytes.readUInt32BE(16), shot.width, `screenshot width: ${shot.file}`);
    assert.equal(bytes.readUInt32BE(20), shot.height, `screenshot height: ${shot.file}`);
    assert.equal(sha(bytes), shot.sha256, `screenshot drift: ${shot.file}`);
  }
  for (const item of cases) {
    const before = report.screenshots.find(shot => shot.file === `assets/${item.id}-before.png`);
    const after = report.screenshots.find(shot => shot.file === `assets/${item.id}-after.png`);
    assert.equal(before.width, after.width, `${item.id}: same component width`);
    // Equal and greater heights are valid editorial outcomes; check each image's
    // actual measured component bounds instead of imposing a reduction metric.
  }
  assert.equal(report.checks.length, 103, '14 teaching-page and six component-preview checks at five widths, plus three keyboard checks');
  assert.equal(report.checks.filter(check => check.name.includes('preview:')).length, 30);
  assert.ok(report.checks.every(check => check.passed), 'browser checks contain failures');
});
