import { useEffect } from 'react'
import type { RefObject } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

/** Cursor-tracking ambient glow that follows the pointer within the hero. */
export function useHeroSpotlight(heroRef: RefObject<HTMLElement | null>, spotRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const hero = heroRef.current
    const spot = spotRef.current
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!hero || !spot || !canHover || prefersReducedMotion()) return

    let ticking = false
    let lastEvent: MouseEvent | null = null

    const onMouseMove = (e: MouseEvent) => {
      lastEvent = e
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect()
          if (lastEvent) {
            spot.style.setProperty('--mx', `${lastEvent.clientX - rect.left}px`)
            spot.style.setProperty('--my', `${lastEvent.clientY - rect.top}px`)
          }
          ticking = false
        })
      }
    }

    hero.addEventListener('mousemove', onMouseMove)
    return () => hero.removeEventListener('mousemove', onMouseMove)
  }, [heroRef, spotRef])
}
