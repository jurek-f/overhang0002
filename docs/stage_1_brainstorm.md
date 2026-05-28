# Stage 1 — Brainstorm

**Feature name**: voice-vibe-coder
**Date started**: 2026-05-28
**Status**: [x] In progress  [ ] Done — moved to Stage 2

---

## Problem / Opportunity

Rapid iterative software design — the "vibe coding" pattern — is fast when you're at a
desk with a keyboard. On a phone, commuting, or away from a screen it collapses: typing
is slow, reading long outputs is awkward, and context-switching between tools breaks flow.

The bottleneck is the input/output modality, not the ideas. People think fast, type slow.

---

## Raw Ideas

- Voice → structured stage docs (brainstorm, funnel, requirements, feasibility, spec)
- Stage-gated UI: one stage at a time, voice to advance
- The workflow stages already defined in this repo ARE the content structure
- Visual output is secondary — audio confirmation is primary ("Stage 2 complete. Moving to requirements.")
- Could work as a standalone planning tool or as a companion to Claude Code sessions
- User-supplied API key stored in localStorage — no backend needed
- Downloadable/copyable stage docs as output (the same files an agent would commit)
- Progress indicator: "You are in Stage 3 of 6"
- Ambient use: bluetooth headphones + phone = design a project on a walk

---

## Inspiration & References

| Source | What's interesting about it |
|--------|-----------------------------|
| This repo's workflow stages | The stages are the UX structure — self-referential |
| GitHub Copilot Voice | Voice commands for code execution; not design/planning |
| Otter.ai | Voice → transcript; no structure or stage logic |
| Whisper (OpenAI) | Accurate transcription; not a product, a model |
| Notion AI | AI-assisted docs; not voice-driven, not stage-gated |

---

## Target User

A developer or technical product person who:
- Regularly uses Claude / Cursor / Claude Code for rapid prototyping
- Has ideas during non-desk time (commute, gym, walk)
- Finds voice notes too unstructured and writing too slow
- Wants to arrive at a keyboard with a fully structured spec, not a raw transcript

---

## Content / Domain

- Document types: none (voice is the input; markdown docs are the output)
- Subject domains: software design, product definition, technical feasibility
- Language: English initially; Web Speech API supports others

---

## Possible Output Formats

- [x] Structured summary (stage docs in markdown)
- [ ] Interactive quiz / flashcards
- [ ] Concept map / graph
- [ ] Timeline
- [ ] Glossary
- [ ] Annotated text
- [ ] Audio / TTS
- [ ] Other: downloadable .md file per stage

---

## Existing Landscape

### Known products / prior art

| Product | What it does | Why it succeeded / failed |
|---------|-------------|--------------------------|
| GitHub Copilot Voice | Voice commands in VS Code | Solves code execution, not design/planning |
| Cursor | AI code editor | Keyboard-only; no voice |
| Otter.ai | Voice → transcript | No structure; output is raw text |
| Notion AI | AI writing in docs | Not voice-driven; not stage-gated |
| Claude Code (CLI) | Agent coding in terminal | Keyboard-only; no mobile path |

### What has changed?

- [x] Technology / models — LLMs now handle open-ended structured output reliably
- [x] Tooling / development cost — vibe-coding lowers build cost dramatically
- [ ] Data availability
- [x] User behaviour / cultural shift — "vibe coding" is now a recognised practice
- [ ] Economic factors

Notes: Web Speech API has been in browsers for years but nobody has paired it with
structured LLM output and a stage-gated workflow UX. The workflow template (this repo)
is the missing ingredient that makes this tractable.

### Pros / Cons

| Pros (reasons this could work now) | Cons (reasons it might not) |
|-----------------------------------|-----------------------------|
| Web Speech API is free and browser-native | Web Speech API is fragile — timeouts, requires gesture to start |
| No backend needed (user-supplied API key) | API key in localStorage is a security trade-off for personal use |
| Workflow stages already defined — content structure is done | Voice UX is hard to get right; awkward pauses feel broken |
| Real gap: no voice-first design planning tool exists | Niche audience — most developers are at desks |
| Self-referential: the workflow IS the demo | Structured output quality depends on prompt engineering |
| Mobile browser support is decent (iOS Safari, Android Chrome) | |

---

## Low-Hangingness Evaluation

### Data

- No dataset needed — voice is captured live; output is LLM-generated.

Rating: 🟢 | Notes: Zero data pipeline.

### Processing pipeline (Python, local)

- No Python pipeline — everything runs in the browser.
- Input: Web Speech API transcript → prompt template → Claude API → structured markdown.
- One LLM call per stage transition; output is text.

Rating: 🟢 | Notes: Simplest possible pipeline. Risk is prompt quality, not pipeline complexity.

### Frontend complexity

- Multi-step guided UI (6 stages, one at a time)
- Voice input widget (start/stop, transcript display)
- Markdown output renderer per stage
- API key input + localStorage persistence
- Download or copy-to-clipboard for stage docs

Rating: 🟡 | Notes: The voice UX needs careful handling — start/stop state, error handling,
mobile testing. Not hard but needs real device testing.

### Overall low-hangingness verdict

| Dimension | Rating | Key risk |
|-----------|--------|----------|
| Data | 🟢 | None |
| Pipeline | 🟢 | Prompt output quality on arbitrary voice input |
| Frontend | 🟡 | Web Speech API reliability on mobile |
| **Overall** | 🟢 | |

Estimated time to a working demo: 1–2 sessions
Biggest single risk: Web Speech API on mobile Safari — requires user gesture per utterance,
can cut off mid-sentence. Needs early device testing.

---

## Open Questions

1. Does a single prompt template per stage produce useful structured output, or do we
   need multi-turn conversation per stage?
2. Should the app support resuming a session (load previously saved stage docs)?
3. Is user-supplied API key in localStorage acceptable for the target user?

---

## Go / No-Go Signal

- Confirm Web Speech API works acceptably on mobile Safari (quick spike)
- Confirm Claude API can be called from browser JS with user-supplied key (CORS check)
- If both pass: move to Stage 2

---
