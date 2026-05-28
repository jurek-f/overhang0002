# overhang0001

**Low-hanging educational apps** — harvesting the new capabilities of LLMs and vibe-coding for learning and teaching.

Each repo is one app. Apps can be:
- **subject/content-specific** — built around a fixed dataset for a particular topic
- **generic pipelines** — a tool that accepts user-provided or new material and processes it into an interactive experience

> The live Vercel demo uses a fixed dataset. A generic upload pipeline is a future direction.

## Architecture

**Frontend only — no database, no backend server.**
Data is pre-processed locally (Python) into JSON files that are bundled with the Vercel deployment and consumed directly by the React app.

```
Raw input (text, PDF, …)
  → Python processing scripts   (local, runs once)
  → JSON files                  (the "database", static)
  → React + Vite frontend       (reads JSON, deployed to Vercel)
```

## Repo structure

```
app/                    React + Vite frontend
services/
  import_data/          ingest raw source files
  process_data/         LLM-assisted processing → structured JSON
data/
  raw/                  original source files
  processed/            intermediate processing output
  app/                  final JSON consumed by the frontend
environment/
  python/               local Python env setup
scripts/                .bat files to run the pipeline in one step
docs/                   development workflow (one stage at a time)
```

## Prerequisites

- Node.js / npm
- Python 3 (for the data pipeline)
- Anthropic API key (for LLM processing steps)

## Quick start

```
./scripts/quick_setup_and_launch.bat
```

## Two layers — always keep them separate

Every session touches one or both of these layers. They must not be conflated:

| Layer | What it is | Lives in |
|-------|-----------|----------|
| **Product** | The app being built in this repo | `app/`, `services/`, `data/` |
| **Workflow** | The repeatable process for building future apps | `docs/`, `CLAUDE.md` |

Work on the product without touching the workflow, and refine the workflow without touching the product. When a session does both, commit them separately with clear messages.

## Development workflow

See `docs/workflow_stages.md` — six stages from brainstorm to Vercel deployment.
To start a new app, copy this entire repo and walk the stages with the agent.
