// Run inside `ego-browser nodejs`, not plain Node. No server or dependency install.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const cases = JSON.parse(await readFile(path.join(root, 'examples/cases.json'), 'utf8'));
const task = await taskSpace(globalThis.uiWithoutNoiseTaskSpaceId ?? `ui-without-noise-comparisons-${Date.now()}`);
console.log(JSON.stringify({ taskSpaceId: task.spaceId, page: 'p1' }));
const page = task.page('p1');
const report = {
  evidence: 'browser-rendered synthetic editorial examples; not an agent benchmark',
  captureMethod: 'CDP Page.captureScreenshot, CSS document coordinates, captureBeyondViewport',
  screenshotSource: 'examples/previews.html; before/after components only; no teaching chrome',
  generatedAt: new Date().toISOString(),
  browser: { engine: 'Chromium', userAgent: await page.evaluate(() => navigator.userAgent) },
  viewports: [1440, 1024, 390, 320],
  inputs: {}, screenshots: [], checks: [],
};
for (const file of ['examples/cases.json', 'examples/styles.css', 'examples/index.html', 'examples/previews.html', 'scripts/build-examples.mjs', 'scripts/capture.mjs']) {
  report.inputs[file] = sha(await readFile(path.join(root, file)));
}
await mkdir(path.join(root, 'assets'), { recursive: true });
await page.cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await page.goto(pathToFileURL(path.join(root, 'examples/index.html')).href);
await page.evaluate(async () => { await document.fonts.ready; });

async function inspect(width) {
  await page.cdp('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
  const checks = await page.evaluate(({ width, cases }) => {
    const checks = [];
    const check = (name, passed, detail) => checks.push({ name: `${width}px: ${name}`, passed, detail });
    check('no document horizontal overflow', document.documentElement.scrollWidth <= width, { scrollWidth: document.documentElement.scrollWidth, width });
    const nodes = [...document.querySelectorAll('.comparison, .variant, .screen')];
    const overflowing = nodes.filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.id || node.className);
    check('all comparison containers fit', overflowing.length === 0, overflowing);
    const names = [...document.querySelectorAll('button')].every(node => !!node.textContent.trim());
    check('all displayed buttons have text names', names, document.querySelectorAll('button').length);
    const inputs = [...document.querySelectorAll('input')];
    check('inputs retain labels and actual constraints', inputs.every(node => node.labels.length === 1 && node.required && node.maxLength === 40 && node.getAttribute('aria-invalid') === 'true'), inputs.length);
    const associations = [...document.querySelectorAll('[aria-describedby]')].every(node => node.getAttribute('aria-describedby').split(/\s+/).every(id => document.getElementById(id)?.textContent.trim()));
    check('description associations resolve', associations, null);
    const reasons = [...document.querySelectorAll('button[disabled]')].map(node => document.getElementById(node.getAttribute('aria-describedby')));
    check('disabled reasons remain visible and readable', reasons.every(node => { const style = getComputedStyle(node); return node.getBoundingClientRect().height > 0 && style.visibility === 'visible' && Number(style.opacity) > 0 && parseFloat(style.fontSize) >= 13; }), reasons.length);
    const missing = [];
    for (const item of cases) for (const side of ['before', 'after']) {
      const node = document.querySelector(`#${item.id} [data-variant="${side}"] .screen`);
      for (const fact of item.protected) if (!node.innerText.includes(fact)) missing.push(`${item.id}/${side}: ${fact}`);
    }
    check('necessary facts visible in both recommended variants', missing.length === 0, missing);
    const lostLearning = cases.flatMap(item => (item.learning ?? []).filter(fact => !document.querySelector(`#${item.id} [data-variant="after"] .screen`).innerText.includes(fact)).map(fact => `${item.id}: ${fact}`));
    check('useful learning cues visible in recommended variants', lostLearning.length === 0, lostLearning);
    const counterexamples = [...document.querySelectorAll('[data-variant="overtrimmed"]')];
    check('overtrimmed variants explicitly labeled as counterexamples', counterexamples.length === 4 && counterexamples.every(node => node.getAttribute('aria-label').includes('反例') && node.querySelector('.variant-title').innerText.includes('反例')), counterexamples.length);
    const grid = document.querySelector('.triple');
    const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    check('three-way comparisons stack when space is insufficient', columns === (width >= 1100 ? 3 : 1), { columns });
    const overSmall = [...document.querySelectorAll('[data-variant="after"] .empty p')].filter(node => parseFloat(getComputedStyle(node).fontSize) < 14);
    check('necessary learning copy not reduced to tiny text', overSmall.length === 0, overSmall.length);
    check('same styling, no hidden-copy tricks', getComputedStyle(document.querySelector('.screen')).backgroundColor !== 'rgb(0, 0, 0)' && getComputedStyle(document.querySelector('button.primary')).backgroundColor === 'rgb(36, 90, 70)', null);
    check('demo has no scripts, external resources or persistence handlers', document.scripts.length === 0 && !document.querySelector('[onclick], [onsubmit], [src^="http"], [href^="http"]'), null);
    return checks;
  }, { width, cases });
  report.checks.push(...checks);
}

async function capture(id, file) {
  // The high-level clip path can produce blank/cropped files. Use CDP's explicit
  // document-coordinate clipping with captureBeyondViewport, then inspect output.
  const measure = () => page.evaluate(id => {
    const rect = document.getElementById(id).getBoundingClientRect();
    const x = Math.floor(rect.x + window.scrollX);
    const y = Math.floor(rect.y + window.scrollY);
    return { x, y, width: Math.ceil(rect.right + window.scrollX) - x, height: Math.ceil(rect.bottom + window.scrollY) - y };
  }, id);
  const clip = await measure();
  const shot = await page.cdp('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: true, clip: { ...clip, scale: 1 } });
  const after = await measure();
  if (JSON.stringify(clip) !== JSON.stringify(after)) throw new Error(`Screenshot layout shifted for ${id}: ${JSON.stringify({ clip, after })}`);
  const bytes = Buffer.from(shot.data, 'base64');
  await writeFile(path.join(root, file), bytes);
  report.screenshots.push({ file, viewportWidth: await page.evaluate(() => window.innerWidth), ...clip, bytes: bytes.length, sha256: sha(bytes) });
}

for (const width of report.viewports) await inspect(width);
await page.focus('loc=css:#name-after');
await page.press('loc=css:#name-after', 'Tab');
report.checks.push(await page.evaluate(() => ({ name: '320px: keyboard Tab reaches recommended form action', passed: document.activeElement?.closest('#form [data-variant="after"]') !== null && document.activeElement?.tagName === 'BUTTON' && getComputedStyle(document.activeElement).outlineStyle === 'solid', detail: document.activeElement?.textContent.trim() })));
await page.press('loc=css:#form [data-variant="after"] button', 'Shift+Tab');
report.checks.push(await page.evaluate(() => ({ name: '320px: keyboard Shift+Tab returns to labeled input', passed: document.activeElement?.id === 'name-after', detail: document.activeElement?.id })));
await page.goto(pathToFileURL(path.join(root, 'examples/previews.html')).href);
await page.evaluate(async () => { await document.fonts.ready; });
for (const width of report.viewports) {
  await page.cdp('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
  report.checks.push(...await page.evaluate(({ width, cases }) => {
    const checks = [];
    const check = (name, passed, detail) => checks.push({ name: `${width}px preview: ${name}`, passed, detail });
    const comparisons = [...document.querySelectorAll('.component-comparison')];
    const chrome = document.querySelector('.case-heading, .case-number, .context, .change, .variant-title, [data-variant="overtrimmed"], .page-header');
    check('only before/after components, without teaching chrome', comparisons.length === cases.length && comparisons.every(node => node.children.length === 2 && [...node.children].map(child => child.dataset.variant).join(',') === 'before,after') && !chrome, comparisons.length);
    const missing = [];
    for (const item of cases) for (const side of ['before', 'after']) {
      const node = document.querySelector(`#${item.id} [data-variant="${side}"]`);
      for (const fact of [...item.protected, ...(side === 'after' ? item.learning ?? [] : [])]) if (!node.innerText.includes(fact)) missing.push(`${item.id}/${side}: ${fact}`);
    }
    check('component previews retain necessary facts and learning cues', missing.length === 0, missing);
    const overflow = [...document.querySelectorAll('.component-comparison, .screen')].filter(node => node.scrollWidth > node.clientWidth + 1);
    check('component previews fit without horizontal overflow', document.documentElement.scrollWidth <= width && overflow.length === 0, overflow.map(node => node.id || node.className));
    const expectedColumns = width > 700 ? 2 : 1;
    check('before/after columns follow documented order', comparisons.every(node => getComputedStyle(node).gridTemplateColumns.split(' ').length === expectedColumns), expectedColumns);
    const inputs = [...document.querySelectorAll('input')];
    const descriptions = [...document.querySelectorAll('[aria-describedby]')];
    check('component previews preserve labels, constraints and visible descriptions', inputs.length === 2 && inputs.every(node => node.labels.length === 1 && node.required && node.maxLength === 40 && node.getAttribute('aria-invalid') === 'true') && descriptions.every(node => node.getAttribute('aria-describedby').split(/\s+/).every(id => document.getElementById(id)?.getBoundingClientRect().height > 0)), descriptions.length);
    return checks;
  }, { width, cases }));
  if (width === 1440) for (const item of cases) await capture(item.id, `assets/${item.id}.png`);
  if (width === 390) for (const item of cases.filter(item => item.overtrimmed)) await capture(item.id, `assets/${item.id}-mobile.png`);
}
await writeFile(path.join(root, 'examples/render-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
const failures = report.checks.filter(check => !check.passed);
console.log(JSON.stringify({ checks: report.checks.length, failed: failures, screenshots: report.screenshots.length, browser: report.browser.userAgent }, null, 2));
if (failures.length) throw new Error('Rendered checks failed; inspect report before publishing.');
if (!globalThis.uiWithoutNoiseKeepForReview) {
  await task.finish({ keep: [] });
  console.log('Browser task space finished. No server was started.');
} else console.log(`Task space ${task.spaceId} remains open for image review; explicitly finish it afterwards.`);
