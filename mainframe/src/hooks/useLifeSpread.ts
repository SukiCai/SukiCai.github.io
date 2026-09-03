import { useEffect } from 'react'
import type { RefObject } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

const PUSH_REACH = 1
const PUSH_DEG = 4.5

/**
 * Hovering (or focusing) a card in the fan nudges its neighbours' rotation
 * outward, like pulling one card free of a hand of cards.
 */
export function useLifeSpread(armRefs: RefObject<(HTMLDivElement | null)[]>) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const arms = armRefs.current.filter((el): el is HTMLDivElement => el !== null)
    if (!arms.length) return

    function setPush(hoveredIndex: number) {
      arms.forEach((arm, i) => {
        const d = i - hoveredIndex
        if (d === 0 || Math.abs(d) > PUSH_REACH) {
          arm.style.setProperty('--push', '0deg')
          return
        }
        const falloff = 1 - (Math.abs(d) - 1) / PUSH_REACH
        const amount = PUSH_DEG * falloff * Math.sign(d)
        arm.style.setProperty('--push', `${amount}deg`)
      })
    }

    function clearPush() {
      arms.forEach((arm) => arm.style.setProperty('--push', '0deg'))
    }

    const cleanups: Array<() => void> = []

    arms.forEach((arm, i) => {
      const card = arm.querySelector<HTMLElement>('.life-card')
      if (!card) return
      const onEnter = () => setPush(i)
      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('focus', onEnter)
      card.addEventListener('mouseleave', clearPush)
      card.addEventListener('blur', clearPush)
      cleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter)
        card.removeEventListener('focus', onEnter)
        card.removeEventListener('mouseleave', clearPush)
        card.removeEventListener('blur', clearPush)
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [armRefs])
}
