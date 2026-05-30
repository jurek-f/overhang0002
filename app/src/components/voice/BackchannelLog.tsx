import type { BackchannelEvent } from '../../types'

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return m > 0 ? `${m}m${s % 60}s` : `${s}s`
}

export function BackchannelLog({ events }: { events: BackchannelEvent[] }) {
  if (events.length === 0) return null

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.35rem',
        padding: '0.5rem 0',
      }}
    >
      {events.map((ev) => (
        <span
          key={ev.id}
          title={`back-channel at ${formatMs(ev.timestampMs)}`}
          style={{
            fontSize: '0.7rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '999px',
            background: '#ecfdf5',
            color: '#059669',
            border: '1px solid #a7f3d0',
            fontFamily: 'monospace',
          }}
        >
          "{ev.phrase}" · {formatMs(ev.timestampMs)}
        </span>
      ))}
    </div>
  )
}
