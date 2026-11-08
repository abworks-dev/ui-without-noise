---
name: ui-without-noise
description: Prevent and remove redundant UI copy without removing useful guidance. Use when creating or reviewing screens, forms, empty states, subtitles, helper text, banners, badges, or cards. Aim for the least information sufficient to understand and act, not the fewest words. Preserve learning cues, labels, constraints, risks, permissions, and unknown states. Not a general visual redesign.
license: MIT
metadata:
  version: "0.2.0"
---

# UI without noise

Build an interface people can understand and use, not a narration of the interface.
Remove information the interface already communicates. Keep or add the context a target user still needs to understand the concept, interpret the state, choose an action, or assess its consequences. Fewer words are not the goal by themselves.

## While generating

1. **Start with a user need, not explanatory furniture.** Do not automatically add a subtitle, intro, help card, banner, eyebrow, badge, or icon to every section. Do not automatically forbid them either. Each should address a concrete comprehension or task need, not fill space.
2. **Let the interface explain what it can.** Prefer specific labels, familiar verbs, grouping, and placement. “Create workspace” needs no “Click below to create a workspace.” But the button does not explain what a workspace contains: retain a brief conceptual explanation when the audience needs it. Repeated words can serve different roles; remove repeated meaning, not vocabulary mechanically.
3. **Do not narrate implementation.** Architecture, component choices, generic trust disclaimers, and developer progress are not default product copy. Preserve technical facts when they affect privacy, scope, recovery, or the user's decision.
4. **Say each fact where it is useful.** Avoid repeating the same fact in a heading, badge, paragraph, and banner in the same scope. Preserve purposeful repetition such as a linked error summary and field error, or a warning at a distinct consequential action. Do not merge states across objects, requests, or workspaces.
5. **Reduce visual weight, then recompose.** A useful sentence may belong beside the task, not inside a separate notice card. Remove redundant wrappers and reassess spacing and grouping. Do not fill leftover space with copy or decoration, or force all empty states into one height. Stable data regions and full-page onboarding may legitimately need space. Icons and illustrations are optional when useful, not categorically required or forbidden.
6. **Keep both learning and safety information.** Preserve necessary first-use explanations, non-obvious relationships, recovery paths, visible field labels, real constraints, actionable errors, loading, unsaved, unavailable, permission and unknown states, and dangerous-action scope and consequences. Unknown is not empty, success, or failure. Never imply an unavailable capability works.
7. **Keep necessary information readable.** Important guidance and disabled-action reasons must be visible near their scope, not screen-reader-only or hover-only. Retain accessible names, descriptions, appropriate live-region urgency, keyboard access, and narrow-screen readability. Do not hide useful copy in tiny type, low contrast, or an undiscoverable disclosure.
8. **Do not make a smaller product by accident.** Preserve features, data, actions, confirmations, authorization, and request/retry behavior. Do not invent import, setup, undo, collaboration, or other capabilities to make an empty state look helpful. Flag unclear product or safety requirements for the owner.

## Empty states: determine the reason first

- **First use / unfamiliar feature:** explain what will appear or a non-obvious concept when needed, then provide a real starting path. A short sentence can be essential even beside a clearly named button.
- **Search / filter mismatch:** identify the relevant condition and show how to adjust it. Do not imply the entire collection is empty or suggest creating duplicates by default.
- **Temporarily nothing to do / completed:** a clear status may be enough; do not invent an action or a tutorial.
- **Loading / error / permission / not configured:** preserve the actual state and the available recovery or setup path. Do not mislabel it as an empty collection.

Match the amount of guidance and the composition to the audience and container. Do not require every state to have an illustration, description, documentation link, or CTA. Optional presentation does not make necessary meaning optional.

## Before handing off a changed screen

Review the rendered screen when available. Ask: who is this for; what must they understand; what is already evident nearby; what would become unclear if this content disappeared?
For each supporting string and its container, choose:

- **Keep:** it adds a useful concept, learning cue, fact, distinction, constraint, consequence, or next step.
- **Rewrite:** the information is needed but vague, repetitive, or longer than necessary.
- **Merge:** the same fact is repeated in the same scope; retain the useful placement and associations.
- **Delete:** the interface already communicates it and no necessary meaning is lost; remove the vacant wrapper.
- **Move:** only low-frequency help belongs behind a discoverable, accessible entry. Do not bury first-step comprehension, common actions, or important state.

Check applicable normal, empty, error, unavailable and unknown states; destructive confirmation if affected; keyboard access and a narrow viewport. Report `before → after — reason` and a useful fact deliberately retained. Do not equate lower word count or passing fixture tests with better comprehension. Unrun browser, accessibility, user or model evaluations remain unverified.

## Examples

| Content | Decision |
| --- | --- |
| 工作区 / 在这里管理你的工作区 | Delete the repeated purpose statement. |
| 还没有工作区 / 把相关项目放在同一个工作区中。 / 创建工作区 | Keep the relationship explanation for first-time users; familiar users may not need it. |
| 点击下方按钮创建一个新项目 / 创建项目 | Keep the actual action; delete the clicking instruction. |
| 项目名称 / 请在此输入你的项目名称 | Keep the visible label, remove the obvious instruction. |
| 文件 / 仅支持 CSV，最大 20 MB | Keep both: the second line is a real constraint. |
| 没有匹配“设计”的项目 / 清除筛选 | Preserve query scope and the real recovery action. |
| 暂时没有新通知 | Can be sufficient when loading is complete and no action is needed. |
| 保存结果未知。先查询本次结果，不要重复保存。 | Keep uncertainty and the safe next step. |
| 将永久删除「旅行计划」及其中 12 条笔记，无法恢复。 | Keep object, scope, count and consequence. |

## Boundaries

This is model guidance, not a linter, automatic hook, or proof of compliance. Follow existing product, terminology, safety and accessibility contracts. Do not introduce a competing specification, install dependencies, contact external services, or change global configuration to use this skill.
Do not force English word counts, literary synonyms, universal font counts, arbitrary component quotas, or an icon on every line. Judge usefulness in context, not brevity alone.
