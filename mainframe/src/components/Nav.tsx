import { useEffect, useState } from 'react'
import { NAV_LINKS } from '../data/content'
import GlassSurface from '../bits/GlassSurface'
import Dock from '../bits/Dock'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Nav() {
  const [open, setOpen] = useState(false)
  const [frosted, setFrosted] = useState(false)
  const [activeHref, setActiveHref] = useState('')
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setFrosted(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = ['top', ...NAV_LINKS.map((link) => link.href.slice(1))]
    const nodes = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible?.target.id) return
        const href = visible.target.id === 'top' ? '' : `#${visible.target.id}`
        setActiveHref(href)
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const { style } = document.body
    const previous = style.overflow
    style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  const links = reduced ? (
    <div className="flex items-center px-2 py-1" role="navigation" aria-label="Sections">
      {NAV_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`rounded-full px-3 py-1.5 text-[14px] lg:text-[15px] ${
            activeHref === link.href ? 'font-medium' : ''
          }`}
        >
          {link.label}
        </a>
      ))}
    </div>
  ) : (
    <Dock items={NAV_LINKS} activeHref={activeHref} />
  )

  return (
    <>
      <nav className="pointer-events-none fixed inset-x-0 top-0 z-10 text-black" style={{ fontFamily: 'var(--font-body)' }}>
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-14 transition-opacity duration-300 ease-out md:hidden ${
            frosted ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          <GlassSurface width="100%" height="100%" borderRadius={0} blur={reduced ? 8 : 18} />
        </div>

        <div className="pointer-events-auto relative z-10 flex items-center justify-between px-5 py-3 md:hidden">
          <a href="#top" className="flex items-center gap-3" onClick={close}>
            <span className="text-[21px] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Suki Cai
            </span>
            <span className="select-none text-[25px] tracking-[-0.02em]" aria-hidden="true">
              ✳︎
            </span>
          </a>
          <button
            type="button"
            className="flex flex-col gap-[5px]"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`h-[2px] w-6 bg-black transition duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
            />
            <span className={`h-[2px] w-6 bg-black transition duration-300 ${open ? 'opacity-0' : ''}`} />
            <span
              className={`h-[2px] w-6 bg-black transition duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
            />
          </button>
        </div>

        <div className="hidden justify-center pt-3 md:flex lg:pt-4">
          <div className="pointer-events-auto">
            <GlassSurface
              width="auto"
              height="auto"
              borderRadius={999}
              blur={20}
              backgroundOpacity={0.5}
              className="overflow-visible shadow-[0_8px_32px_rgba(17,17,26,0.08)]"
              style={{ overflow: 'visible', borderBottom: 'none' }}
            >
              {links}
            </GlassSurface>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-white/95 px-8 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ fontFamily: 'var(--font-body)' }}
        aria-hidden={!open}
      >
        <a href="#top" className="text-[32px] font-medium text-black" onClick={close}>
          Home
        </a>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="text-[32px] font-medium text-black" onClick={close}>
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}
