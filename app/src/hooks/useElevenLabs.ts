import { useRef, useCallback } from 'react'

const TTS_URL = (voiceId: string) =>
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`

type ElevenLabsCallbacks = {
  onStart: () => void
  onEnd: () => void
}

export function useElevenLabs(apiKey: string, voiceId: string, callbacks: ElevenLabsCallbacks) {
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const cbRef = useRef(callbacks)
  cbRef.current = callbacks

  const play = useCallback(
    async (text: string): Promise<void> => {
      const res = await fetch(TTS_URL(voiceId), {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: { stability: 0.4, similarity_boost: 0.8, style: 0.0 },
        }),
      })

      if (!res.ok) throw new Error(`ElevenLabs API ${res.status}`)

      const arrayBuf = await res.arrayBuffer()

      const ctx = new AudioContext()
      ctxRef.current = ctx
      const audioBuf = await ctx.decodeAudioData(arrayBuf)

      const source = ctx.createBufferSource()
      source.buffer = audioBuf
      source.connect(ctx.destination)
      sourceRef.current = source

      cbRef.current.onStart()

      return new Promise((resolve) => {
        source.onended = () => {
          ctx.close()
          ctxRef.current = null
          sourceRef.current = null
          cbRef.current.onEnd()
          resolve()
        }
        source.start()
      })
    },
    [apiKey, voiceId]
  )

  const stop = useCallback(() => {
    try {
      sourceRef.current?.stop()
    } catch {
      // already stopped
    }
    ctxRef.current?.close()
    sourceRef.current = null
    ctxRef.current = null
  }, [])

  return { play, stop }
}
