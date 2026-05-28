# Brainstorm Notes

Raw ideas and session tangents. Not structured — just worth keeping.

---

## Session 1 — 2026-05-28

### Trigger idea 1: Natural conversation back-channel (→ saved to backlog)

Two-model architecture for voice AI:
- Main LLM streams the substantive response
- Fast lightweight classifier watches prosody / pace / emotion in real time and emits
  natural back-channel tokens ("hmm", "ok", "ah", "really?", "interesting") via TTS

The insight: no current voice AI product does acoustic back-channel at all — Hume AI,
Sesame, ChatGPT Voice, ElevenLabs all skip this. It's the single biggest thing that makes
AI conversation feel robotic vs. human.

Why it's hard: needs real-time audio pipeline, streaming TTS, and a small fine-tuned
prosody classifier. Not a standalone app — it's a component or SDK. Doesn't fit
frontend-only constraint. Saved to backlog.

---

### Trigger idea 2: Voice-first vibe coding / SW design workflow (→ main focus)

Core concept: walk through a structured design workflow entirely by voice. No typing.
You think aloud; the app structures your decisions into stage docs (brainstorm → funnel →
requirements → feasibility → product definition). Visual output is optional — overview
and results only, not the primary interaction mode.

**The meta-angle**: the workflow stages we're already building here ARE the demo content.
The app is self-referential: it helps users run the exact process that produced it.

**Landscape**: no product occupies the "voice-first design + planning → structured artefacts"
niche. GitHub Copilot Voice does code execution commands. Otter.ai transcribes but
doesn't structure. Notion AI writes but isn't voice-driven or stage-gated.

**Technical path (frontend-only)**:
- Web Speech API for voice capture (browser-native, free, no backend)
- User-supplied Claude API key (stored in localStorage, never sent anywhere except Anthropic)
- Prompt template per stage → Claude API → structured markdown output
- Render stage docs in app; allow download or copy

**Mobile angle**: Web Speech API works on iOS Safari + Android Chrome. With a phone,
headphones, and this app you could design and spec a full project on a commute.
That's the pitch.

**Biggest risk**: Web Speech API is fragile — it times out, loses connection, requires
user gesture to start. The UX loop of "speak → pause → see output" needs to feel
snappy, not broken. Needs early testing on real mobile devices.

**Key open question**: does the structured-output quality from a simple prompt template
hold up across arbitrary brainstorm input, or does it need multiple LLM passes?
(Probably one well-structured prompt is enough for Stage 1–2; later stages may need more.)
