import { useEffect, useRef } from 'react'
import { NAV_LINKS } from '../data/content'
import { useLottieLogo } from '../hooks/useLottieLogo'

export function Nav() {
  const logoRef = useRef<HTMLSpanElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useLottieLogo(logoRef)

  useEffect(() => {
    const links = linkRefs.current.filter((el): el is HTMLAnchorElement => el !== null)
    const sections = links
      .map((link) => document.querySelector(link.getAttribute('href') ?? ''))
      .filter((el): el is Element => el !== null)

    if (!sections.length) return

    const setActive = (id: string) => {
      links.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`)
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="nav">
      <span className="nav-brand hero-in" style={{ '--d': '0ms' } as React.CSSProperties}>
        <span className="logo-mark" ref={logoRef} aria-hidden="true"></span>
        <span className="nav-name">Suki Cai</span>
      </span>
      <div className="nav-links hero-in" style={{ '--d': '60ms' } as React.CSSProperties}>
        {NAV_LINKS.map((link, i) => (
          <a key={link.href} href={link.href} data-nav ref={(el) => { linkRefs.current[i] = el }}>
            {link.label}
          </a>
        ))}
        <a href="/resume-suki-cai.pdf" className="nav-resume">
          Résumé
        </a>
      </div>
    </nav>
  )
}
