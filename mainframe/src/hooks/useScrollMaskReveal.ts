import { useEffect } from 'react'
import type { RefObject } from 'react'

export interface ScrollMaskRevealOptions {
  enabled: boolean
  onSettle: () => void
  scrollLength?: number
  smooth?: number
  settle?: number
}

/**
 * Inspired by React Bits Pro's "Scroll Mask": scrolling (or a wheel/touch/
 * key gesture) grows a soft-edged hole in the intro overlay, revealing the
 * real Home page mounted underneath it — no iframe/navigation trick needed
 * since both live in the same app. Once the hole is nearly full-screen,
 * `onSettle` fires once so the caller can unmount the intro and hand off
 * scroll to the normal page.
 */
export function useScrollMaskReveal(stageRef: RefObject<HTMLElement | null>, options: ScrollMaskRevealOptions) {
  const { enabled, onSettle, smooth = 0.16, settle = 0.96 } = options
  const scrollLength = options.scrollLength ?? (typeof window !== 'undefined' ? window.innerHeight * 1.6 : 900)

  useEffect(() => {
    if (!enabled) return
    const stageEl = stageRef.current
    if (!stageEl) return
    const stage = stageEl

    let progress = 0
    let target = 0
    let rafId: number | null = null
    let settled = false
    let touchStartY: number | null = null

    function render(p: number) {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const maxRadius = Math.hypot(vw, vh) / 2 + 24
      const feather = Math.max(28, maxRadius * 0.1)
      const radius = p * maxRadius
      stage.style.setProperty('--reveal-radius', `${radius}px`)
      stage.style.setProperty('--reveal-feather', `${feather}px`)
    }

    function tick() {
      progress += (target - progress) * smooth
      if (Math.abs(target - progress) < 0.0008) progress = target
      render(progress)

      if (progress >= settle && !settled) {
        settled = true
        onSettle()
        rafId = null
        return
      }

      if (progress !== target) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = null
      }
    }

    function nudge(deltaPx: number) {
      if (settled) return
      target = Math.min(1, Math.max(0, target + deltaPx / scrollLength))
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (settled) return
      nudge(e.deltaY)
    }

    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches.length ? e.touches[0].clientY : null
    }

    function onTouchMove(e: TouchEvent) {
      if (touchStartY === null) return
      e.preventDefault()
      const y = e.touches[0].clientY
      if (!settled) nudge((touchStartY - y) * 2.4)
      touchStartY = y
    }

    function onKeydown(e: KeyboardEvent) {
      if (settled) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        nudge(scrollLength * 0.32)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        nudge(scrollLength * -0.32)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKeydown)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeydown)
    }
  }, [enabled, onSettle, scrollLength, smooth, settle, stageRef])
}
