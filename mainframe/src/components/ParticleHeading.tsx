import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { createParticleText } from '../lib/particleText'
import type { ParticleTextHandle, ParticleTextOptions } from '../lib/particleText'

export interface ParticleHeadingHandle {
  play(): void
  retarget(): void
}

interface ParticleHeadingProps {
  as: 'h1' | 'p'
  text: string
  className?: string
  style?: CSSProperties
  options?: ParticleTextOptions
}

/**
 * Renders `text` twice: once as real (screen-reader friendly, SEO-visible)
 * text hidden behind `opacity: 0` once particles render, and once as a
 * canvas-driven particle swarm sampled from that same text. Call `.play()`
 * via ref once the caller is ready to reveal it.
 */
export const ParticleHeading = forwardRef<ParticleHeadingHandle, ParticleHeadingProps>(
  ({ as: Tag, text, className, style, options }, ref) => {
    const headingRef = useRef<HTMLElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const handleRef = useRef<ParticleTextHandle | null>(null)

    useEffect(() => {
      if (!headingRef.current || !canvasRef.current) return
      handleRef.current = createParticleText(headingRef.current, canvasRef.current, options)
      return () => handleRef.current?.destroy()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useImperativeHandle(ref, () => ({
      play: () => handleRef.current?.play(),
      retarget: () => handleRef.current?.retarget(),
    }))

    const content = (
      <>
        <span className="particle-name-text">{text}</span>
        <canvas className="particle-canvas" aria-hidden="true" ref={canvasRef} />
      </>
    )

    if (Tag === 'h1') {
      return (
        <h1 ref={headingRef as RefObject<HTMLHeadingElement>} className={className} style={style}>
          {content}
        </h1>
      )
    }

    return (
      <p ref={headingRef as RefObject<HTMLParagraphElement>} className={className} style={style}>
        {content}
      </p>
    )
  }
)

ParticleHeading.displayName = 'ParticleHeading'
