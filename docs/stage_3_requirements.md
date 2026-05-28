# Stage 3 — Requirements & Functionality Definition

**Feature name**: voice-vibe-coder
**Date**: 2026-05-28
**Status**: [x] In progress  [ ] Done — moved to Stage 4

---

## Functional Requirements

### Input
- Microphone via `getUserMedia` — no push-to-talk, always listening during session
- `echoCancellation: true` + `noiseSuppression: true` to prevent TTS bleed into mic
- Browser: Chrome primary (AudioWorklet support required)

### Processing pipeline

```
Mic audio stream
  │
  ├─ AudioWorklet (real-time)
  │    ├─ VAD: energy-based RMS threshold → speech_start / speech_end events
  │    └─ Barge-in detector: monitors energy during TTS playback → interrupt signal
  │
  ├─ Deepgram streaming STT (WebSocket, browser SDK)
  │    └─ word tokens → live transcript display
  │
  ├─ Back-channel classifier (fires during user speech)
  │    ├─ Input: pause duration + energy envelope from VAD
  │    ├─ Rule: pause 600–900ms mid-utterance (not turn-end) → select phrase
  │    ├─ Phrase bank: "mmhm", "right", "I see", "go on", "yeah", "oh interesting"
  │    └─ Output: ElevenLabs TTS → short audio clip, overlaid on listening state
  │
  └─ On turn-end (VAD silence > 1200ms):
       └─ Full transcript + stage context → Claude API → response text
            └─ ElevenLabs TTS → audio playback
                 └─ AudioWorklet barge-in monitor active during playback
```

**VAD choice**: energy-based (RMS) for V1 — avoids Silero WASM setup complexity
while being sufficient for a demo. Revisit if false positives are a problem.

**STT**: Deepgram streaming via their browser JS SDK. User supplies API key.
Chosen over Web Speech API because streaming word tokens are visible in the transcript
in real-time — this is part of the demo, not hidden plumbing.

**TTS**: ElevenLabs. Chosen for naturalness — a speech tech demo using robotic TTS
undercuts the message.

### Output / Storage

```json
{
  "session": {
    "id": "uuid",
    "stage": 1,
    "started": "ISO timestamp"
  },
  "turns": [
    {
      "id": "turn_001",
      "speaker": "user",
      "transcript": "...",
      "backchannels": [
        { "offset_ms": 1200, "phrase": "mmhm" }
      ],
      "barge_in": false
    },
    {
      "id": "turn_002",
      "speaker": "ai",
      "text": "...",
      "barge_in_received": false
    }
  ],
  "stage_output": {
    "problem": "...",
    "raw_ideas": ["..."],
    "landscape_notes": "..."
  }
}
```

- Stored in `sessionStorage` (not committed, not persisted — demo only)
- Stage output rendered in UI at session end

### Frontend Display

Route: `/` (single page)

**UI components:**

| Component | Purpose |
|-----------|---------|
| Status ring | Pulsing indicator: listening / processing / AI speaking |
| Live transcript | Deepgram word tokens stream in real-time, speaker-labelled |
| Back-channel log | Subtle chip appears each time a back-channel fires (phrase + timestamp) — makes the tech visible |
| AI response text | Streams in as TTS plays |
| Stage output panel | Appears after stage completes; structured markdown output |
| Settings drawer | API keys for Deepgram, ElevenLabs, Anthropic — stored in localStorage |
| Start / End button | Single prominent control |

**Back-channel log rationale**: making back-channel events visually explicit is a deliberate
demo choice — a professional viewer can see the timing and phrase selection, not just hear it.

---

## Non-Functional Requirements

| Concern | Requirement |
|---------|-------------|
| Barge-in latency | < 300ms from voice onset to audio stop |
| Back-channel delay | 600–900ms after mid-utterance pause |
| Back-channel frequency | Max 1 per 8 seconds; never at turn-end |
| Browser support | Chrome only for V1 (AudioWorklet) |
| Offline support | No |
| Mobile-friendly | No — desktop demo first |
| Accessibility | None for V1 demo |

---

## Data Shape — Detailed

| Field | Type | Description |
|-------|------|-------------|
| `session.id` | string | UUID, generated on start |
| `session.stage` | number | Current workflow stage (1 for V1) |
| `turns[].speaker` | `"user"` \| `"ai"` | Who spoke |
| `turns[].transcript` | string | Full transcript of turn |
| `turns[].backchannels` | array | Back-channel events during this user turn |
| `turns[].barge_in` | boolean | Whether user barged in on this AI turn |
| `stage_output` | object | Structured output from Claude at stage end |

---

## UX Notes

```
┌─────────────────────────────────────────┐
│  ● LISTENING          [settings gear]   │
│                                         │
│  You: "I'm thinking about a tool        │
│        that helps people—"              │
│        [mmhm @ 1.2s] [right @ 4.8s]    │
│                                         │
│  AI: "Interesting. Who would be the     │
│       primary user for this?"           │
│                                         │
│  ─────────────────────────────────────  │
│  STAGE 1 OUTPUT                         │
│  Problem: ...                           │
│  Ideas: ...                             │
└─────────────────────────────────────────┘
```

Minimal chrome. The conversation IS the interface. Back-channel chips are subtle —
visible but not distracting.

---

## Open Technical Questions

1. **Echo cancellation reliability**: will `echoCancellation: true` prevent TTS bleed
   from triggering false barge-ins? Needs a quick spike — this is the highest-risk
   assumption in the whole pipeline.

2. **Deepgram browser CORS**: their JS SDK should handle this cleanly with a user-supplied
   key, but needs confirming before committing to it.

3. **Back-channel + TTS overlap**: playing a short back-channel clip while simultaneously
   streaming audio from the mic requires careful audio context management. Two audio
   outputs need to coexist without clipping.

---
