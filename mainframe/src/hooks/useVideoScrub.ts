import { useEffect } from 'react'
import type { RefObject } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

/**
 * Maps pointer X across the viewport to video.currentTime.
 * With an all-intra source, seeking every frame is cheap — keep a persistent
 * rAF that always chases the latest target so scrubbing stays continuous.
 */
export function useVideoScrub(videoRef: RefObject<HTMLVideoElement | null>, enabled = true) {
  useEffect(() => {
    const video = videoRef.current
    if (!video || !enabled) return
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let targetTime = 0
    let raf = 0
    let running = false
    let idleTimer = 0
    const FPS = 24
    const FRAME = 1 / FPS

    const stop = () => {
      running = false
      if (raf) {
        window.cancelAnimationFrame(raf)
        raf = 0
      }
    }

    const tick = () => {
      raf = 0
      const duration = video.duration
      if (!duration || Number.isNaN(duration)) {
        if (running) raf = window.requestAnimationFrame(tick)
        return
      }

      // Skip if a seek is still decoding — apply again on the next frame.
      if (!video.seeking) {
        const delta = targetTime - video.currentTime
        if (Math.abs(delta) >= FRAME * 0.4) {
          video.currentTime = targetTime
        }
      }

      if (running) raf = window.requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      raf = window.requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const duration = video.duration
      if (!duration || Number.isNaN(duration)) return
      const x = Math.min(1, Math.max(0, e.clientX / window.innerWidth))
      const frame = Math.round(x * Math.max(0, duration * FPS - 1))
      targetTime = frame * FRAME
      start()
      window.clearTimeout(idleTimer)
      // Keep chasing briefly after the pointer stops so the last seek lands.
      idleTimer = window.setTimeout(stop, 120)
    }

    video.addEventListener('loadedmetadata', () => {
      // Warm the decoder on the first frame so the first scrub isn't cold.
      if (!video.seeking) video.currentTime = 0
    })

    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      window.clearTimeout(idleTimer)
      stop()
      window.removeEventListener('pointermove', onMove)
    }
  }, [videoRef, enabled])
}
