# Stage 4 — Feasibility Checks

**Feature name**: voice-vibe-coder
**Date**: 2026-05-28
**Status**: [x] Done — moved to Stage 5

---

## 4A — API & LLM Cost Estimation

### LLM Usage

| Step | Model | Input tokens (est.) | Output tokens (est.) | Calls per session | Cost per session |
|------|-------|--------------------|--------------------|-------------------|-----------------|
| AI response per turn | Claude Sonnet 4.6 | ~500 | ~300 | ~10 | ~$0.06 |
| Back-channel classifier | Rule-based (no LLM) | — | — | — | $0.00 |

**Additional API costs (non-LLM):**

| Service | Pricing | Usage per session | Cost per session |
|---------|---------|------------------|-----------------|
| Deepgram Nova-2 (streaming STT) | ~$0.006/min | ~10 min | ~$0.06 |
| ElevenLabs Turbo (TTS — AI turns) | ~$0.18–0.30/1k chars | ~3,000 chars | ~$0.50 |
| ElevenLabs (back-channel clips) | one-time pre-generation | ~80 chars total | ~$0.01 once |

**Total per session: ~$0.60.** Negligible for personal/demo use.

**Key optimisation already decided:** back-channel phrases are a fixed set — pre-generate
them once as static audio files, bundle in the app, zero runtime cost and zero latency.

### Decision
- [x] Cost is acceptable for personal / educational use at current scale
- [ ] LLM not needed — processing is rule-based / local model

Note: always use ElevenLabs Turbo (not standard) — latency is part of what the demo
showcases. The small cost premium is irrelevant at this scale.

---

## 4B — Data Availability

No dataset required. Voice is captured live from the user's microphone.
Pipeline input is real-time audio; output is LLM-generated text.

- [x] Sufficient freely available data exists to build and test the feature (N/A — no data needed)

---

## 4C — Legal & Licensing

### Content Licensing
All three APIs (Deepgram, ElevenLabs, Anthropic) permit personal and educational use.
Browser-side calls with user-supplied keys are explicitly supported by all three.

### Personal Data / Privacy
- Voice is personal data; sent to Deepgram for transcription
- No data persisted beyond the browser session (sessionStorage only)
- User supplies their own API keys — stored in localStorage, never sent to a server
- For the shared demo URL: a one-line notice in the UI covers it:
  *"Your voice is transcribed by Deepgram. Nothing is stored after the session ends."*
- API keys must not be committed to the repo; use Vercel environment variables for demo deployment

### Verdict
- [x] No legal blockers identified

---

## 4D — Technical Feasibility

### Echo cancellation (highest-risk question)

**Risk:** TTS audio bleeds into the mic → false barge-in triggers → feedback loop.

**Solution (two layers):**
1. `getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })` —
   Chrome's AEC operates at OS level and sees all speaker output as the reference signal.
2. Dynamic barge-in threshold — raise the energy threshold during TTS playback; only
   a deliberate interruption (louder, sustained) gets through. Reset after TTS ends.

**Verdict:** not a blocker. Standard practice in production voice systems.

### Deepgram browser CORS

Deepgram's JS SDK is explicitly designed for browser use with a user-supplied key.
WebSocket connection to their streaming endpoint works without a proxy server.

**Verdict:** not a blocker.

### Dual audio context (back-channel + mic stream coexisting)

Back-channel clips play through one `AudioBufferSourceNode`; mic input streams through
a separate `MediaStreamSourceNode`. Both live in the same `AudioContext`. They coexist
without interference — no clipping, no routing conflict.

**Verdict:** not a blocker. Standard Web Audio API pattern.

### Capability table

| Capability | Already in project? | Effort | Notes |
|------------|--------------------:|--------|-------|
| Mic capture + AEC | No | S | One `getUserMedia` call |
| Energy-based VAD (AudioWorklet) | No | S | ~50 lines of audio processing code |
| Deepgram streaming STT | No | S | Their JS SDK handles the WebSocket |
| Back-channel classifier (rule-based) | No | S | Timing logic in JS, pre-generated audio clips |
| Claude API from browser | No | S | Direct HTTPS call, user-supplied key |
| ElevenLabs TTS (Turbo) | No | S | Their JS SDK, streaming audio |
| Barge-in interrupt (AudioWorklet) | No | M | Threshold logic + audio stop; echo cancellation interaction needs testing |
| React UI (transcript, status, output) | No | S | Standard React components |

Effort key: S = hours, M = days

---

## Overall Feasibility Verdict

- [x] **Green** — proceed to execution

All costs are negligible. No legal blockers. All technical risks have known solutions.
The only item rated M (barge-in) is well-understood and the mitigation strategy is clear.
Estimated time to a working demo: 1–2 sessions.
