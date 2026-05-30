import { useRef, useCallback, useEffect } from 'react'
import type { BackchannelEvent } from '../types'

const PHRASES = ['mmhm', 'right', 'i-see', 'go-on', 'yeah', 'oh-interesting', 'really', 'interesting']
// Back-channel fires between MIN_MS and MAX_MS after speech starts
const MIN_MS = 5000
const MAX_MS = 11000

type BackchannelCallbacks = {
  onBackchannel: (event: BackchannelEvent) => void
}

export function useBackchannel(callbacks: BackchannelCallbacks) {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const speakingRef = useRef(false)
  const sessionStartRef = useRef(0)
  const cbRef = useRef(callbacks)
  cbRef.current = callbacks

  // Pre-load all clips on mount
  useEffect(() => {
    const ctx = new AudioContext()
    audioCtxRef.current = ctx

    PHRASES.forEach(async (phrase) => {
      try {
        const res = await fetch(`/audio/backchannel/${phrase}.mp3`)
        if (!res.ok) return
        const buf = await res.arrayBuffer()
        const decoded = await ctx.decodeAudioData(buf)
        buffersRef.current.set(phrase, decoded)
      } catch {
        // clip not found — graceful degradation, no back-channel for this phrase
      }
    })

    return () => {
      ctx.close()
      audioCtxRef.current = null
    }
  }, [])

  const _playClip = useCallback((phrase: string) => {
    const ctx = audioCtxRef.current
    const buf = buffersRef.current.get(phrase)
    if (!ctx || !buf) return

    const source = ctx.createBufferSource()
    source.buffer = buf
    source.connect(ctx.destination)
    source.start()

    cbRef.current.onBackchannel({
      id: crypto.randomUUID(),
      phrase,
      timestampMs: Date.now() - sessionStartRef.current,
    })
  }, [])

  const _scheduleBackchannel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const delay = MIN_MS + Math.random() * (MAX_MS - MIN_MS)
    timerRef.current = setTimeout(() => {
      if (speakingRef.current) {
        const available = PHRASES.filter((p) => buffersRef.current.has(p))
        if (available.length > 0) {
          const phrase = available[Math.floor(Math.random() * available.length)]
          _playClip(phrase)
        }
      }
    }, delay)
  }, [_playClip])

  const onSpeechStart = useCallback(() => {
    speakingRef.current = true
    _scheduleBackchannel()
  }, [_scheduleBackchannel])

  const onSpeechEnd = useCallback(() => {
    speakingRef.current = false
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startSession = useCallback(() => {
    sessionStartRef.current = Date.now()
  }, [])

  const stopSession = useCallback(() => {
    speakingRef.current = false
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return { onSpeechStart, onSpeechEnd, startSession, stopSession }
}
