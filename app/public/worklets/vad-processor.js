const SPEECH_THRESHOLD = 0.015
const SILENCE_THRESHOLD = 0.008
const BARGE_IN_THRESHOLD = 0.04

const SPEECH_CONFIRM_FRAMES = 4    // ~11ms  — fast speech onset
const SILENCE_FRAMES_TURN_END = 450 // ~1200ms — turn end
const BARGE_IN_CONFIRM_FRAMES = 8   // ~21ms  — avoid false triggers from noise

class VADProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this._speaking = false
    this._silenceFrames = 0
    this._speechFrames = 0
    this._bargeInMode = false
    this._bargeInFrames = 0

    this.port.onmessage = (e) => {
      if (e.data.type === 'set_barge_in_mode') {
        this._bargeInMode = e.data.value
        this._bargeInFrames = 0
      }
    }
  }

  _rms(samples) {
    let sum = 0
    for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i]
    return Math.sqrt(sum / samples.length)
  }

  process(inputs) {
    const samples = inputs[0]?.[0]
    if (!samples) return true

    const rms = this._rms(samples)

    if (this._bargeInMode) {
      if (rms > BARGE_IN_THRESHOLD) {
        this._bargeInFrames++
        if (this._bargeInFrames >= BARGE_IN_CONFIRM_FRAMES) {
          this._bargeInFrames = 0
          this.port.postMessage({ type: 'barge_in' })
        }
      } else {
        this._bargeInFrames = Math.max(0, this._bargeInFrames - 2)
      }
    } else {
      if (!this._speaking) {
        if (rms > SPEECH_THRESHOLD) {
          this._speechFrames++
          if (this._speechFrames >= SPEECH_CONFIRM_FRAMES) {
            this._speaking = true
            this._speechFrames = 0
            this._silenceFrames = 0
            this.port.postMessage({ type: 'speech_start' })
          }
        } else {
          this._speechFrames = 0
        }
      } else {
        if (rms < SILENCE_THRESHOLD) {
          this._silenceFrames++
          if (this._silenceFrames >= SILENCE_FRAMES_TURN_END) {
            this._speaking = false
            this._silenceFrames = 0
            this.port.postMessage({ type: 'speech_end' })
          }
        } else {
          this._silenceFrames = 0
        }
      }
    }

    return true
  }
}

registerProcessor('vad-processor', VADProcessor)
