/* ---------------- Terminal install animation engine ----------------
 * Types a command into a terminal-styled block, then reveals a checklist
 * of output lines one by one. Shared by the portfolio hero and the
 * standalone landing page. Returns a Promise that resolves once the
 * sequence (including the optional trailing prompt) has finished.
 */

function runTerminalInstall(opts) {
  const {
    cmdEl,
    cursorEl,
    outputEl,
    command,
    lines,
    reducedMotion,
    startDelay = 0,
    trailingPrompt = true,
  } = opts;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, reducedMotion ? 0 : ms));

  function renderLine(line) {
    const el = document.createElement('p');
    el.className = `term-line-out ${line.type}`;
    if (line.type === 'check') {
      el.innerHTML = `<span class="term-check">✓</span>${line.text}`;
    } else {
      el.textContent = line.text;
    }
    outputEl.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
  }

  async function typeCommand() {
    if (reducedMotion) {
      cmdEl.textContent = command;
      return;
    }
    for (const char of command) {
      cmdEl.textContent += char;
      await delay(35 + Math.random() * 35);
    }
  }

  return (async function run() {
    await delay(startDelay);
    await typeCommand();
    await delay(380);
    cursorEl.style.display = 'none';

    for (const line of lines) {
      renderLine(line);
      await delay(line.type === 'check' ? 170 : 260);
    }

    await delay(200);

    if (trailingPrompt) {
      const promptLine = document.createElement('div');
      promptLine.className = 'terminal-line term-line-out';
      promptLine.innerHTML = '<span class="term-prompt">$</span><span class="term-cursor"></span>';
      outputEl.appendChild(promptLine);
      requestAnimationFrame(() => promptLine.classList.add('in'));
      await delay(300);
    }
  })();
}
