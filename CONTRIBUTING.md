# Contributing

Keep this project about redundant UI information, not general visual taste.

- [The skill](<skills/ui-without-noise/SKILL.md>) is the portable behavioral guidance. [The README](<README.md>) explains adoption and evidence; do not grow another competing instruction system.
- Add a generation rule only if it addresses a distinct, recurring failure. Prefer a small example over another synonym of “be concise.”
- Aim for the least information sufficient for the audience and task, not the fewest words. Preserve first-use concepts, learning cues, recovery paths, labels, constraints, truthful unavailable/unknown states, accessible associations, and destructive-action scope and consequences. Retain deliberate summary/field-error duplication.
- Do not change data, features, network behavior, authorization, or request/retry semantics to improve a screenshot or invent helpful-looking capabilities.
- Every example declares a `decision`: `reduce`, `keep`, `add`, `expand`, or `retain`. Do not manufacture redundancy just to remove it. Protect facts/actions shared by both variants; put necessary new concepts or recovery cues in `learning` for the recommendation, and explain their basis in `context`. First-use examples must identify the audience. [Cases](<examples/cases.json>) are synthetic; do not introduce user data, credentials or remote assets.
- Keep the same styling and action identities in `before` and `after`; recompose spacing instead of stretching short content into vacant cards. Do not make the before broken or low contrast. Optional `overtrimmed` variants are explicitly labeled negative examples, may deliberately omit facts/actions, and are never accepted as recommendations. Do not weaken protection checks for the recommended variant to accommodate a negative example.
- Include reductions, unchanged recommendations, needed additions, complex first-use guidance, and purposeful repetition. A clear no-action state may need no description or CTA. An added explanation may make a component taller; equal or greater height is not a failure. Word count, height reduction, and exact-string assertions cannot establish comprehension quality; review the meaning in context.
- Each README example uses two separate image files, `before` then `after`, cropped directly to each component's own bounds and natural height. Do not stitch them into a combined bitmap or pad the shorter component. README images show only the `before` and `after` components: no teaching frame, scenario heading, variant label, change summary, or negative-example column. Keep explanations in Markdown and counterexamples on the teaching page. Generate [component previews](<examples/previews.html>) from the same unchanged component markup, not manual crops or hidden text.
- Do not claim a screenshot is an agent trial. Any future model evaluation must record the prompt, model/host/version, whether the skill was actually loaded, inputs, raw outputs, failures, and independent review criteria. Do not use a single curated success or install counts as proof.

## Local checks

Node.js 22+; no dependency install:

```sh
node scripts/build-examples.mjs
node --test tests/repository.test.mjs
```

If examples or styling change, regenerate the browser captures using [the capture script](<scripts/capture.mjs>), inspect the actual images, and keep [the render report](<examples/render-report.json>) current. Screenshot rendering varies with browser, OS, and fonts. A changed image requires review, not automatic acceptance.

The tests are repository/fixture checks, not a language-model benchmark or complete accessibility assessment. Keep that distinction in reports.
