import { useEffect, useState } from 'react'
import { NAV_LINKS } from '../data/content'

export function Nav() {
  const [open, setOpen] = useState(false)

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

  return (
    <>
      <nav
        className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 text-black sm:px-8 sm:py-5"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <a href="#top" className="flex items-center gap-3" onClick={close}>
          <span className="text-[21px] tracking-tight sm:text-[26px]" style={{ fontFamily: 'var(--font-heading)' }}>
            Suki Cai
          </span>
          <span className="select-none text-[25px] tracking-[-0.02em] sm:text-[30px]" aria-hidden="true">
            ✳︎
          </span>
        </a>

        <div className="hidden text-[23px] md:flex">
          {NAV_LINKS.map((link, i) => (
            <span key={link.href}>
              {i > 0 && <span>, </span>}
              <a href={link.href} className="transition-opacity hover:opacity-60">
                {link.label}
              </a>
            </span>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden text-[23px] underline underline-offset-2 transition-opacity hover:opacity-60 md:inline"
        >
          Email
        </a>

        <button
          type="button"
          className="flex flex-col gap-[5px] md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-[2px] w-6 bg-black transition duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
          />
          <span
            className={`h-[2px] w-6 bg-black transition duration-300 ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`h-[2px] w-6 bg-black transition duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
          />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-white/95 px-8 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ fontFamily: 'var(--font-body)' }}
        aria-hidden={!open}
      >
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="text-[32px] font-medium text-black" onClick={close}>
            {link.label}
          </a>
        ))}
        <a href="#contact" className="text-[32px] font-medium text-black underline underline-offset-2" onClick={close}>
          Email
        </a>
      </div>
    </>
  )
}
