import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export function renderExamples(cases) {
  const sections = cases.map((item, index) => `
<section class="comparison" id="${escape(item.id)}" aria-labelledby="title-${escape(item.id)}">
  <header class="case-heading"><span class="case-number">${String(index + 1).padStart(2, '0')}</span><h2 id="title-${escape(item.id)}">${escape(item.title)}</h2></header>
  <div class="pair">
    <article class="variant" data-variant="before" aria-label="精简前"><p class="variant-title">精简前 · 重复解释</p><div class="screen">${item.before}</div></article>
    <article class="variant" data-variant="after" aria-label="精简后"><p class="variant-title">精简后 · 保留必要信息</p><div class="screen">${item.after}</div></article>
  </div>
  <p class="change">${escape(item.change)}</p>
</section>`).join('\n');
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; img-src 'self'; form-action 'none'; base-uri 'none'">
  <title>UI without noise · 前后对照</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
<main>
  <header class="page-header">
    <h1>少解释一次，让界面说清楚。</h1>
    <p>六组合成界面：同一套样式、同一批对象和操作，只调整冗余文字与不再需要的容器。</p>
    <p>这是人工编写的静态教学示例，不是 agent 运行效果测评。按钮不连接业务，输入仅留在当前页面。</p>
    <nav aria-label="对照场景">${cases.map((item, index) => `<a href="#${escape(item.id)}">${index + 1}. ${escape(item.title.split('：')[0])}</a>`).join('')}</nav>
  </header>
${sections}
  <footer>示例不包含真实用户数据、联网资源、存储、遥测或业务请求。浏览器渲染结果不等于技能效果已获验证。</footer>
</main>
</body>
</html>
`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const cases = JSON.parse(await readFile(path.join(root, 'examples/cases.json'), 'utf8'));
  const output = renderExamples(cases);
  if (process.argv.includes('--check')) {
    const current = await readFile(path.join(root, 'examples/index.html'), 'utf8');
    if (current !== output) {
      console.error('examples/index.html is stale; run node scripts/build-examples.mjs');
      process.exitCode = 1;
    } else console.log('Generated examples are current.');
  } else {
    await writeFile(path.join(root, 'examples/index.html'), output, 'utf8');
    console.log(`Built examples/index.html from ${cases.length} paired cases.`);
  }
}
