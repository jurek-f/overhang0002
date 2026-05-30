import { useState, useRef, useEffect } from 'react'

export function PasscodeGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const attempt = () => {
    if (value === __ACCESS_PASSCODE__) {
      sessionStorage.setItem('vvc_unlocked', '1')
      onUnlock()
    } else {
      setError(true)
      setValue('')
      setTimeout(() => setError(false), 1400)
    }
  }

  return (
    <div
      style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#fff', fontFamily: 'system-ui, sans-serif',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111', marginBottom: '0.4rem' }}>
          voice vibe coder
        </div>
        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Enter passcode to continue</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: 280 }}>
        <input
          ref={inputRef}
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && attempt()}
          placeholder="Passcode"
          style={{
            padding: '0.7rem 1rem',
            border: `1.5px solid ${error ? '#f87171' : '#e5e7eb'}`,
            borderRadius: '10px',
            fontSize: '1rem',
            textAlign: 'center',
            letterSpacing: '0.15em',
            outline: 'none',
            background: error ? '#fef2f2' : '#fafafa',
            transition: 'border-color 0.2s, background 0.2s',
          }}
        />
        <button
          onClick={attempt}
          style={{
            padding: '0.7rem',
            background: '#6366f1', color: '#fff',
            border: 'none', borderRadius: '10px',
            fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
          }}
        >
          Unlock
        </button>
        {error && (
          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#ef4444' }}>
            Incorrect passcode
          </div>
        )}
      </div>
    </div>
  )
}
