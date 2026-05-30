import { useRef, useCallback } from 'react'

// Direct WebSocket to Deepgram — no SDK, full browser control
const DG_WS_URL =
  'wss://api.deepgram.com/v1/listen?model=nova-2&language=en-US&smart_format=true&interim_results=true&endpointing=false'

type DeepgramCallbacks = {
  onTranscript: (text: string, isFinal: boolean) => void
}

export function useDeepgram(apiKey: string, callbacks: DeepgramCallbacks) {
  const wsRef = useRef<WebSocket | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const cbRef = useRef(callbacks)
  cbRef.current = callbacks

  const connect = useCallback(
    (stream: MediaStream) => {
      // Deepgram accepts the API key as a WebSocket sub-protocol
      const ws = new WebSocket(DG_WS_URL, ['token', apiKey])
      wsRef.current = ws

      ws.onopen = () => {
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm'
        const recorder = new MediaRecorder(stream, { mimeType })
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) ws.send(e.data)
        }
        recorder.start(200) // 200ms chunks — low latency
        recorderRef.current = recorder
      }

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data)
        if (msg.type !== 'Results') return
        const alt = msg.channel?.alternatives?.[0]
        if (!alt?.transcript) return
        cbRef.current.onTranscript(alt.transcript, msg.is_final ?? false)
      }

      ws.onerror = (e) => console.error('[deepgram] ws error', e)
    },
    [apiKey]
  )

  const disconnect = useCallback(() => {
    recorderRef.current?.stop()
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      // Send CloseStream message before closing
      wsRef.current.send(JSON.stringify({ type: 'CloseStream' }))
      setTimeout(() => wsRef.current?.close(), 300)
    }
    recorderRef.current = null
    wsRef.current = null
  }, [])

  return { connect, disconnect }
}
