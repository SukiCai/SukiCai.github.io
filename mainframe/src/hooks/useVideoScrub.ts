import { useEffect } from 'react'
import type { RefObject } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

/**
 * Maps pointer X across the viewport to video.currentTime.
 * Seeks are capped to one in-flight decode, and queued on rAF so a busy
 * decoder never gets a seek per mousemove event.
 */
export function useVideoScrub(videoRef: RefObject<HTMLVideoElement | null>, enabled = true) {
  useEffect(() => {
    const video = videoRef.current
    if (!video || !enabled) return
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let targetTime = 0
    let seeking = false
    let raf = 0
    let dirty = false

    const apply = () => {
      raf = 0
      if (!dirty) return
      dirty = false
      const duration = video.duration
      if (!duration || Number.isNaN(duration)) return
      if (seeking) return
      if (Math.abs(video.currentTime - targetTime) < 1 / 48) return
      seeking = true
      video.currentTime = targetTime
    }

    const queue = () => {
      dirty = true
      if (!raf) raf = window.requestAnimationFrame(apply)
    }

    const onSeeked = () => {
      seeking = false
      if (Math.abs(video.currentTime - targetTime) >= 1 / 48) queue()
    }

    const onMove = (e: PointerEvent) => {
      const duration = video.duration
      if (!duration || Number.isNaN(duration)) return
      const x = Math.min(1, Math.max(0, e.clientX / window.innerWidth))
      const fps = 24
      const frame = Math.round(x * Math.max(0, duration * fps - 1))
      targetTime = frame / fps
      queue()
    }

    video.addEventListener('seeked', onSeeked)
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('pointermove', onMove)
    }
  }, [videoRef, enabled])
}
