import { useEffect, useRef } from 'react'
import { runTerminalInstall } from '../lib/terminalInstall'
import type { TerminalLine } from '../lib/terminalInstall'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

interface TerminalProps {
  command: string
  lines: TerminalLine[]
  startDelay?: number
  trailingPrompt?: boolean
  onComplete?: () => void
  className?: string
}

export function Terminal({ command, lines, startDelay = 0, trailingPrompt = true, onComplete, className }: TerminalProps) {
  const cmdRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cmdRef.current || !cursorRef.current || !outputRef.current) return
    let cancelled = false

    runTerminalInstall({
      cmdEl: cmdRef.current,
      cursorEl: cursorRef.current,
      outputEl: outputRef.current,
      command,
      lines,
      reducedMotion: prefersReducedMotion(),
      startDelay,
      trailingPrompt,
      cancelled: () => cancelled,
    }).then(() => {
      if (!cancelled) onComplete?.()
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`terminal ${className ?? ''}`.trim()} aria-hidden="true">
      <div className="terminal-bar">
        <span className="term-dot term-dot-red" />
        <span className="term-dot term-dot-yellow" />
        <span className="term-dot term-dot-green" />
        <span className="terminal-title">zsh — suki</span>
      </div>
      <div className="terminal-body">
        <div className="terminal-line">
          <span className="term-prompt">$</span>
          <span className="term-cmd" ref={cmdRef}></span>
          <span className="term-cursor" ref={cursorRef}></span>
        </div>
        <div className="term-output" ref={outputRef}></div>
      </div>
    </div>
  )
}
