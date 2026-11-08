---
name: ui-without-noise
description: Prevent and remove redundant UI copy and explanatory components. Use when creating or reviewing screens, forms, empty states, subtitles, helper text, banners, badges, or cards that repeat what the interface already communicates. Keep necessary labels, constraints, risks, permissions, and unknown states. Not a general visual redesign.
license: MIT
metadata:
  version: "0.1.0"
---

# UI without noise

Build an interface people can use, not a narration of the interface.
Default to the control, its name, the relevant object, and the necessary state. Add supporting copy only when it changes a user's understanding, decision, next action, or risk assessment.

## While generating

1. **Start without explanatory furniture.** Do not automatically add a subtitle, intro paragraph, help card, banner, eyebrow, badge, or icon to every section. Add one only for a concrete user need, not to fill space or make the page look finished.
2. **Let the interface do the explaining.** Prefer specific labels, familiar action verbs, grouping, and placement. “Create workspace” needs no “Click below to create a workspace.” If a label is unclear, fix the label before adding a paragraph.
3. **Do not narrate implementation.** Architecture, component choices, generic trust disclaimers, and developer progress reports are not default product copy. Preserve technical facts when they affect privacy, scope, recovery, or the user's next decision.
4. **Say each fact where it is useful.** A heading, badge, sentence, and banner should not repeat the same fact in the same scope. Preserve purposeful repetition such as an error summary linked to a field, or a warning next to a distinct consequential action. Do not merge states across objects, requests, or workspaces.
5. **Remove the empty wrapper too.** When redundant copy is removed, remove its now-useless card, alert, icon, divider, or reserved space. Do not replace a paragraph with a decorative badge or a row of icons. Do not conceal unnecessary copy in a tooltip, disclosure, tiny type, or low contrast.
6. **Keep the information needed to act safely.** Keep associated, normally visible field labels; actual format/length/required constraints; actionable errors; meaningful loading, unsaved, unavailable, permission and unknown states; and the scope and consequences of dangerous actions. Unknown is not empty, success, or failure. Never imply an unavailable capability works.
7. **Make necessary information readable.** Important state and disabled-action reasons must be visible near their scope, not screen-reader-only or hover-only. Keep accessible names, descriptions, live-region urgency, keyboard access, and narrow-screen readability. Concision never overrides accessibility.
8. **Do not create a smaller product by accident.** Preserve features, data, actions, confirmations, authorization, and request/retry behavior. Do not delete an unclear business or safety requirement: flag the specific ambiguity for the owner instead.

## Before handing off a changed screen

Review the rendered screen when available, not just isolated strings.
For each supporting string and its container, choose one outcome:

- **Keep:** it adds a necessary fact, distinction, constraint, consequence, or next step.
- **Rewrite:** the fact is needed, but its wording is vague, repeated, or longer than necessary.
- **Merge:** it repeats the same fact in the same scope; retain the useful placement and associations.
- **Delete:** the interface already communicates it and no necessary meaning is lost; remove the vacant wrapper.
- **Move:** only genuinely low-frequency help belongs behind an explicit, accessible help entry. Do not bury common actions or important state.

Check the changed scope in normal, empty, error, unavailable, and unknown states where applicable. Include destructive confirmation if affected, keyboard navigation, and a narrow viewport. Do not claim browser or accessibility verification that did not run.
Report significant changes briefly as `before → after — reason`; include a necessary fact deliberately retained. Do not write a new explanatory essay into the product or invent a scoring system to prove it is concise.

## Examples

| Before | After / decision |
| --- | --- |
| 工作区 · 在这里管理和组织你的工作区 | 工作区 — delete the repeated description. |
| 点击下方按钮创建一个新项目 / 创建项目 | 创建项目 — keep the actual action. |
| 项目名称 / 请在此输入你的项目名称 | 项目名称 — keep the label; remove the obvious instruction. |
| 文件 / 仅支持 CSV，最大 20 MB | Keep both — the second line is a real constraint. |
| 已保存 + 保存成功 + 你的更改已经保存 | One appropriately scoped acknowledgement if needed; no synonym stacking. |
| 保存结果未知。请先查询本次结果，不要重复保存。 | Keep — uncertainty and the safe next step matter. |
| 将永久删除「旅行计划」及其中 12 条笔记，无法恢复。 | Keep the object, scope, count and consequence. |

## Boundaries

This skill is model guidance, not a linter, automatic hook, or proof of compliance. Follow the project's existing terminology, product and safety contracts. Do not introduce a competing specification or install dependencies, contact external services, or change global configuration to use this skill.
The examples are language-sensitive: preserve consistent terminology; do not force English word counts, literary synonym variation, universal font counts, or an icon on every line.
