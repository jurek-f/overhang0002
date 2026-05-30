import { useRef, useCallback } from 'react'

type VADCallbacks = {
  onSpeechStart: () => void
  onSpeechEnd: () => void
  onBargeIn: () => void
}

export function useVAD(callbacks: VADCallbacks) {
  const ctxRef = useRef<AudioContext | null>(null)
  const nodeRef = useRef<AudioWorkletNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  // Keep callbacks in a ref so the worklet message handler always sees the latest
  const cbRef = useRef(callbacks)
  cbRef.current = callbacks

  const start = useCallback(async (): Promise<MediaStream> => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
    })
    streamRef.current = stream

    const ctx = new AudioContext()
    ctxRef.current = ctx

    // Some browsers start AudioContext in 'suspended' state
    if (ctx.state === 'suspended') await ctx.resume()

    // Absolute URL avoids MIME/path ambiguity with AudioWorklet.addModule
    const workletUrl = `${location.origin}/worklets/vad-processor.js`
    await ctx.audioWorklet.addModule(workletUrl)
    const node = new AudioWorkletNode(ctx, 'vad-processor')
    nodeRef.current = node

    node.port.onmessage = (e) => {
      const { type } = e.data
      if (type === 'speech_start') cbRef.current.onSpeechStart()
      else if (type === 'speech_end') cbRef.current.onSpeechEnd()
      else if (type === 'barge_in') cbRef.current.onBargeIn()
    }

    const source = ctx.createMediaStreamSource(stream)
    source.connect(node)
    // intentionally not connecting node to destination — we don't want mic playback

    return stream
  }, [])

  const stop = useCallback(() => {
    nodeRef.current?.disconnect()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    ctxRef.current?.close()
    nodeRef.current = null
    streamRef.current = null
    ctxRef.current = null
  }, [])

  const setBargeInMode = useCallback((enabled: boolean) => {
    nodeRef.current?.port.postMessage({ type: 'set_barge_in_mode', value: enabled })
  }, [])

  return { start, stop, setBargeInMode }
}
