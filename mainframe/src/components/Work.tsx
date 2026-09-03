import { useReveal } from '../hooks/useReveal'
import { EARLIER_ITEMS, WORK_ITEMS } from '../data/content'
import SpotlightCard from '../bits/SpotlightCard'
import { SectionLabel } from './SectionLabel'
import { useReducedMotion } from '../hooks/useReducedMotion'

function WorkArticle({ item }: { item: (typeof WORK_ITEMS)[number] }) {
  const ref = useReveal<HTMLElement>()
  const reduced = useReducedMotion()

  const body = (
    <>
      <div className="work-head">
        <h3>{item.title}</h3>
        <span className="work-meta">{item.meta}</span>
      </div>
      <p className="work-stack">{item.stack}</p>
      <p className="work-desc">
        {item.description}
        {item.noteHref && (
          <>
            {' '}
            <a href={item.noteHref} className="inline-arrow-link">
              {item.noteLabel}
              <span className="arrow">&rarr;</span>
            </a>
          </>
        )}
      </p>
      {item.result && <p className="work-result">{item.result}</p>}
    </>
  )

  return (
    <article className="work-item reveal" ref={ref}>
      {reduced ? (
        body
      ) : (
        <SpotlightCard className="work-spotlight" spotlightColor="rgba(47, 95, 219, 0.14)">
          {body}
        </SpotlightCard>
      )}
    </article>
  )
}

export function Work() {
  return (
    <section className="section" id="work">
      <div className="section-inner">
        <SectionLabel text="Selected Work" />

        {WORK_ITEMS.map((item) => (
          <WorkArticle key={item.title} item={item} />
        ))}

        <EarlierWork />
      </div>
    </section>
  )
}

function EarlierWork() {
  return (
    <div className="earlier-work">
      <SectionLabel text="Earlier" />
      <ul className="earlier-list">
        {EARLIER_ITEMS.map((item) => (
          <EarlierRow key={item.title} item={item} />
        ))}
      </ul>
    </div>
  )
}

function EarlierRow({ item }: { item: (typeof EARLIER_ITEMS)[number] }) {
  const ref = useReveal<HTMLLIElement>()
  const reduced = useReducedMotion()
  const body = (
    <>
      <div className="earlier-head">
        <h3>{item.title}</h3>
        <span className="work-meta">{item.meta}</span>
      </div>
      <p>{item.line}</p>
    </>
  )

  return (
    <li className="earlier-item reveal" ref={ref}>
      {reduced ? (
        body
      ) : (
        <SpotlightCard className="work-spotlight" spotlightColor="rgba(47, 95, 219, 0.1)">
          {body}
        </SpotlightCard>
      )}
    </li>
  )
}
