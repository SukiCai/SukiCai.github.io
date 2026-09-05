import { CONTACT } from '../data/content'
import ScrollReveal from '../bits/ScrollReveal'
import { SectionLabel } from './SectionLabel'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Contact() {
  const reduced = useReducedMotion()

  return (
    <section className="section contact-section" id="contact">
      <div className="section-inner">
        <SectionLabel text="Contact" />
        {reduced ? (
          <p className="contact-text">{CONTACT.line}</p>
        ) : (
          <ScrollReveal
            textClassName="contact-text"
            enableBlur={false}
            baseOpacity={0.3}
            baseRotation={0}
            rotationEnd="top 70%"
            wordAnimationEnd="top 60%"
          >
            {CONTACT.line}
          </ScrollReveal>
        )}
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
