/* ---------------- Terminal install animation engine ----------------
 * Types a command into a terminal-styled block, then reveals a checklist
 * of output lines one by one. Shared by the hero terminal and the intro
 * sequence. Returns a Promise that resolves once the sequence (including
 * the optional trailing prompt) has finished.
 */

export interface TerminalLine {
  type: 'dim' | 'check' | 'muted' | 'success'
  text: string
}

export interface RunTerminalInstallOptions {
  cmdEl: HTMLElement
  cursorEl: HTMLElement
  outputEl: HTMLElement
  command: string
  lines: TerminalLine[]
  reducedMotion: boolean
  startDelay?: number
  trailingPrompt?: boolean
  /** Checked before every DOM mutation so an unmount (or React StrictMode's
   * dev-only double-invoke) can cleanly abort an in-flight run. */
  cancelled?: () => boolean
}

export function runTerminalInstall(opts: RunTerminalInstallOptions): Promise<void> {
  const {
    cmdEl,
    cursorEl,
    outputEl,
    command,
    lines,
    reducedMotion,
    startDelay = 0,
    trailingPrompt = true,
    cancelled = () => false,
  } = opts

  const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, reducedMotion ? 0 : ms))

  function renderLine(line: TerminalLine) {
    const el = document.createElement('p')
    el.className = `term-line-out ${line.type}`
    if (line.type === 'check') {
      el.innerHTML = `<span class="term-check">✓</span>${line.text}`
    } else {
      el.textContent = line.text
    }
    outputEl.appendChild(el)
    requestAnimationFrame(() => el.classList.add('in'))
  }

  async function typeCommand() {
    if (reducedMotion) {
      cmdEl.textContent = command
      return
    }
    for (const char of command) {
      if (cancelled()) return
      cmdEl.textContent += char
      await delay(35 + Math.random() * 35)
    }
  }

  return (async function run() {
    await delay(startDelay)
    if (cancelled()) return
    await typeCommand()
    if (cancelled()) return
    await delay(380)
    if (cancelled()) return
    cursorEl.style.display = 'none'

    for (const line of lines) {
      if (cancelled()) return
      renderLine(line)
      await delay(line.type === 'check' ? 170 : 260)
    }

    if (cancelled()) return
    await delay(200)

    if (trailingPrompt && !cancelled()) {
      const promptLine = document.createElement('div')
      promptLine.className = 'terminal-line term-line-out'
      promptLine.innerHTML = '<span class="term-prompt">$</span><span class="term-cursor"></span>'
      outputEl.appendChild(promptLine)
      requestAnimationFrame(() => promptLine.classList.add('in'))
      await delay(300)
    }
  })()
}
