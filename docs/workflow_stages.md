# Development Workflow

This repo functions as a single app template. To launch a new app, clone the entire repo and progress through the documented stages with an agent.

---

## docs/ file map — layer labels

| File | Layer | Purpose |
|------|-------|---------|
| `workflow_stages.md` | **WORKFLOW** | Process reference document |
| `stage_1_brainstorm.md` | **PRODUCT** | Brainstorm record for this app |
| `stage_2_funnel.md` | **PRODUCT** | Idea selection and scope definition |
| `stage_3_requirements.md` | **PRODUCT** | Functionality, UX, and data structure |
| `stage_4_feasibility.md` | **PRODUCT** | Costs, data availability, legal review |
| `stage_5_product_definition.md` | **PRODUCT** | Locked specification before development |
| `stage_6_execution.md` | **PRODUCT** | Build log and progress tracking |
| `brainstorm_notes.md` | **PRODUCT** | Raw ideas and session notes outside stage structure |
| `backlog.md` | **PRODUCT** | Deferred features marked for future consideration |

**Workflow layer** files: `CLAUDE.md`, `README.md`, `docs/workflow_stages.md`
All other `docs/` files are **product layer** — app-specific.

---

## Stage sequence

| Stage | File | Purpose |
|-------|------|---------|
| 1 | `stage_1_brainstorm.md` | Open exploration, market check, feasibility assessment |
| 2 | `stage_2_funnel.md` | Focus on one concrete direction |
| 3 | `stage_3_requirements.md` | Specify functionality, interaction design, data models |
| 4 | `stage_4_feasibility.md` | Evaluate API costs, data sources, regulatory considerations |
| 5 | `stage_5_product_definition.md` | Final product brief locked for development |
| 6 | `stage_6_execution.md` | Build strategy and progress documentation |

Advance stages only after reaching a clear conclusion or decision point. Stages can be revisited—record the revision date when returning.

---

## Dedicated product docs (outside the stage sequence)

- **`brainstorm_notes.md`** — capture exploratory ideas, tangents, and preliminary concepts during Stage 1 and beyond. Store anything memorable that doesn't fit structured stage documents here.
- **`backlog.md`** — log intentionally deferred items with reasoning: too large for initial release, out of scope, or worth exploring later. Reference when planning iterations.
