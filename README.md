# ui-without-noise

**让界面表达自己，不再给每个标题、按钮和卡片配一段解释。**

一个专门减少 AI 生成界面中冗余文案与提示组件的 agent skill。默认不生成副标题、功能介绍、说明卡、同义 badge 和泛化免责声明；必要的标签、约束、状态和风险照常保留。

不换设计系统，不删功能，不把废话藏成小灰字。

## 前后对照

以下是**人工编写、浏览器实际渲染的合成示例**，不是运行 skill 得到的模型对照实验，也不代表任何真实产品或业务已接通。左右共用样式、对象和操作；右侧精简重复解释及其空壳，保留必要事实，不增加业务能力。完整内容与复现方式见[示例页](<examples/index.html>)和[渲染记录](<examples/render-report.json>)。

### 1. 空态：给下一步，不再介绍功能

![空态前后对照：保留工作区标题、真实空态和创建操作，移除重复介绍与说明卡](<assets/empty-state.png>)

### 2. 列表：标题与操作已经说明用途

![项目前后对照：项目对象、笔记数量和打开操作不变，删除重复副标题、说明框和项目标签](<assets/section-heading.png>)

### 3. 表单：删显而易见的指导，留真实约束

![表单前后对照：保留可见标签、必填、40字符限制和名称冲突错误](<assets/form.png>)

### 4. 权限：准确说一次，而不是反复免责声明

![权限前后对照：合并重复警告，保留可见只读原因、联系管理员的下一步和禁用操作](<assets/permission.png>)

### 5. 结果未知：减少重复，不伪造成功

![保存状态前后对照：保留结果未知、不要重复保存和查询结果操作](<assets/unknown-result.png>)

### 6. 危险操作：少废话，不少后果

![删除确认前后对照：永久删除、旅行计划对象、12条笔记和无法恢复的后果完整保留](<assets/destructive-action.png>)

[窄屏渲染示例：390px](<assets/empty-state-mobile.png>)。示例不是通过裁剪、降低透明度或折叠文字变简洁。

## 使用

技能入口是 [SKILL.md](<skills/ui-without-noise/SKILL.md>)：没有运行时脚本、依赖、hook、远程服务或自动安装动作。完整复制技能目录，并随包保留[许可](<skills/ui-without-noise/LICENSE>)。

### 项目级手动添加

从本地仓库复制 `skills/ui-without-noise/` 到目标工具支持的项目技能目录，只选择当前工具的一处：

| 工具 / 约定 | 目标位置 |
| --- | --- |
| DeepSeek Harness | `.dsh/skills/ui-without-noise/` |
| Claude Code | `.claude/skills/ui-without-noise/` |
| 支持通用 Agent Skills 项目目录的工具 | `.agents/skills/ui-without-noise/`，以该工具文档为准 |

例如在**目标项目根目录**用 PowerShell 添加到 DSH（替换第一行路径）：

```powershell
$source = 'C:\path\to\ui-without-noise\skills\ui-without-noise'
$destination = Join-Path (Get-Location) '.dsh\skills\ui-without-noise'
if (!(Test-Path -LiteralPath $source -PathType Container)) { throw 'Source not found' }
if (Test-Path -LiteralPath $destination) { throw 'Destination already exists; review before replacing' }
New-Item -ItemType Directory -Force -Path (Split-Path $destination) | Out-Null
Copy-Item -LiteralPath $source -Destination $destination -Recurse
```

刷新技能发现或开启新会话，确认能看到并加载 `ui-without-noise`。**文件存在不等于宿主已发现，宿主已发现也不等于 agent 已遵守。**这些是目录使用说明，不是所有宿主版本的兼容性认证。手动复制不需要运行第三方安装器。

### 提示 agent

生成页面前：

```text
使用 ui-without-noise。先用标题、控件与布局表达用途，辅助说明默认不生成。
保留必要字段标签、约束、权限、失败、结果未知和危险后果，不改变功能或协议。
```

已有页面精简：

```text
使用 ui-without-noise，审查当前页面的辅助文案与提示容器。
只处理重复解释和无信息增量的装饰，不做整体视觉重设计。
报告主要的删／并／改，以及特意保留的必要信息；未运行的验证如实说明。
```

### 防止下一次又加回来

在目标项目**现有**规则的 UI 文案章节合并下面两句，不另建第二套规范，也不复制整篇技能：

> 辅助说明默认不生成；只有新增必要的决策、操作、状态或风险信息时才添加。UI 交付前做一次减法审查，删除重复文字及空壳，但不得删除必要标签、约束、状态与危险后果。

详细判断和例子按需加载技能。它是模型指导，**不是语义 lint 或自动拦截器**；不保证一次加载就永不复发。

## 为什么不是“把字都删掉”

- “请输入项目名称”通常多余；“最多 40 个字符”可能是必要约束。
- 三处同义的只读警告可以合并；只读事实与下一步不能隐去。
- “功能未接入”“资源未读取”“保存结果未知”不是装饰文案，不能改成空、成功或可用。
- 删除空壳卡片不等于删除其中的动作。必要的局部错误、确认和可访问关联仍保留。
- 英文词数、字体种数、每行图标和任意组件数量上限不是通用标准。

## 示例与验证

直接打开[静态示例页](<examples/index.html>)即可查看全部对照，无需服务器或安装依赖。按钮只是外观示例，不执行保存、创建或删除；输入仅留在当前文档，没有持久化。示例没有真实用户数据或外部资源。

开发工具使用 Node.js 22+ 内置模块；**使用技能不需要 Node.js**。

```sh
node scripts/build-examples.mjs
node --test tests/repository.test.mjs
```

截图生成使用已安装的 Ego Lite 浏览器。读过该浏览器当前使用指南后，替换下面的仓库绝对路径再执行：

```sh
ego-browser nodejs -e "await import('file:///C:/path/to/ui-without-noise/scripts/capture.mjs')"
```

如果宿主不接受这一命令的引号或工作目录，使用浏览器指南中的绝对 `file:///.../scripts/capture.mjs` 导入方式。截图脚本只打开本仓库静态文件，写入[图片目录](<assets/>)与[渲染记录](<examples/render-report.json>)。关闭任务空间后不会启动常驻服务。

本地测试验证技能文件结构、链接、示例保护项、输入关联和渲染产物的一致性；浏览器检查窄屏溢出及关联名称等局部条件。[CI](<.github/workflows/check.yml>)配置在 push／PR 时运行静态检查，不联网运行浏览器；配置存在不代表云端已经执行。**这些不验证模型是否会稳定执行技能，也不构成完整 WCAG 审计。**参见[贡献说明](<CONTRIBUTING.md>)。

## 来源与区别

本项目根据常见 UI 冗余问题独立编写技能与示例，未复制第三方技能正文、源码、截图或资产。方法参考：

- [stop-describing-ui](https://github.com/artouc/stop-describing-ui)：最直接的问题启发；本项目额外保护未知、未接入、权限与危险操作信息，不要求把每段文字改成图标行。
- [Automattic Agent UX Copy Instructions](https://system.automattic.design/ai/how-to-write-effective-content-with-ai-assistance/agent-ux-copy-instructions/)：不复述与有信息增量的文案。
- [Microsoft：Eliminate redundancy](https://learn.microsoft.com/en-us/windows/win32/uxguide/text-ui#eliminate-redundancy)：参考去冗余原则，不采用其旧 Windows 视觉规格。

## License

[MIT](<LICENSE>)。技能、示例源码和本仓库生成的示例图片均按此许可提供。
