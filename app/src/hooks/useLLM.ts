import { useCallback } from 'react'
import { SYSTEM_PROMPT, buildMessages } from '../prompts/stage1'
import type { Turn, StageOutput, ApiKeys, LLMModel } from '../types'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const GEMINI_URL = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

const ANTHROPIC_MODEL: Record<LLMModel, string | null> = {
  sonnet: 'claude-sonnet-4-6',
  haiku: 'claude-haiku-4-5-20251001',
  'gemini-flash': null,
}

async function callAnthropic(
  apiKey: string,
  modelId: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  system: string,
  maxTokens: number
): Promise<string> {
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-allow-browser': 'true',
    },
    body: JSON.stringify({ model: modelId, max_tokens: maxTokens, system, messages }),
  })
  if (!res.ok) throw new Error(`Anthropic API ${res.status}`)
  const data = await res.json()
  return data.content?.[0]?.text ?? ''
}

async function callGemini(
  apiKey: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  system: string,
  maxTokens: number
): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  const res = await fetch(GEMINI_URL('gemini-2.0-flash'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { maxOutputTokens: maxTokens },
    }),
  })
  if (!res.ok) throw new Error(`Gemini API ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

export function useLLM(keys: ApiKeys, model: LLMModel) {
  const sendTurn = useCallback(
    async (turns: Turn[]): Promise<string> => {
      const messages = buildMessages(turns)
      if (!messages.length) {
        messages.push({ role: 'user', content: "I have a product idea I'd like to think through." })
      }
      if (model === 'gemini-flash') {
        return callGemini(keys.gemini, messages, SYSTEM_PROMPT, 120)
      }
      return callAnthropic(keys.anthropic, ANTHROPIC_MODEL[model]!, messages, SYSTEM_PROMPT, 120)
    },
    [keys, model]
  )

  const extractStageOutput = useCallback(
    async (turns: Turn[]): Promise<StageOutput> => {
      const transcript = turns
        .map((t) => `${t.speaker === 'user' ? 'User' : 'AI'}: ${t.text}`)
        .join('\n')
      const extractSystem =
        'Extract structured output from this product brainstorm conversation. Respond with JSON only, no markdown. Schema: { "problem": string, "rawIdeas": string[], "landscapeNotes": string }'
      const msgs = [{ role: 'user' as const, content: transcript }]

      let text: string
      if (model === 'gemini-flash') {
        text = await callGemini(keys.gemini, msgs, extractSystem, 500)
      } else {
        text = await callAnthropic(keys.anthropic, ANTHROPIC_MODEL[model]!, msgs, extractSystem, 500)
      }

      // Strip markdown code fences if present
      const clean = text.replace(/^```json?\s*/i, '').replace(/\s*```$/, '').trim()
      try {
        return JSON.parse(clean)
      } catch {
        return { problem: '', rawIdeas: [], landscapeNotes: '' }
      }
    },
    [keys, model]
  )

  return { sendTurn, extractStageOutput }
}
