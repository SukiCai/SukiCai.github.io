import { useReveal } from '../hooks/useReveal'
import { WRITING_POST } from '../data/content'

function RevealP({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useReveal<HTMLParagraphElement>()
  return (
    <p className={`reveal ${className ?? ''}`.trim()} ref={ref}>
      {children}
    </p>
  )
}

export function Writing() {
  const labelRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()

  return (
    <section className="section" id="writing">
      <div className="section-inner">
        <p className="section-label reveal" ref={labelRef}>
          Writing
        </p>

        <article className="post">
          <h3 className="reveal" ref={titleRef}>
            {WRITING_POST.title}
          </h3>
          <RevealP className="post-meta">{WRITING_POST.meta}</RevealP>

          {WRITING_POST.paragraphs.map((paragraph) => (
            <RevealP key={paragraph.slice(0, 24)}>{paragraph}</RevealP>
          ))}
        </article>
      </div>
    </section>
  )
}
