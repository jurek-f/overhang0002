# Backlog — Deferred Features

Ideas that are explicitly out of scope for the current build.
Each entry has a rationale. Revisit when scoping the next iteration.

---

## Natural conversation back-channel (fast classifier + TTS layer)

**What**: Two-model voice AI architecture — main LLM handles substantive responses while a
fast lightweight classifier watches real-time prosody/pace/emotion and emits natural
back-channel sounds ("hmm", "ok", "ah", "really?") via TTS. Adapts dynamically to
speaker speed, tone, and emotional state.

**Why deferred**: Requires a real-time audio pipeline, streaming TTS, and a fine-tuned
small prosody classifier. It's a component or SDK, not a standalone app — no clear
frontend-only delivery shape. The gap in the market is real (no current voice AI does
back-channel well) but the build complexity is high and out of scope for this template.

**When to revisit**: After proving a voice-input UX pattern in the main app. The
back-channel idea could become a layer on top of a working voice interface.

**Notes**: Could potentially use a rule-based approximation (fixed timing + random
selection from a small phrase bank) as a cheap demo substitute, but that's not the
interesting technical idea — it's the adaptive classifier that matters.
