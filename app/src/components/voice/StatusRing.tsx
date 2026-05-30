import type { SessionStatus } from '../../types'

const CONFIG: Record<SessionStatus, { label: string; color: string; pulse: boolean }> = {
  idle:          { label: 'Ready',         color: '#d1d5db', pulse: false },
  connecting:    { label: 'Connecting…',   color: '#fbbf24', pulse: true  },
  listening:     { label: 'Listening',     color: '#6366f1', pulse: true  },
  user_speaking: { label: 'Listening',     color: '#6366f1', pulse: false },
  thinking:      { label: 'Thinking…',     color: '#8b5cf6', pulse: true  },
  ai_speaking:   { label: 'Speaking',      color: '#10b981', pulse: false },
  done:          { label: 'Done',          color: '#d1d5db', pulse: false },
}

export function StatusRing({ status }: { status: SessionStatus }) {
  const { label, color, pulse } = CONFIG[status]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: `3px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: pulse ? `0 0 0 0 ${color}40` : 'none',
          animation: pulse ? 'ring-pulse 1.6s ease-out infinite' : 'none',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: color,
            transition: 'background 0.3s',
            opacity: status === 'user_speaking' ? 1 : 0.6,
            transform: status === 'user_speaking' ? 'scale(1.3)' : 'scale(1)',
          }}
        />
      </div>
      <span style={{ fontSize: '0.75rem', color: '#6b7280', letterSpacing: '0.05em' }}>
        {label.toUpperCase()}
      </span>

      <style>{`
        @keyframes ring-pulse {
          0%   { box-shadow: 0 0 0 0 ${color}50; }
          70%  { box-shadow: 0 0 0 14px ${color}00; }
          100% { box-shadow: 0 0 0 0 ${color}00; }
        }
      `}</style>
    </div>
  )
}
