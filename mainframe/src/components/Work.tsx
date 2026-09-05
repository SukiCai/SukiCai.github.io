import { useReveal } from '../hooks/useReveal'
import { EARLIER_ITEMS, WORK_ITEMS } from '../data/content'
import SpotlightCard from '../bits/SpotlightCard'
import { SectionLabel } from './SectionLabel'
import { useReducedMotion } from '../hooks/useReducedMotion'

function DemoVideo({ src }: { src: string }) {
  return (
    <video
      className="work-demo-video"
      src={src}
      controls
      muted
      playsInline
      preload="metadata"
      controlsList="nodownload"
      onVolumeChange={(e) => {
        const el = e.currentTarget
        if (!el.muted) el.muted = true
        if (el.volume !== 0) el.volume = 0
      }}
    >
      <a href={src}>Watch demo</a>
    </video>
  )
}

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
      {item.demoHref && (
        <p className="work-demo">
          <a
            href={item.demoHref}
            className="inline-arrow-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.demoLabel ?? 'Live demo'}
            <span className="arrow">&rarr;</span>
          </a>
        </p>
      )}
      {item.demoVideo && <DemoVideo src={item.demoVideo} />}
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

  return (
    <li className="earlier-item reveal" ref={ref}>
      <div className="earlier-head">
        <h3>{item.title}</h3>
        <span className="work-meta">{item.meta}</span>
      </div>
      <p>
        {item.line}
        {item.demoHref && (
          <>
            {' '}
            <a
              href={item.demoHref}
              className="inline-arrow-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.demoLabel ?? 'Live demo'}
              <span className="arrow">&rarr;</span>
            </a>
          </>
        )}
      </p>
      {item.demoImage && (
        <img
          className="work-demo-image earlier-demo-image"
          src={item.demoImage}
          alt={item.demoImageAlt ?? ''}
          loading="lazy"
        />
      )}
      {item.demoVideo && <DemoVideo src={item.demoVideo} />}
    </li>
  )
}
