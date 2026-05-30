import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load all env vars without prefix filter so unprefixed vars are available
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      // Explicitly expose only the vars this app needs — nothing else leaks
      'import.meta.env.ACCESS_PASSCODE':     JSON.stringify(env.ACCESS_PASSCODE     ?? ''),
      'import.meta.env.DEEPGRAM_API_KEY':    JSON.stringify(env.DEEPGRAM_API_KEY    ?? ''),
      'import.meta.env.ELEVENLABS_API_KEY':  JSON.stringify(env.ELEVENLABS_API_KEY  ?? ''),
      'import.meta.env.ELEVENLABS_VOICE_ID': JSON.stringify(env.ELEVENLABS_VOICE_ID ?? ''),
      'import.meta.env.ANTHROPIC_API_KEY':   JSON.stringify(env.ANTHROPIC_API_KEY   ?? ''),
      'import.meta.env.GEMINI_API_KEY':      JSON.stringify(env.GEMINI_API_KEY      ?? ''),
    },
  }
})
