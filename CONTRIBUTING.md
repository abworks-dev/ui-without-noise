# Contributing

Keep this project about redundant UI information, not general visual taste.

- [The skill](<skills/ui-without-noise/SKILL.md>) is the portable behavioral guidance. [The README](<README.md>) explains adoption and evidence; do not grow another competing instruction system.
- Add a generation rule only if it addresses a distinct, recurring failure. Prefer a small example over another synonym of “be concise.”
- Preserve labels, constraints, truthful unavailable/unknown states, accessible associations, and the scope and consequence of destructive actions. Retain deliberate summary/field-error duplication.
- Do not change data, features, network behavior, authorization, or request/retry semantics to improve a screenshot.
- Every new example needs both a removable redundancy and a concrete protected fact or action. [Cases](<examples/cases.json>) are synthetic; do not introduce user data, real credentials, external fonts or remote assets.
- Keep before/after styling identical. Do not make the before deliberately broken, low contrast, or unusable. Show subtraction of information noise, not an unrelated redesign.
- Do not claim a screenshot is an agent trial. Any future model evaluation must record the prompt, model/host/version, whether the skill was actually loaded, inputs, raw outputs, failures, and independent review criteria. Do not use a single curated success or install counts as proof.

## Local checks

Node.js 22+; no dependency install:

```sh
node scripts/build-examples.mjs
node --test tests/repository.test.mjs
```

If examples or styling change, regenerate the browser captures using [the capture script](<scripts/capture.mjs>), inspect the actual images, and keep [the render report](<examples/render-report.json>) current. Screenshot rendering varies with browser, OS, and fonts. A changed image requires review, not automatic acceptance.

The tests are repository/fixture checks, not a language-model benchmark or complete accessibility assessment. Keep that distinction in reports.
