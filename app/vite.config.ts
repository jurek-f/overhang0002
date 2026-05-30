import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load all env vars without prefix filter so unprefixed vars are available
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      // Plain globals — Vite owns import.meta.env and ignores define keys that use that prefix
      __ACCESS_PASSCODE__:     JSON.stringify(env.ACCESS_PASSCODE     ?? ''),
      __DEEPGRAM_API_KEY__:    JSON.stringify(env.DEEPGRAM_API_KEY    ?? ''),
      __ELEVENLABS_API_KEY__:  JSON.stringify(env.ELEVENLABS_API_KEY  ?? ''),
      __ELEVENLABS_VOICE_ID__: JSON.stringify(env.ELEVENLABS_VOICE_ID ?? ''),
      __ANTHROPIC_API_KEY__:   JSON.stringify(env.ANTHROPIC_API_KEY   ?? ''),
      __GEMINI_API_KEY__:      JSON.stringify(env.GEMINI_API_KEY      ?? ''),
    },
  }
})
