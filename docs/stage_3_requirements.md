# Stage 3 — Requirements & Functionality Definition

**Feature name**: 
**Date**: 
**Status**: [ ] In progress  [ ] Done — moved to Stage 4

---

## Functional Requirements

### Input
- Accepted file/data types: 
- Max size / length constraints: 
- Where does the user supply it? (file upload, URL, paste, …): 

### Processing
- Where does processing happen? [ ] Browser (client-side JS)  [ ] Local Python script  [ ] External API
- Processing steps in order:
  1. 
  2. 
  3. 

### Output / Storage
- JSON schema (describe or sketch the shape):

```json
{
  "version": "1.0",
  "items": [
    {
      "id": "",
      "": ""
    }
  ]
}
```

- Where is the JSON stored? [ ] `/data/app/`  [ ] In-browser (localStorage / IndexedDB)  [ ] Other: 
- One JSON file per input, or accumulated? 

### Frontend Display
- Route / page: 
- Key UI components needed:
  - 
  - 
- User interactions:
  - 
  - 

---

## Non-Functional Requirements

| Concern | Requirement |
|---------|-------------|
| Performance | e.g. "processing < 30 s for a 20-page PDF" |
| Offline support | Yes / No |
| Mobile-friendly | Yes / No |
| Accessibility | Minimum WCAG level: AA / A / none |
| Browser support | modern evergreen only |

---

## Data Shape — Detailed

Describe each field in the JSON output:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | unique identifier | `"card_001"` |
|  |  |  |  |

---

## UX Notes / Wireframe Ideas

Sketch or describe the layout (text description is fine):

<!-- 
  e.g.
  Header: feature title + upload button
  Main area: card grid (3 columns on desktop, 1 on mobile)
  Card: front text, flip animation, back text
  Footer: progress indicator
-->

---

## Open Technical Questions

Things that need a prototype or spike to answer:

1. 
2. 
