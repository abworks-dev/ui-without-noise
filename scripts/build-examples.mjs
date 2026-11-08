import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export function renderExamples(cases) {
  const sections = cases.map((item, index) => {
    const variants = [
      ['before', '精简前 · 重复解释', item.before],
      ...(item.overtrimmed ? [['overtrimmed', '删得过头 · 反例', item.overtrimmed]] : []),
      ['after', '适度精简 · 保留必要信息', item.after],
    ];
    return `
<section class="comparison" id="${escape(item.id)}" aria-labelledby="title-${escape(item.id)}">
  <header class="case-heading"><span class="case-number">${String(index + 1).padStart(2, '0')}</span><h2 id="title-${escape(item.id)}">${escape(item.title)}</h2></header>
${item.context ? `  <p class="context">场景：${escape(item.context)}</p>` : ''}
  <div class="pair${item.overtrimmed ? ' triple' : ''}">
${variants.map(([key, title, html]) => `    <article class="variant" data-variant="${key}" aria-label="${escape(title)}"><p class="variant-title">${escape(title)}</p><div class="screen">${html}</div></article>`).join('\n')}
  </div>
  <p class="change">${escape(item.change)}</p>
</section>`;
  }).join('\n');
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; img-src 'self'; form-action 'none'; base-uri 'none'">
  <title>UI without noise · 最少但充分的信息</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
<main>
  <header class="page-header">
    <h1>删冗余，不删理解。</h1>
    <p>${cases.length} 组合成界面，按受众与场景保留最少但充分的信息。三方对照的中间列是过删反例，不是推荐方案。</p>
    <p>这是人工编写的静态教学示例，不是 agent 运行效果测评。按钮不连接业务，输入仅留在当前页面。</p>
    <nav aria-label="对照场景">${cases.map((item, index) => `<a href="#${escape(item.id)}">${index + 1}. ${escape(item.title.split('：')[0])}</a>`).join('')}</nav>
  </header>
${sections}
  <footer>示例不包含真实用户数据、联网资源、存储、遥测或业务请求。浏览器渲染结果不等于技能效果或用户理解已获验证。</footer>
</main>
</body>
</html>
`;
}

// README captures use the same unmodified before/after component markup, without
// the teaching page's headings, context, variant labels or counterexample column.
export function renderPreviews(cases) {
  const sections = cases.map(item => `<section class="component-comparison pair" id="${escape(item.id)}" aria-label="${escape(item.title)}">
${['before', 'after'].map(side => `  <article class="screen" data-variant="${side}" aria-label="${side === 'before' ? '改进前' : '改进后'}">${item[side]}</article>`).join('\n')}
</section>`).join('\n');
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; img-src 'self'; form-action 'none'; base-uri 'none'">
  <title>UI without noise · 组件前后对照</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
<main aria-label="组件前后对照">
${sections}
</main>
</body>
</html>
`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const cases = JSON.parse(await readFile(path.join(root, 'examples/cases.json'), 'utf8'));
  for (const [file, output] of [
    ['examples/index.html', renderExamples(cases)],
    ['examples/previews.html', renderPreviews(cases)],
  ]) {
    if (process.argv.includes('--check')) {
      const current = await readFile(path.join(root, file), 'utf8');
      if (current !== output) {
        console.error(`${file} is stale; run node scripts/build-examples.mjs`);
        process.exitCode = 1;
      } else console.log(`${file} is current.`);
    } else {
      await writeFile(path.join(root, file), output, 'utf8');
      console.log(`Built ${file} from ${cases.length} cases.`);
    }
  }
}
