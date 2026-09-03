import { useEffect, useState } from 'react'
import { CopyIcon } from './CopyIcon'
import { useTypewriter } from '../hooks/useTypewriter'
import { CONTACT, HERO } from '../data/content'

export function Hero({ active = true }: { active?: boolean }) {
  const { displayed, done } = useTypewriter(HERO.typewriter, 38, 600, active)
  const [pillsVisible, setPillsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!active) {
      setPillsVisible(false)
      return
    }
    const id = window.setTimeout(() => setPillsVisible(true), 400)
    return () => window.clearTimeout(id)
  }, [active])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard can fail without a secure context; the mailto pill still works.
    }
  }

  return (
    <section
      id="top"
      className="relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#d2ccc2]/70 via-[#d2ccc2]/20 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mt-auto max-w-xl md:mt-0">
        <p
          className="mb-2 text-black"
          style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 4.2vw, 32px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}
        >
          {HERO.name}
        </p>
        <p
          className="mb-1 text-black/80"
          style={{ fontSize: 'clamp(16px, 2.8vw, 20px)', lineHeight: 1.35, fontWeight: 400 }}
        >
          {HERO.headline}
        </p>
        <p
          className="mb-5 text-black/60 sm:mb-6"
          style={{ fontSize: 'clamp(14px, 2.4vw, 17px)', lineHeight: 1.4, fontWeight: 400 }}
        >
          {HERO.subhead}
        </p>

        <p
          className="mb-5 min-h-[72px] text-black sm:mb-6"
          style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.35, fontWeight: 400 }}
        >
          {displayed}
          {!done && (
            <span className="ml-[2px] inline-block h-[1.1em] w-[2px] align-middle bg-black [animation:blink_1s_step-end_infinite]" />
          )}
        </p>

        <div
          className={`flex flex-wrap gap-y-1 transition-[opacity,transform] duration-[400ms] ease-out ${
            pillsVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          {HERO.pills.map((pill) => (
            <a
              key={pill.href}
              href={pill.href}
              {...(pill.external ? { target: '_blank', rel: 'noopener' } : {})}
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px] active:scale-[0.97]"
            >
              {pill.label}
            </a>
          ))}

          <button
            type="button"
            onClick={copyEmail}
            className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:gap-3 sm:px-5 sm:text-[15px] active:scale-[0.97]"
            aria-label={copied ? 'Email copied' : `Copy ${CONTACT.email}`}
          >
            <span>
              {copied ? 'Copied' : 'Email'}: <span className="underline underline-offset-1">{CONTACT.email}</span>
            </span>
            <CopyIcon />
          </button>
        </div>
      </div>
    </section>
  )
}
