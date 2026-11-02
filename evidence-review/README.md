# Evidence review experiment

This private Tessl plugin contains one portable review skill and six fictional
handoff packets. It is a workshop experiment, not an installed global policy or
a scheduled automation. No source from private projects or real accounts is
included.

## Validate locally

From the repository root:

```sh
tessl skill lint ./evidence-review
tessl eval lint ./evidence-review
```

After the integrator links the repository to its existing Tessl project and
checks the credit balance, one explicitly authorized comparison can be submitted:

```sh
tessl eval run ./evidence-review --runs 1 --label evidence-review-pilot --json
```

The default comparison runs six scenarios both without and with the skill:
12 solves plus scoring. It spends Tessl credits. Do not run it merely to lint
files; there is no cost estimate or automatic retry in this package. Record the
run ID and observed before/after balance in the owning task record.

Read each `review.md` and its per-scenario scores. Report missed issues and false
positives separately, including the valid scoped-control packet. One attempt
per case is an initial signal, not a reliability guarantee or activation test.
The default eval forces the skill context, so it measures behavior when loaded.

The skill is in `skills/review-evidence/SKILL.md`. Evaluation rubrics and packet
resources live only in `evals/`; keep those out of skill deployment context.
Scenario folders have neutral identifiers, and each exposes only its own packet
and task. Rubrics must remain scorer-only. Scenarios use supplied records rather
than live GitHub, providers, media or personal state.

Sources for packaging and evaluation behavior:
[Create a skill](https://docs.tessl.io/creating-skills-and-plugins/create-a-skill)
and [Evaluate scenarios](https://docs.tessl.io/improving-your-skills/evaluate-skill-quality-using-scenarios).
