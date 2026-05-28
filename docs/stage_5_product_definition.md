# Stage 5 — Product Definition

**Feature name**: 
**Date**: 
**Status**: [ ] In progress  [ ] Done — moved to Stage 6

> This stage consolidates the outputs of Stages 1–4 into a single, agreed-upon product brief.
> It is the authoritative reference for execution. If anything here conflicts with earlier stages, this document wins.

---

## One-Liner

> Complete this sentence: "This feature lets a user ______ so that ______."

<!-- e.g. "This feature lets a user upload a PDF chapter so that they get a set of flashcards they can review in the browser." -->

---

## The Product

### What it does (from the user's perspective)

1. 
2. 
3. 

### What it does NOT do (explicit non-goals)

- 
- 

---

## Final User Flow

The definitive, agreed step-by-step journey through the feature:

| Step | User action | System response |
|------|-------------|-----------------|
| 1 | | |
| 2 | | |
| 3 | | |
| … | | |
| N | | Result delivered |

---

## Data Contract

### Input

| Property | Value |
|----------|-------|
| Accepted types | |
| Max size | |
| Supplied by | user upload / bundled file / URL |

### Output JSON — final agreed schema

```json
{
  "version": "1.0",
  "meta": {
    "source": "",
    "generated": ""
  },
  "items": [
    {
      "id": "",
      "": ""
    }
  ]
}
```

File location in repo: `data/app/<feature>/`
File location served to app: `app/public/data/<feature>/`

---

## Pages & Components

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` or `/<feature>` | | |
| | | |

Key UI elements:
- 
- 

---

## Constraints Carried Forward from Feasibility

| Constraint | Impact on product |
|------------|------------------|
| API cost | |
| Data license | |
| Legal | |
| Technical | |

---

## Acceptance Criteria

The feature is "done" when:

- [ ] 
- [ ] 
- [ ] 
- [ ] Vercel preview URL works end-to-end with real data

---

## Sign-Off

- [ ] Product definition reviewed and agreed — ready to proceed to Stage 6 (Execution)
