# Stage 6 — Execution

**Feature name**: voice-vibe-coder
**Date started**: 2026-05-28
**Target draft-done date**: TBD
**Status**: [ ] Not started  [x] In progress  [ ] Draft done  [ ] Iterated

---

## Implementation Plan

Build order follows risk: audio pipeline first, UI last.
Get the hard parts (mic → VAD → STT → back-channel → TTS → barge-in) working
before touching layout or polish.

### Phase 1 — Audio pipeline (the core)

- [ ] Mic capture via `getUserMedia({ echoCancellation: true, noiseSuppression: true })`
- [ ] `AudioWorklet` processor: RMS energy calculation per frame
- [ ] VAD logic: speech_start / speech_end events from energy threshold
- [ ] Dynamic barge-in threshold: HIGH during TTS playback, NORMAL otherwise
- [ ] Deepgram streaming STT: WebSocket via their browser JS SDK, word token events
- [ ] Back-channel classifier: pause duration + energy dip → phrase selection
- [ ] Pre-generate back-channel audio clips via ElevenLabs API (one-time script)
- [ ] Back-channel playback: `AudioBufferSourceNode` from pre-loaded clips

### Phase 2 — LLM + TTS

- [ ] Claude API call: POST from browser with user-supplied key
- [ ] Voice-optimised system prompt (1–2 sentences, one idea, no markdown, spoken rhythm)
- [ ] Stage 1 conversation prompt: brainstorm questions, landscape check
- [ ] Stage output extraction: structured JSON from Claude at session end
- [ ] ElevenLabs Turbo TTS: text → audio stream → playback
- [ ] Barge-in: AudioWorklet detects energy onset during playback → stop TTS audio

### Phase 3 — React UI

- [ ] `SettingsDrawer`: API key inputs (Deepgram, ElevenLabs, Anthropic) → localStorage
- [ ] `StatusRing`: three states — listening / processing / AI speaking
- [ ] `TranscriptFeed`: word tokens from Deepgram, speaker-labelled turns
- [ ] `BackchannelLog`: chip per event (phrase + timestamp offset)
- [ ] `AIResponseText`: text streams in as TTS plays
- [ ] `StageOutput`: structured output panel, shown at session end
- [ ] Start / End session controls
- [ ] Privacy notice: one line, visible on load

### Phase 4 — Integration + acceptance

- [ ] End-to-end session: speak → back-channel → turn-end → Claude → TTS → barge-in → repeat
- [ ] Verify back-channel fires naturally (not at turn-ends, not more than 1 per 8s)
- [ ] Verify barge-in latency < 300ms
- [ ] Verify no false barge-in triggers during TTS playback
- [ ] Vercel deploy: env vars for any demo-mode keys
- [ ] 60-second screen recording: both features visible without explanation

---

## File & Folder Checklist

```
app/src/
  pages/VoiceSession.tsx
  components/voice/
    StatusRing.tsx
    TranscriptFeed.tsx
    BackchannelLog.tsx
    AIResponseText.tsx
    StageOutput.tsx
    SettingsDrawer.tsx
  hooks/
    useVAD.ts            ← AudioWorklet + energy detection
    useDeepgram.ts       ← streaming STT
    useBackchannel.ts    ← classifier + clip playback
    useClaude.ts         ← LLM call + prompt
    useElevenLabs.ts     ← TTS + barge-in
  worklets/
    vad-processor.js     ← AudioWorkletProcessor (must be separate file)
  prompts/
    stage1-system.ts     ← voice-optimised system prompt
    stage1-turns.ts      ← per-turn conversation prompts
app/public/
  audio/backchannel/
    mmhm.mp3
    right.mp3
    i-see.mp3
    go-on.mp3
    yeah.mp3
    oh-interesting.mp3
    really.mp3
    interesting.mp3
scripts/
  generate_backchannel_audio.py   ← one-time ElevenLabs generation script
```

---

## Progress Log

| Date | What was done | Blockers / notes |
|------|--------------|-----------------|
| 2026-05-28 | Stages 1–5 complete; spec locked | |

---

## Testing Notes

- Test echo cancellation early — it's the highest-risk assumption
- Test barge-in on a real microphone, not system audio (feedback loop is different)
- Test back-channel timing with different speaking speeds (fast talker vs. slow)

---

## Deployment

- [ ] `npm run build` passes locally
- [ ] Pushed to `main` / merged PR
- [ ] Vercel preview URL confirmed working
- [ ] Production URL confirmed working:

---
