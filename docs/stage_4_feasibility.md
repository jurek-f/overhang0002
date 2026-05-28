# Stage 4 — Feasibility Checks

**Feature name**: 
**Date**: 
**Status**: [ ] In progress  [ ] Done — moved to Stage 5

---

## 4A — API & LLM Cost Estimation

### LLM Usage

| Step | Model considered | Input tokens (est.) | Output tokens (est.) | Calls per run | Cost per run |
|------|-----------------|--------------------|--------------------|---------------|-------------|
|      |                 |                    |                    |               |             |

**Pricing reference** (update if stale):
- Claude Sonnet 4.6: $3 / 1M input tokens, $15 / 1M output tokens
- Claude Haiku 4.5: $0.80 / 1M input tokens, $4 / 1M output tokens
- OpenAI GPT-4o: $2.50 / 1M input tokens, $10 / 1M output tokens

**Estimated cost per user session**: 
**Estimated cost for 100 test runs**: 

### Decision

- [ ] Cost is acceptable for personal / educational use at current scale
- [ ] Cost requires optimisation before proceeding (note plan below)
- [ ] LLM not needed — processing is rule-based / local model

Optimisation plan if needed:
<!-- e.g. "chunk documents, cache results in JSON, only re-run on file change" -->

---

## 4B — Data Availability

### Source Data

| Dataset / Document type | Source (URL or description) | License | Format | Freely available? |
|------------------------|----------------------------|---------|--------|------------------|
|                        |                             |         |        |                  |

### Data Quality Notes

- Expected noise / cleaning required: 
- Language(s) and encoding: 
- Size estimates (files, MB): 

### Decision

- [ ] Sufficient freely available data exists to build and test the feature
- [ ] Data must be self-supplied by the user (upload flow required)
- [ ] Blocker — no suitable data found

---

## 4C — Legal & Licensing

### Content Licensing

| Concern | Assessment | Source |
|---------|------------|--------|
| Is the training / input data licensed for this use? | | |
| Does processing and storing derived content violate the source license? | | |
| Are there attribution requirements? | | |

### Personal Data / Privacy

- Does the feature process any personal data? [ ] Yes  [ ] No
- If yes, is it processed entirely client-side (no server, no API call with PII)? [ ] Yes  [ ] No
- GDPR relevance: [ ] None (no personal data, no EU users targeted)  [ ] Minimal  [ ] Needs review

### AI / Generated Content

- Does the feature produce AI-generated content shown to users? [ ] Yes  [ ] No
- If yes, is appropriate disclosure planned? [ ] Yes  [ ] No  [ ] N/A

### Verdict

- [ ] No legal blockers identified
- [ ] Caution — see notes below
- [ ] Blocker — do not proceed without advice

Notes:
<!-- any caveats or items to monitor -->

---

## 4D — Technical Feasibility

| Capability required | Already in project? | Effort to add | Notes |
|--------------------|--------------------|--------------:|-------|
| PDF parsing | [ ] Yes  [ ] No | S / M / L | |
| Local embedding model | [ ] Yes  [ ] No | S / M / L | |
| LLM API call (Python) | [ ] Yes  [ ] No | S / M / L | |
| JSON → Vercel static asset | [ ] Yes  [ ] No | S / M / L | |
| React component (cards, graph, …) | [ ] Yes  [ ] No | S / M / L | |

Effort key: S = hours, M = days, L = week+

---

## Overall Feasibility Verdict

- [ ] **Green** — proceed to execution
- [ ] **Amber** — proceed with noted caveats
- [ ] **Red** — return to Stage 2, select different idea

Summary:
