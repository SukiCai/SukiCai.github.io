import { useReveal } from '../hooks/useReveal'
import { FIELD_NOTES } from '../data/content'
import BlurText from '../bits/BlurText'
import { SectionLabel } from './SectionLabel'
import { useReducedMotion } from '../hooks/useReducedMotion'

const TITLE_FROM = { filter: 'blur(7px)', opacity: 0, y: 8 }
const TITLE_TO = [
  { filter: 'blur(3px)', opacity: 0.7, y: 2 },
  { filter: 'blur(0px)', opacity: 1, y: 0 },
]

function Note({ note }: { note: (typeof FIELD_NOTES)[number] }) {
  const ref = useReveal<HTMLLIElement>()
  const reduced = useReducedMotion()

  return (
    <li className="field-note reveal" ref={ref}>
      <span className="field-note-n" aria-hidden="true">
        {note.n}
      </span>
      <div>
        {reduced ? (
          <h3>{note.title}</h3>
        ) : (
          <BlurText
            as="h3"
            text={note.title}
            animateBy="words"
            delay={50}
            stepDuration={0.26}
            direction="bottom"
            animationFrom={TITLE_FROM}
            animationTo={TITLE_TO}
          />
        )}
        <p>{note.body}</p>
      </div>
    </li>
  )
}

export function Notes() {
  return (
    <section className="section" id="notes">
      <div className="section-inner">
        <SectionLabel text="Field notes" />
        <ol className="field-notes">
          {FIELD_NOTES.map((note) => (
            <Note key={note.n} note={note} />
          ))}
        </ol>
      </div>
    </section>
  )
}
