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

export type ApiKeys = {
  deepgram: string
  elevenlabs: string
  elevenLabsVoiceId: string
  anthropic: string
}

export const DEFAULT_KEYS: ApiKeys = {
  deepgram: '',
  elevenlabs: '',
  elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
  anthropic: '',
}

export const STORAGE_KEY = 'vvc_api_keys'
