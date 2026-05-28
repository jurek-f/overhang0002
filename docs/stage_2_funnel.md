# Stage 2 — Funnel

**Feature name**: voice-vibe-coder
**Date**: 2026-05-28
**Status**: [x] In progress  [ ] Done — moved to Stage 3

---

## Selected Idea

A browser-based conversational demo that showcases speech technology expertise —
specifically back-channel feedback, barge-in, and natural turn-taking — using a
live voice design session (the workflow stages) as the conversation content.

---

## Why This One?

- The real goal is demonstrable expertise for a LinkedIn / professional audience, not a
  novel product. Conversational speech tech is the strongest area to showcase.
- Back-channel + barge-in is the highest-signal "wow" for practitioners — immediately
  perceivable, technically non-trivial, not something most developers ship.
- Frontend-only, shareable as a single URL, runnable in 30 seconds — fits the LinkedIn
  demo format exactly.
- The workflow stages provide ready-made conversation content; no content design needed.

---

## Discarded Ideas & Reasons

| Idea | Why discarded |
|------|---------------|
| "Build your website for everyone" | Crowded market; needs backend for deployment step |
| Pure workflow tool (no speech depth) | Any developer could build it; signals nothing about speech expertise |
| Signal processing / VAD showcase | Not the user's primary expertise area |
| Phone / WhatsApp primary mode | Correct for usability; browser first is correct for demo shareability |

---

## Core User Flow

1. User opens app in browser, sees a minimal interface with a single start button
2. User clicks start — microphone activates, no push-to-talk required
3. User begins speaking (anything — the app prompts with "tell me about your project idea")
4. **While user speaks**: back-channel sounds fire at natural moments ("mmhm", "right",
   "oh interesting") — timing driven by pause patterns and energy, not random
5. User finishes speaking — VAD detects end of turn
6. AI responds with substantive content (Stage 1 brainstorm questions, landscape check, etc.)
7. **User can interrupt mid-response** — barge-in detected, AI stops immediately, listens
8. Conversation advances through at least one full workflow stage (Stage 1 brainstorm)
9. At end of session: transcript + structured stage output shown on screen

---

## Data Flow

```
Mic audio
  → VAD (Silero WASM) — detects speech / silence boundaries
  → Deepgram streaming STT — word-by-word transcript tokens
  → Back-channel classifier (rule-based: pause length + energy dip) → ElevenLabs TTS → speaker
  → On turn end: transcript + stage context → Claude API → structured response text
  → ElevenLabs TTS → audio playback
  → AudioWorklet monitors mic during playback → barge-in interrupt signal
  → Transcript + stage output → rendered in UI
```

No backend. No persistent storage. All API keys user-supplied via settings panel,
stored in localStorage.

---

## Scope Boundaries

**In scope (V1 demo):**
- Back-channel during user speaking (timing-based, rule-driven)
- Barge-in during AI speaking
- Natural turn-taking (no push-to-talk button)
- One full workflow stage as conversation content (Stage 1 brainstorm)
- Visual transcript display + final structured output
- Desktop browser (Chrome primary)

**Out of scope (explicitly deferred):**
- Full 6-stage workflow — one stage is enough for the demo
- Mobile-optimised layout — desktop demo first
- Session persistence / resume
- Phone / WhatsApp mode — backlog, not V1
- Adaptive TTS prosody (SSML) — V2 if the demo lands well
- Multilingual

---

## Success Criteria

- [ ] Back-channel fires at perceptually natural moments — not random, not missing
- [ ] Barge-in works reliably — AI stops within 300ms of user voice onset
- [ ] A 60-second screen recording captures the "wow" without explanation
- [ ] A speech tech professional watching says "I see what you did there"
- [ ] Shareable Vercel URL, runs without setup, works in Chrome

---
