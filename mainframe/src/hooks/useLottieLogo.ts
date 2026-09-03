import { useEffect } from 'react'
import type { RefObject } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

interface LottieAnimationItem {
  addEventListener(event: string, cb: () => void): void
  goToAndStop(value: number, isFrame?: boolean): void
  destroy(): void
}

interface LottieGlobal {
  loadAnimation(params: {
    container: Element
    renderer: 'svg'
    loop: boolean
    autoplay: boolean
    path: string
  }): LottieAnimationItem
}

declare global {
  interface Window {
    lottie?: LottieGlobal
  }
}

/** Loads the small animated spark mark (via lottie-web, script tag in index.html) into the nav logo. */
export function useLottieLogo(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || !window.lottie) return

    const reducedMotion = prefersReducedMotion()
    const anim = window.lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: !reducedMotion,
      autoplay: true,
      path: '/spark.json',
    })

    if (reducedMotion) {
      anim.addEventListener('DOMLoaded', () => anim.goToAndStop(0, true))
    }

    return () => anim.destroy()
  }, [ref])
}
