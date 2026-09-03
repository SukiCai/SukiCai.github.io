import { useReveal } from '../hooks/useReveal'
import { CONTACT } from '../data/content'

export function Contact() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section className="section contact-section" id="contact">
      <div className="section-inner reveal" ref={ref}>
        <p className="section-label">Contact</p>
        <p className="contact-text">
          Open to conversations about backend systems, AI-assisted engineering, and early-stage teams.
        </p>
        <div className="contact-links">
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.github} target="_blank" rel="noopener">
            {CONTACT.githubLabel}
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener">
            {CONTACT.linkedinLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
