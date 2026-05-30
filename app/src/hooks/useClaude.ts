import { useCallback } from 'react'
import { SYSTEM_PROMPT, buildMessages } from '../prompts/stage1'
import type { Turn, StageOutput } from '../types'

const CLAUDE_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'

export function useClaude(apiKey: string) {
  const sendTurn = useCallback(
    async (turns: Turn[]): Promise<string> => {
      const messages = buildMessages(turns)
      if (messages.length === 0) {
        messages.push({ role: 'user', content: "I have a product idea I'd like to think through." })
      }

      const res = await fetch(CLAUDE_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 120,
          system: SYSTEM_PROMPT,
          messages,
        }),
      })

      if (!res.ok) throw new Error(`Claude API ${res.status}`)
      const data = await res.json()
      return data.content?.[0]?.text ?? ''
    },
    [apiKey]
  )

  const extractStageOutput = useCallback(
    async (turns: Turn[]): Promise<StageOutput> => {
      const transcript = turns
        .map((t) => `${t.speaker === 'user' ? 'User' : 'AI'}: ${t.text}`)
        .join('\n')

      const res = await fetch(CLAUDE_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 500,
          system: 'Extract structured output from this product brainstorm conversation. Respond with JSON only, no markdown. Schema: { "problem": string, "rawIdeas": string[], "landscapeNotes": string }',
          messages: [{ role: 'user', content: transcript }],
        }),
      })

      if (!res.ok) throw new Error(`Claude API ${res.status}`)
      const data = await res.json()
      const text = data.content?.[0]?.text ?? '{}'
      try {
        return JSON.parse(text)
      } catch {
        return { problem: '', rawIdeas: [], landscapeNotes: '' }
      }
    },
    [apiKey]
  )

  return { sendTurn, extractStageOutput }
}
