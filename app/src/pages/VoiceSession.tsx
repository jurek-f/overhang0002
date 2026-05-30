import { useState, useCallback, useRef } from 'react'
import { useVAD } from '../hooks/useVAD'
import { useDeepgram } from '../hooks/useDeepgram'
import { useBackchannel } from '../hooks/useBackchannel'
import { useClaude } from '../hooks/useClaude'
import { useElevenLabs } from '../hooks/useElevenLabs'
import { StatusRing } from '../components/voice/StatusRing'
import { TranscriptFeed } from '../components/voice/TranscriptFeed'
import { BackchannelLog } from '../components/voice/BackchannelLog'
import { StageOutputPanel } from '../components/voice/StageOutput'
import { SettingsDrawer } from '../components/voice/SettingsDrawer'
import type { SessionStatus, Turn, StageOutput, ApiKeys, BackchannelEvent } from '../types'
import { DEFAULT_KEYS, STORAGE_KEY } from '../types'

function loadKeys(): ApiKeys {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_KEYS, ...JSON.parse(raw) } : DEFAULT_KEYS
  } catch {
    return DEFAULT_KEYS
  }
}

export function VoiceSession() {
  const [keys, setKeys] = useState<ApiKeys>(loadKeys)
  const [showSettings, setShowSettings] = useState(false)
  const [status, setStatus] = useState<SessionStatus>('idle')
  const [turns, setTurns] = useState<Turn[]>([])
  const [interimText, setInterimText] = useState('')
  const [backchannelEvents, setBackchannelEvents] = useState<BackchannelEvent[]>([])
  const [stageOutput, setStageOutput] = useState<StageOutput | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Accumulate final transcript segments between turn-ends
  const pendingTranscriptRef = useRef('')
  const turnsRef = useRef<Turn[]>([])
  turnsRef.current = turns

  const { sendTurn, extractStageOutput } = useClaude(keys.anthropic)

  const tts = useElevenLabs(keys.elevenlabs, keys.elevenLabsVoiceId, {
    onStart: () => setStatus('ai_speaking'),
    onEnd: () => {
      vad.setBargeInMode(false)
      setStatus('listening')
    },
  })

  const handleAiResponse = useCallback(
    async (responseTurns: Turn[]) => {
      setStatus('thinking')
      try {
        const text = await sendTurn(responseTurns)
        const aiTurn: Turn = { id: crypto.randomUUID(), speaker: 'ai', text }
        setTurns((prev) => [...prev, aiTurn])
        vad.setBargeInMode(true)
        await tts.play(text)
      } catch (e) {
        setError(String(e))
        setStatus('listening')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sendTurn, tts]
  )

  const backchannel = useBackchannel({
    onBackchannel: (ev) => {
      setBackchannelEvents((prev) => [...prev, ev])
    },
  })

  const vad = useVAD({
    onSpeechStart: () => {
      setStatus('user_speaking')
      backchannel.onSpeechStart()
    },
    onSpeechEnd: () => {
      backchannel.onSpeechEnd()
      const text = pendingTranscriptRef.current.trim()
      pendingTranscriptRef.current = ''
      setInterimText('')
      if (!text) {
        setStatus('listening')
        return
      }
      const userTurn: Turn = { id: crypto.randomUUID(), speaker: 'user', text }
      const next = [...turnsRef.current, userTurn]
      setTurns(next)
      handleAiResponse(next)
    },
    onBargeIn: () => {
      tts.stop()
      // Mark the last AI turn as interrupted
      setTurns((prev) => {
        const copy = [...prev]
        const last = copy[copy.length - 1]
        if (last?.speaker === 'ai') copy[copy.length - 1] = { ...last, bargeIn: true }
        return copy
      })
      vad.setBargeInMode(false)
      setStatus('user_speaking')
    },
  })

  const deepgram = useDeepgram(keys.deepgram, {
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        pendingTranscriptRef.current += (pendingTranscriptRef.current ? ' ' : '') + text
        setInterimText('')
      } else {
        setInterimText(text)
      }
    },
  })

  const handleStart = useCallback(async () => {
    setError(null)
    setStatus('connecting')
    setTurns([])
    setInterimText('')
    setBackchannelEvents([])
    setStageOutput(null)
    pendingTranscriptRef.current = ''

    try {
      const stream = await vad.start()
      deepgram.connect(stream)
      backchannel.startSession()
      setStatus('listening')
    } catch (e) {
      setError('Microphone access denied or not available.')
      setStatus('idle')
    }
  }, [vad, deepgram, backchannel])

  const handleStop = useCallback(async () => {
    backchannel.stopSession()
    deepgram.disconnect()
    vad.stop()
    tts.stop()
    setStatus('done')
    setInterimText('')

    if (turnsRef.current.length > 0) {
      try {
        const output = await extractStageOutput(turnsRef.current)
        setStageOutput(output)
      } catch {
        // stage output is best-effort
      }
    }
  }, [backchannel, deepgram, vad, tts, extractStageOutput])

  const handleSaveKeys = useCallback((k: ApiKeys) => {
    setKeys(k)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(k))
  }, [])

  const isActive = status !== 'idle' && status !== 'done'
  const missingKeys = !keys.deepgram || !keys.elevenlabs || !keys.anthropic

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 680,
        width: '100%',
        margin: '0 auto',
        padding: '1.5rem 1rem',
        minHeight: 0,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>voice vibe coder</div>
          <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.1rem' }}>
            Your voice is transcribed by Deepgram. Nothing is stored after the session ends.
          </div>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          title="API key settings"
          style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', padding: '0.4rem 0.6rem', fontSize: '1rem', color: '#6b7280' }}
        >
          ⚙
        </button>
      </div>

      {/* Status ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <StatusRing status={status} />
      </div>

      {/* Back-channel log */}
      <BackchannelLog events={backchannelEvents} />

      {/* Transcript */}
      <div style={{ flex: 1, minHeight: 200, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TranscriptFeed turns={turns} interimText={interimText} />
      </div>

      {/* Stage output */}
      {stageOutput && (
        <div style={{ marginTop: '1rem' }}>
          <StageOutputPanel output={stageOutput} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.9rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '0.85rem', color: '#dc2626' }}>
          {error}
        </div>
      )}

      {/* Controls */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
        {!isActive && status !== 'done' && (
          <button
            onClick={handleStart}
            disabled={missingKeys}
            title={missingKeys ? 'Add API keys in settings first' : undefined}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: '10px',
              background: missingKeys ? '#e5e7eb' : '#6366f1',
              color: missingKeys ? '#9ca3af' : '#fff',
              border: 'none', fontWeight: 600, fontSize: '0.95rem',
              cursor: missingKeys ? 'not-allowed' : 'pointer',
            }}
          >
            {missingKeys ? 'Add API keys to start' : 'Start session'}
          </button>
        )}
        {isActive && (
          <button
            onClick={handleStop}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: '10px',
              background: '#f3f4f6', color: '#374151',
              border: '1px solid #e5e7eb', fontWeight: 600, fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            End session
          </button>
        )}
        {status === 'done' && (
          <button
            onClick={() => setStatus('idle')}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: '10px',
              background: '#f3f4f6', color: '#374151',
              border: '1px solid #e5e7eb', fontWeight: 600, fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            New session
          </button>
        )}
      </div>

      {showSettings && (
        <SettingsDrawer
          keys={keys}
          onSave={handleSaveKeys}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
