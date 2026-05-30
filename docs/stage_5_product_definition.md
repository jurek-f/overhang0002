# Stage 5 — Product Definition

**Feature name**: voice-vibe-coder
**Date**: 2026-05-28
**Status**: [x] Done — moved to Stage 6

> Authoritative reference for execution. Conflicts with earlier stages: this document wins.

---

## One-Liner

This app lets a developer talk through a product design session so that their conversational
speech technology expertise — back-channel feedback, barge-in, natural turn-taking — is
demonstrably showcased in a shareable browser demo.

---

## The Product

### What it does

1. Captures mic audio continuously — no push-to-talk
2. Streams real-time transcription via Deepgram (word tokens visible as user speaks)
3. Fires natural back-channel sounds at mid-utterance pauses ("mmhm", "right", "I see") —
   timing-based classifier, pre-generated audio clips, visible as chips in the UI
4. Detects turn end via energy-based VAD (1.2s silence threshold)
5. Sends full turn transcript + stage context to Claude → structured response
6. Plays response via ElevenLabs Turbo TTS; user can interrupt at any point
7. Barge-in stops AI audio within 300ms; returns to listening state
8. After ~5–8 turns: renders structured Stage 1 output (problem, ideas, landscape notes)

### What it does NOT do

- Not a production workflow tool — it is a demo of speech technology
- No session persistence — sessionStorage only, clears on tab close
- No mobile layout — desktop Chrome only for V1
- No full 6-stage workflow — Stage 1 brainstorm is sufficient for the demo
- No push-to-talk anywhere

---

## Final User Flow

| Step | User action | System response |
|------|-------------|-----------------|
| 1 | Opens app | Minimal UI: Start button + settings gear |
| 2 | Opens settings | API key inputs (Deepgram, ElevenLabs, Anthropic); saved to localStorage |
| 3 | Clicks Start | Mic activates; status ring pulses "Listening" |
| 4 | Speaks freely | Words stream into transcript in real time; back-channel fires at natural pauses |
| 5 | Pauses (>1.2s) | VAD detects turn end; transcript sent to Claude |
| 6 | Waits | Claude response → ElevenLabs TTS plays; status shows "AI Speaking" |
| 7 | Interrupts mid-response | Audio stops within 300ms; status returns to "Listening" |
| 8 | Repeats 4–7 (~5–8 turns) | Conversation covers Stage 1 brainstorm questions |
| 9 | Clicks End (or natural close) | Stage output panel renders: problem, raw ideas, landscape notes |

---

## Data Contract

### Input
| Property | Value |
|----------|-------|
| Source | Browser microphone |
| Format | Real-time audio stream (Web Audio API) |
| Supplied by | User's mic, no file upload |

### Session schema (sessionStorage)

```json
{
  "session": {
    "id": "uuid-v4",
    "stage": 1,
    "started": "2026-05-28T10:00:00Z"
  },
  "turns": [
    {
      "id": "turn_001",
      "speaker": "user",
      "transcript": "I'm thinking about a tool that...",
      "backchannels": [
        { "offset_ms": 1200, "phrase": "mmhm" },
        { "offset_ms": 4800, "phrase": "right" }
      ]
    },
    {
      "id": "turn_002",
      "speaker": "ai",
      "text": "Interesting. Who would be the primary user?",
      "barge_in_received": false
    }
  ],
  "stage_output": {
    "problem": "...",
    "raw_ideas": ["...", "..."],
    "landscape_notes": "..."
  }
}
```

File location: sessionStorage only — not committed, not served as a static asset.

---

## Pages & Components

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `VoiceSession` | Main container; owns all state |
| | `StatusRing` | Pulsing indicator: listening / processing / AI speaking |
| | `TranscriptFeed` | Real-time word tokens, speaker-labelled turns |
| | `BackchannelLog` | Chip per back-channel event (phrase + timestamp) |
| | `AIResponseText` | Streams in as TTS plays |
| | `StageOutput` | Structured markdown panel, visible after session ends |
| | `SettingsDrawer` | API key inputs; persisted to localStorage |

**Back-channel pre-generated clips** (static assets, not runtime API calls):
`public/audio/backchannel/` → `mmhm.mp3`, `right.mp3`, `i-see.mp3`, `go-on.mp3`,
`yeah.mp3`, `oh-interesting.mp3`, `really.mp3`, `interesting.mp3`

---

## Voice-Optimised LLM Output

The Claude system prompt must enforce spoken-language constraints — this is a speech tech
decision, not just prompt hygiene:

- **Response length**: 1–2 sentences per turn maximum. Voice comprehension drops sharply
  with longer responses; the listener can't re-read.
- **Information density**: one idea per turn. Never combine question + context + elaboration
  in a single response. Ask one thing, wait for an answer.
- **Sentence structure**: simple and direct. No subordinate clauses stacked three deep.
  No "firstly / secondly / thirdly". No markdown of any kind (no bullets, headers, bold).
- **Natural spoken rhythm**: contractions ("you're" not "you are"), short words, active voice.
  Write how a thoughtful person speaks, not how they write.

This is a demonstrable skill in the demo — a professional listening will notice immediately
whether the AI sounds like it was designed for voice or like a chatbot reading its output aloud.

---

## Constraints Carried Forward

| Constraint | Impact |
|------------|--------|
| Frontend-only | No backend; all API calls direct from browser with user-supplied keys |
| Chrome only (V1) | AudioWorklet required for VAD + barge-in; Safari deferred |
| ElevenLabs Turbo only | Standard model too slow; latency is part of the demo |
| Back-channels pre-generated | Must be generated once before first Vercel deploy |
| Keys in localStorage | Acceptable for personal demo; not for shared production |

---

## Acceptance Criteria

- [ ] Back-channel fires at perceptually natural moments — not random, not at turn-ends,
      not more than once per 8 seconds
- [ ] Barge-in stops AI audio within 300ms of voice onset
- [ ] No false barge-in triggers from TTS bleed during normal playback
- [ ] A 60-second screen recording captures both features without requiring explanation
- [ ] Shareable Vercel URL loads and runs in Chrome with no setup beyond API keys
- [ ] Stage 1 structured output appears at end of session

---

## Sign-Off

- [x] Product definition reviewed and agreed — ready to proceed to Stage 6 (Execution)
