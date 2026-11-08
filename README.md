# ui-without-noise

**删掉界面已经说清楚的内容，保留用户理解和行动仍然需要的内容。**

一个减少 AI 生成界面中冗余文案与提示组件的 agent skill。目标是**最少但充分的信息，而不是最少的文字**。不自动给每个标题添加副标题、说明卡和同义 badge，也不把有用的首次引导、安全约束或恢复路径一刀切掉。

不换设计系统，不删功能，不把废话藏成小灰字。不要求每个空态都有说明、插画和按钮。

## 对照预览

**每组依次为调整前、建议方案，两张图片独立展示。**各自按组件内容取景，不拼接、不补齐高度；按可用宽度自然排列或换行。十三组对照使用相同样式、业务对象和动作：九组减少冗余，另有保持原样、补充说明、复杂引导与保留合理重复。建议方案不一定更短或更矮。

以下为人工编写、浏览器实际渲染的合成示例，不是运行 skill 得到的模型 A/B 实验，也不是用户理解测试。

### 1. 首次空态：少重复，不少概念引导

首次使用者可能需要知道工作区与项目的关系，但不需要重复解释怎么点击按钮。

![改进前：工作区空态包含重复介绍和按钮说明](<assets/empty-state-before.png>)
![改进后：保留工作区与项目的归属关系](<assets/empty-state-after.png>)

### 2. 筛选无结果：说明条件，不误报整个集合为空

“没有匹配”不等于“没有项目”。保留搜索条件与真实恢复入口，不引导用户创建重复内容。

![改进前：筛选结果重复介绍搜索功能和按钮](<assets/filtered-results-before.png>)
![改进后：保留关键词、恢复提示和清除筛选](<assets/filtered-results-after.png>)

### 3. 收藏空态：保留尚未学会的操作路径

“浏览项目”说明去哪里；一句具体的引导补上如何让项目出现在收藏中。

![改进前：收藏空态堆叠功能介绍和按钮说明](<assets/favorites-before.png>)
![改进后：保留在项目列表选择收藏的学习线索](<assets/favorites-after.png>)

### 4. 暂时无事：状态说清楚就够，不硬加引导

读取已完成、功能已配置且没有新通知时，一条明确状态可以足够，不必凑齐说明、插图和 CTA。

![改进前：通知空态重复介绍功能和无新通知状态](<assets/quiet-notifications-before.png>)
![改进后：只保留清楚的无新通知状态](<assets/quiet-notifications-after.png>)

### 5. 列表：标题与操作已经说明用途

![改进前：项目列表包含重复标题说明和同义标记](<assets/section-heading-before.png>)
![改进后：保留工作区范围、项目名称、笔记数量与操作](<assets/section-heading-after.png>)

### 6. 表单：删显而易见的指导，留真实约束

![改进前：表单解释输入框和提交按钮的显而易见用法](<assets/form-before.png>)
![改进后：保留可见标签、必填、40字符限制和名称冲突错误](<assets/form-after.png>)

### 7. 权限：准确说一次，而不是反复免责声明

![改进前：权限页面反复解释只读限制](<assets/permission-before.png>)
![改进后：保留可见只读原因、联系管理员的路径与禁用操作](<assets/permission-after.png>)

### 8. 结果未知：减少重复，不伪造成功

![改进前：保存状态堆叠同义警告和安全套话](<assets/unknown-result-before.png>)
![改进后：保留结果未知、不要重复保存和查询结果操作](<assets/unknown-result-after.png>)

### 9. 危险操作：少废话，不少后果

![改进前：删除确认包含功能自述和重复提醒](<assets/destructive-action-before.png>)
![改进后：完整保留对象、12条笔记、永久删除和不可恢复](<assets/destructive-action-after.png>)

### 10. 保持原样：已经充分，就不为改而改

这不是少做了一步：在已配置、已读完且无待办的场景中，原有状态足够清楚。两侧完全相同。

![原状：清楚表达暂时没有新通知](<assets/already-sufficient-before.png>)
![建议：保持原样，不增加教程或改写同义词](<assets/already-sufficient-after.png>)

### 11. 补一句说明：更长也可能更好

首次使用者不理解工作区与项目的关系。按钮说明“能做什么”，不能代替这句概念解释。

![原状：只有空状态与创建按钮，缺少概念关系](<assets/add-context-before.png>)
![建议：增加一句工作区与项目的关系说明](<assets/add-context-after.png>)

### 12. 复杂首次任务：需要分步引导

在这个合成产品里，共享视图已有选项目、设可见人、发布前核对范围的流程。建议方案解释这些既有步骤，并未新增功能；短段落和步骤比一句口号更有用。

![原状：共享视图只有选择项目的起步入口](<assets/guided-start-before.png>)
![建议：补充共享视图概念与三个既有步骤](<assets/guided-start-after.png>)

### 13. 合理重复：错误摘要与字段错误各有作用

顶部摘要帮助定位错误，字段旁的同一原因帮助修正。保留两处表达与链接关联，不为避免重复而删除一处或换同义词。两侧呈现相同，仅示例 ID 不同。

![原状：错误摘要链接到带局部错误的项目名称字段](<assets/purposeful-repetition-before.png>)
![建议：保留摘要、字段错误与键盘定位路径](<assets/purposeful-repetition-after.png>)

窄屏独立图片：首次空态[改进前](<assets/empty-state-mobile-before.png>)／[改进后](<assets/empty-state-mobile-after.png>)，筛选无结果[改进前](<assets/filtered-results-mobile-before.png>)／[改进后](<assets/filtered-results-mobile-after.png>)，收藏[改进前](<assets/favorites-mobile-before.png>)／[改进后](<assets/favorites-mobile-after.png>)，通知[改进前](<assets/quiet-notifications-mobile-before.png>)／[改进后](<assets/quiet-notifications-mobile-after.png>)。新增示例的窄屏图片：保持原样[原状](<assets/already-sufficient-mobile-before.png>)／[建议](<assets/already-sufficient-mobile-after.png>)，补充说明[原状](<assets/add-context-mobile-before.png>)／[建议](<assets/add-context-mobile-after.png>)，复杂引导[原状](<assets/guided-start-mobile-before.png>)／[建议](<assets/guided-start-mobile-after.png>)，合理重复[原状](<assets/purposeful-repetition-mobile-before.png>)／[建议](<assets/purposeful-repetition-mobile-after.png>)。图片来源见[纯组件预览页](<examples/previews.html>)；带场景说明和过删反例的内容保留在[教学示例页](<examples/index.html>)，来源哈希与浏览器检查见[渲染记录](<examples/render-report.json>)。

## 使用

入口是 [SKILL.md](<skills/ui-without-noise/SKILL.md>)：没有运行时脚本、依赖、hook、远程服务或自动安装动作。完整复制技能目录，并保留[许可](<skills/ui-without-noise/LICENSE>)。

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

刷新技能发现或开启新会话，确认能看到并加载 `ui-without-noise`。**文件存在不等于宿主已发现，已发现也不等于 agent 已遵守。**这些是目录说明，不是所有宿主版本的兼容性认证。

### 提示 agent

```text
使用 ui-without-noise。先确认受众、任务与状态原因，删掉界面已经说清楚的内容。
保留理解概念、判断状态和开始行动仍然需要的说明，以及标签、约束、权限和危险后果。
只处理冗余信息和相应布局，不改变功能、协议或请求行为；报告主要取舍及未验证项。
```

### 防止下一次又加回来，也防止越删越空

在项目**现有** UI 文案规则中合并下面两句，不另建第二套规范：

> 不默认生成重复解释；只在补充必要的理解、决策、操作、状态或风险信息时添加辅助内容。交付前审查重复文字与空壳，同时确认目标用户仍能理解概念、判断当前状态并找到真实下一步，不以字数下降作为质量结论。

详细判断和例子按需加载技能。它是模型指导，**不是语义 lint 或自动拦截器**。

## 取舍边界

- 先区分首次使用、筛选无匹配、暂时无事、未配置、加载中、权限不足与错误；不要统称“没有内容”。
- 工作区标题、空态状态和创建动作可以使用同一个词；重复词汇不等于重复含义。
- 一句有用的概念说明可以保留，外面的说明卡则未必需要。
- “请输入项目名称”通常多余；“最多 40 个字符”可能是必要约束。
- “未接入”“未读取”“保存结果未知”不能变成空、成功或可用；危险对象、范围和后果不能删。
- 熟悉用户可能不需要首次引导；清楚的无新通知状态可能无需任何辅助说明或按钮。
- 不为了消灭留白硬加插画、文字或动作，也不规定所有空态都必须压缩。按容器与稳定布局的需要重新构图。

## 示例与验证

直接打开[静态示例页](<examples/index.html>)，无需服务器或依赖。所有按钮只展示外观，不执行保存、创建或删除；输入仅留在当前文档，没有持久化。教学说明、反例和产品界面分开呈现。

开发工具使用 Node.js 22+ 内置模块；**使用技能不需要 Node.js**。

```sh
node scripts/build-examples.mjs
node --test tests/repository.test.mjs
```

截图使用已安装的 Ego Lite 浏览器。先读取该浏览器当前指南，再替换仓库绝对路径执行：

```sh
ego-browser nodejs -e "await import('file:///C:/path/to/ui-without-noise/scripts/capture.mjs')"
```

截图脚本只打开本仓库静态文件，写入[图片目录](<assets/>)和[渲染记录](<examples/render-report.json>)，不启动常驻服务。实际图片仍须人工检查。

测试验证技能结构、链接、声明的事实与学习线索、输入关联及渲染产物一致性。截图按实测 DOM 边界核对，允许建议方案等高或更高，**不把字数或高度下降当成设计质量指标**。浏览器检查多种宽度的局部条件；[CI](<.github/workflows/check.yml>)只运行静态检查。当前修改未推送时不代表云端已验证；这些检查也不构成模型效果测试、用户理解测试或完整 WCAG 审计。参见[贡献说明](<CONTRIBUTING.md>)。

## 来源与区别

技能与示例独立编写，未复制第三方技能正文、源码、截图或资产。以下参考取其原则，不把某一设计系统的组件要求当成通用硬规定：

- [stop-describing-ui](https://github.com/artouc/stop-describing-ui)：问题启发；本项目额外保护学习、未知、权限和危险操作信息，不强制图标行。
- [Automattic Agent UX Copy Instructions](https://system.automattic.design/ai/how-to-write-effective-content-with-ai-assistance/agent-ux-copy-instructions/)：不复述与有信息增量的文案。
- [NN/g：Empty State Interface Design](https://www.nngroup.com/articles/empty-state-interface-design/)：状态、学习线索与任务入口。
- [Primer：Blankslate](https://primer.style/product/components/blankslate/guidelines/)：简短不重复的可选说明与首次引导。
- [Carbon：Empty states](https://www.carbondesignsystem.com/building-blocks/core/patterns/empty-states)：区分首次使用与无需动作的状态，少而具体。
- [Shopify：Empty state](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state)：空态原因与下一步，按场景决定内容。

## License

[MIT](<LICENSE>)。技能、示例源码和本仓库生成的示例图片均按此许可提供。
