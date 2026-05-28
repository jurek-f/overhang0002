# Stage 6 — Execution

**Feature name**: 
**Date started**: 
**Target draft-done date**: 
**Status**: [ ] Not started  [ ] In progress  [ ] Draft done  [ ] Iterated

---

## Implementation Plan

Break the work into discrete tasks. Check off as you go.

### Data Pipeline (Python)

- [ ] Create `services/import_data/<feature>/` — raw input scripts
- [ ] Create `services/process_data/<feature>/` — processing scripts
- [ ] Implement JSON schema from Stage 5 (Product Definition)
- [ ] Write processing script: input → `data/processed/<feature>/`
- [ ] Write export script: processed → `data/app/<feature>/`
- [ ] Test with at least one real input file
- [ ] Add entry to `scripts/` for one-command pipeline run

### Frontend (React + Vite)

- [ ] Create route: `app/src/pages/<FeatureName>.tsx`
- [ ] Register route in router
- [ ] Load JSON data (static import or fetch from `public/`)
- [ ] Build core display component(s)
- [ ] Handle empty / loading / error states
- [ ] Basic responsive layout (mobile + desktop)
- [ ] Link feature from main nav / home page

### Data wiring

- [ ] Copy or symlink final JSON(s) into `app/public/data/<feature>/`
- [ ] Verify Vercel build picks up the static data files

---

## File & Folder Checklist

```
services/
  import_data/<feature>/
  process_data/<feature>/
data/
  raw/<feature>/
  processed/<feature>/
  app/<feature>/
app/src/
  pages/<FeatureName>.tsx
  components/<feature>/
app/public/
  data/<feature>/
scripts/
  run_<feature>_pipeline.bat
```

---

## Progress Log

| Date | What was done | Blockers / notes |
|------|--------------|-----------------|
|      |              |                 |

---

## Testing Notes

- Sample input files used: 
- Edge cases tested: 
- Known limitations in this draft: 

---

## Deployment

- [ ] `npm run build` passes locally
- [ ] Pushed to `main` / merged PR
- [ ] Vercel preview URL confirmed working: 
- [ ] Production URL confirmed working: 

---

## Retrospective (fill after draft is done)

**What worked well?**

**What would you change next time?**

**Carry-over ideas for a future iteration:**
- 
- 
