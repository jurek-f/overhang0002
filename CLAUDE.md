# Agent instructions

## Two layers — never mix them

Every session in this repo operates on one or both of these layers.
Always be explicit about which layer a change belongs to, and commit them separately.

### Product layer
The app being built in this specific repo.
Files: `app/`, `services/`, `data/`, `environment/`, `scripts/`
Goal: a working, Vercel-deployed, frontend-only educational app.

### Workflow layer
The repeatable process for building future apps of the same kind.
Files: `docs/`, `CLAUDE.md`, `README.md`
Goal: a refined, copy-and-reuse template that improves with each project.

When the user asks to "build a feature" — that is product work.
When the user asks to "improve the process / docs / workflow" — that is workflow work.
When both happen in one session, commit them in separate commits with clear labels.

---

## Project constraints (product layer)

- **Frontend only** — no backend server, no database.
- **Deployed via Vercel** — static files only; anything that can't be bundled doesn't ship.
- **Data pipeline is local** — Python scripts run on the developer's machine and produce JSON files that are committed into `data/app/` and served as static assets.
- **No commercial use** — this is an exploration / education project.
- **Stack**: React, TypeScript, Vite, UnoCSS, React Router, React Query.

---

## Workflow layer conventions

- `docs/workflow_stages.md` is the index of the six stages. The stage files (stage_1 … stage_6) live alongside it in `docs/`. Fill them in order; revisit earlier stages by noting the revision date rather than deleting content.
- Do not create feature subfolders inside `docs/` — this repo is one app.
- When the workflow itself is improved (a stage template updated, a new constraint discovered), update `docs/` and/or this file and commit it as workflow work.

---

## Git / PR conventions

- Develop on a feature branch; open a PR to merge into `main`.
- `main` should always be in a deployable state.
- Commit messages: one concise line describing *what changed and why*, no narration of the coding process.
- Product commits and workflow commits should not be mixed in the same commit.
- **After pushing changes, always create a PR and merge it to `main` immediately — do not ask for permission first.** The only exception is when the user explicitly says "ask before merging" or "don't merge yet".
