import { useEffect, useRef } from 'react'
import type { Turn } from '../../types'

export function TranscriptFeed({
  turns,
  interimText,
}: {
  turns: Turn[]
  interimText: string
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [turns, interimText])

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {turns.map((turn) => (
        <div
          key={turn.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: turn.speaker === 'user' ? 'flex-end' : 'flex-start',
          }}
        >
          <div
            style={{
              maxWidth: '75%',
              padding: '0.6rem 0.9rem',
              borderRadius: turn.speaker === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              background: turn.speaker === 'user' ? '#6366f1' : '#f3f4f6',
              color: turn.speaker === 'user' ? '#fff' : '#111',
              fontSize: '0.9rem',
              lineHeight: 1.5,
            }}
          >
            {turn.text}
            {turn.bargeIn && (
              <span style={{ fontSize: '0.65rem', opacity: 0.6, marginLeft: '0.4rem' }}>
                [interrupted]
              </span>
            )}
          </div>
        </div>
      ))}

      {interimText && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            style={{
              maxWidth: '75%',
              padding: '0.6rem 0.9rem',
              borderRadius: '12px 12px 2px 12px',
              background: '#e0e7ff',
              color: '#4338ca',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              fontStyle: 'italic',
              opacity: 0.8,
            }}
          >
            {interimText}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
