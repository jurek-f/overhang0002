import type { StageOutput } from '../../types'

export function StageOutputPanel({ output }: { output: StageOutput }) {
  return (
    <div
      style={{
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        fontSize: '0.875rem',
        lineHeight: 1.7,
        color: '#111',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#4f46e5' }}>
        Stage 1 Output
      </div>

      {output.problem && (
        <section style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Problem</div>
          <div style={{ color: '#4b5563' }}>{output.problem}</div>
        </section>
      )}

      {output.rawIdeas.length > 0 && (
        <section style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Ideas</div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#4b5563' }}>
            {output.rawIdeas.map((idea, i) => (
              <li key={i}>{idea}</li>
            ))}
          </ul>
        </section>
      )}

      {output.landscapeNotes && (
        <section>
          <div style={{ fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
            Landscape
          </div>
          <div style={{ color: '#4b5563' }}>{output.landscapeNotes}</div>
        </section>
      )}
    </div>
  )
}
