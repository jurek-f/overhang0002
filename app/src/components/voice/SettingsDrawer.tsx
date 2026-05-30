import { useState } from 'react'
import type { ApiKeys } from '../../types'

type Props = {
  keys: ApiKeys
  onSave: (keys: ApiKeys) => void
  onClose: () => void
}

export function SettingsDrawer({ keys, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<ApiKeys>(keys)

  const field = (
    label: string,
    k: keyof ApiKeys,
    placeholder: string,
    hint?: string
  ) => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#374151' }}>{label}</span>
      <input
        type="password"
        value={draft[k]}
        placeholder={placeholder}
        onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))}
        style={{
          padding: '0.5rem 0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          background: '#fafafa',
          color: '#111',
          outline: 'none',
        }}
      />
      {hint && <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{hint}</span>}
    </label>
  )

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '3rem 1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '14px',
          padding: '1.75rem 2rem', width: '100%', maxWidth: '460px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: '1rem' }}>API Keys</span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#6b7280' }}
          >✕</button>
        </div>

        <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
          Keys are stored in your browser only and sent directly to each provider.
          Nothing passes through a server.
        </p>

        {field('Deepgram API Key', 'deepgram', 'dg_...', 'Used for real-time speech transcription')}
        {field('ElevenLabs API Key', 'elevenlabs', 'sk_...', 'Used for AI voice synthesis')}
        {field('ElevenLabs Voice ID', 'elevenLabsVoiceId', '21m00Tcm4TlvDq8ikWAM', 'Leave as default for Rachel voice')}
        {field('Anthropic API Key', 'anthropic', 'sk-ant-...', 'Required for Sonnet and Haiku models')}
        {field('Google AI API Key', 'gemini', 'AIza...', 'Required for Gemini Flash model')}

        <button
          onClick={() => { onSave(draft); onClose() }}
          style={{
            marginTop: '0.5rem',
            padding: '0.65rem',
            background: '#6366f1', color: '#fff',
            border: 'none', borderRadius: '8px',
            fontWeight: 600, fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Save
        </button>
      </div>
    </div>
  )
}
