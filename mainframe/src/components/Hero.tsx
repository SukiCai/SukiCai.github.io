import { useEffect, useRef } from 'react'
import { ParticleHeading } from './ParticleHeading'
import type { ParticleHeadingHandle } from './ParticleHeading'
import { Terminal } from './Terminal'
import { Nav } from './Nav'
import { useHeroSpotlight } from '../hooks/useHeroSpotlight'
import { HERO_TERMINAL_LINES } from '../data/content'

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<ParticleHeadingHandle>(null)

  useHeroSpotlight(heroRef, spotRef)

  useEffect(() => {
    const start = () => nameRef.current?.play()
    if (document.fonts?.ready) {
      document.fonts.ready.then(start).catch(start)
    } else {
      start()
    }
  }, [])

  return (
    <header className="hero" id="top" ref={heroRef}>
      <div className="hero-glow" aria-hidden="true">
        <span className="orb orb-1"></span>
        <span className="orb orb-2"></span>
      </div>
      <div className="hero-spot" aria-hidden="true" ref={spotRef}></div>

      <Nav />

      <div className="hero-content">
        <p className="eyebrow hero-in" style={{ '--d': '120ms' } as React.CSSProperties}>
          Software Engineer
        </p>

        <ParticleHeading
          ref={nameRef}
          as="h1"
          text="Yufei (Suki) Cai"
          className="hero-in"
          style={{ '--d': '180ms' } as React.CSSProperties}
        />

        <p className="hero-sub hero-in" style={{ '--d': '260ms' } as React.CSSProperties}>
          I build backend systems and rebuild the ones that stopped working. Currently at{' '}
          <strong>Munich Re</strong> in New York, finishing an M.S. in Software Engineering at{' '}
          <strong>UC Berkeley</strong>.
        </p>

        <p className="hero-highlight hero-in" style={{ '--d': '340ms' } as React.CSSProperties}>
          Rebuilt a core enterprise underwriting platform end-to-end in <strong>2 months</strong>, replacing a
          system that took a 15-engineer contractor team roughly <strong>3 years</strong> to build.
        </p>

        <div className="hero-links hero-in" style={{ '--d': '420ms' } as React.CSSProperties}>
          <a href="https://github.com/SukiCai" target="_blank" rel="noopener">
            GitHub ↗
          </a>
          <a href="https://linkedin.com/in/SukiCai" target="_blank" rel="noopener">
            LinkedIn ↗
          </a>
          <a href="mailto:yufeicaimail@gmail.com">Email</a>
        </div>

        <div className="hero-in" style={{ '--d': '500ms' } as React.CSSProperties}>
          <Terminal command="npx install-suki" lines={HERO_TERMINAL_LINES} startDelay={1300} trailingPrompt />
        </div>
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll down">
        <span></span>
      </a>
    </header>
  )
}
