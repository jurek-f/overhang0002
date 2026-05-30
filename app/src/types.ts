export type SessionStatus =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'user_speaking'
  | 'thinking'
  | 'ai_speaking'
  | 'done'

export type BackchannelEvent = {
  id: string
  phrase: string
  timestampMs: number
}

export type Turn = {
  id: string
  speaker: 'user' | 'ai'
  text: string
  backchannels?: BackchannelEvent[]
  bargeIn?: boolean
}

export type StageOutput = {
  problem: string
  rawIdeas: string[]
  landscapeNotes: string
}

export type LLMModel = 'sonnet' | 'haiku' | 'gemini-flash'

export const MODEL_LABELS: Record<LLMModel, string> = {
  sonnet: 'Sonnet 4.6',
  haiku: 'Haiku 4.5',
  'gemini-flash': 'Gemini 2.0 Flash',
}

export const MODEL_STORAGE_KEY = 'vvc_model'
