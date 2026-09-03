import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Terminal } from './Terminal'
import { ParticleHeading } from './ParticleHeading'
import type { ParticleHeadingHandle } from './ParticleHeading'
import { useScrollMaskReveal } from '../hooks/useScrollMaskReveal'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

// three.js is only ever needed for this one-time intro, so keep it out of
// the main bundle that Home (the page people actually stay on) has to load.
const LandscapeScene = lazy(() => import('./LandscapeScene').then((m) => ({ default: m.LandscapeScene })))
import { INTRO_TERMINAL_LINES } from '../data/content'

interface IntroSequenceProps {
  onComplete: () => void
}

/**
 * The full-screen entry sequence: a terminal "install" animation crossfades
 * into a big particle-text greeting. From there, scrolling (or a wheel/
 * touch/key gesture) grows a soft hole in this overlay revealing the real
 * Home page mounted underneath — once that hole is big enough, `onComplete`
 * unmounts this and hands scroll off to the normal page. The hint button is
 * also a plain click-through shortcut for reduced-motion / keyboard users.
 */
export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const greetRef = useRef<ParticleHeadingHandle>(null)
  const signatureRef = useRef<ParticleHeadingHandle>(null)
  const settledRef = useRef(false)

  const [isGreeting, setIsGreeting] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [maskEnabled, setMaskEnabled] = useState(false)

  const reducedMotion = prefersReducedMotion()

  // Home is really mounted underneath this overlay (unlike the old two-page
  // version, where the destination was just a hidden iframe preview), so
  // background scroll needs to be locked explicitly while the intro is up.
  useEffect(() => {
    const { style } = document.body
    const previous = style.overflow
    style.overflow = 'hidden'
    return () => {
      style.overflow = previous
    }
  }, [])

  const settle = () => {
    if (settledRef.current) return
    settledRef.current = true
    onComplete()
  }

  useScrollMaskReveal(stageRef, { enabled: maskEnabled && !reducedMotion, onSettle: settle })

  async function handleTerminalComplete() {
    const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, reducedMotion ? 0 : ms))

    await wait(650)
    // Both particle clouds are sampled + started *before* the greeting is
    // ever revealed (the container is still opacity:0 here), so there's
    // never a frame where flat, non-particle text shows once the crossfade
    // begins — the reveal reads as one continuous motion.
    greetRef.current?.play()
    await wait(180)
    signatureRef.current?.play()
    await wait(reducedMotion ? 0 : 120)
    setIsGreeting(true)

    await wait(1350)
    setHintVisible(true)
    setMaskEnabled(true)
  }

  return (
    <div className={`intro-stage ${isGreeting ? 'is-greeting' : ''}`.trim()} ref={stageRef}>
      <Suspense fallback={null}>
        <LandscapeScene />
      </Suspense>

      <div className="intro-terminal-wrap">
        <Terminal
          command="npx install-suki"
          lines={INTRO_TERMINAL_LINES}
          startDelay={500}
          trailingPrompt={false}
          onComplete={handleTerminalComplete}
        />
      </div>

      <div className="intro-greeting">
        <ParticleHeading
          ref={greetRef}
          as="p"
          text="Nice to meet you,"
          className="intro-greeting-line"
          options={{ density: 1.2, sizeScale: 0.7 }}
        />
        <ParticleHeading ref={signatureRef} as="h1" text="I'm Suki" className="intro-signature-line" />

        <button
          type="button"
          className={`intro-scroll-hint ${hintVisible ? 'is-visible' : ''}`.trim()}
          onClick={settle}
        >
          <span className="scroll-hint-mouse" aria-hidden="true"></span>
          Scroll to step in
        </button>
      </div>
    </div>
  )
}
