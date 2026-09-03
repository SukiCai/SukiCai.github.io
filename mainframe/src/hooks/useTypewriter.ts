import { useEffect, useState } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

export interface UseTypewriterResult {
  displayed: string
  done: boolean
}

export function useTypewriter(text: string, speed = 38, startDelay = 600, enabled = true): UseTypewriterResult {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setDisplayed('')
      setDone(false)
      return
    }

    if (prefersReducedMotion()) {
      setDisplayed(text)
      setDone(true)
      return
    }

    setDisplayed('')
    setDone(false)
    let i = 0
    let intervalId = 0

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        i += 1
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          window.clearInterval(intervalId)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
    }
  }, [text, speed, startDelay, enabled])

  return { displayed, done }
}
