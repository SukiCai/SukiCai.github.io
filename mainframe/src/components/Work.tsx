import { useReveal } from '../hooks/useReveal'
import { WORK_ITEMS } from '../data/content'

function WorkArticle({ item }: { item: (typeof WORK_ITEMS)[number] }) {
  const ref = useReveal<HTMLElement>()

  return (
    <article className="work-item reveal" ref={ref}>
      <div className="work-head">
        <h3>{item.title}</h3>
        <span className="work-meta">{item.meta}</span>
      </div>
      <p className="work-stack">{item.stack}</p>
      <p className="work-desc">
        {item.descriptionHtml}
        {item.title === 'Underwriting Platform Rebuild' && (
          <>
            {' '}
            <a href="#writing" className="inline-arrow-link">
              Read the architecture decision behind it<span className="arrow">&rarr;</span>
            </a>
          </>
        )}
      </p>
      {item.result && <p className="work-result">{item.result}</p>}
    </article>
  )
}

export function Work() {
  const labelRef = useReveal<HTMLParagraphElement>()

  return (
    <section className="section" id="work">
      <div className="section-inner">
        <p className="section-label reveal" ref={labelRef}>
          Selected Work
        </p>

        {WORK_ITEMS.map((item) => (
          <WorkArticle key={item.title} item={item} />
        ))}
      </div>
    </section>
  )
}
