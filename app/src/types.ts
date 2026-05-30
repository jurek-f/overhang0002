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

export type ApiKeys = {
  deepgram: string
  elevenlabs: string
  elevenLabsVoiceId: string
  anthropic: string
  gemini: string
}

export const DEFAULT_KEYS: ApiKeys = {
  deepgram: '',
  elevenlabs: '',
  elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
  anthropic: '',
  gemini: '',
}

export const STORAGE_KEY = 'vvc_api_keys'
export const MODEL_STORAGE_KEY = 'vvc_model'
