import { useReveal } from '../hooks/useReveal'

export function About() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section className="section" id="about">
      <div className="section-inner reveal" ref={ref}>
        <p className="section-label">About</p>
        <p className="about-text">
          I like systems with clear ownership boundaries and code that survives contact with real users. Most of
          my work has been in insurance and financial infrastructure &mdash; multi-tenant platforms, background job
          systems, and the unglamorous plumbing that keeps enterprise software honest under load. Lately I've been
          building with AI-assisted workflows (Claude Code, MCP) to move faster without giving up architectural
          ownership &mdash; the tools write more code, I still make the decisions.
        </p>
      </div>
    </section>
  )
}
