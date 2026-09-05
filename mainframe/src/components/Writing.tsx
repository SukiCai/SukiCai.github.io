import { WRITING_POSTS } from '../data/content'
import BlurText from '../bits/BlurText'
import ScrollReveal from '../bits/ScrollReveal'
import { SectionLabel } from './SectionLabel'
import { useReducedMotion } from '../hooks/useReducedMotion'

const TITLE_FROM = { filter: 'blur(8px)', opacity: 0, y: 12 }
const TITLE_TO = [
  { filter: 'blur(3px)', opacity: 0.65, y: 3 },
  { filter: 'blur(0px)', opacity: 1, y: 0 },
]

export function Writing() {
  const reduced = useReducedMotion()

  return (
    <section className="section" id="writing">
      <div className="section-inner">
        <SectionLabel text="Longer" />

        {WRITING_POSTS.map((post) => (
          <article className="post" key={post.title} id={'id' in post ? post.id : undefined}>
            {reduced ? (
              <h3>{post.title}</h3>
            ) : (
              <BlurText
                as="h3"
                text={post.title}
                animateBy="words"
                delay={45}
                stepDuration={0.26}
                direction="bottom"
                animationFrom={TITLE_FROM}
                animationTo={TITLE_TO}
              />
            )}
            {reduced ? (
              <p className="post-meta">{post.meta}</p>
            ) : (
              <ScrollReveal
                textClassName="post-meta"
                enableBlur={false}
                baseOpacity={0.35}
                baseRotation={0}
                rotationEnd="top 70%"
                wordAnimationEnd="top 58%"
              >
                {post.meta}
              </ScrollReveal>
            )}
            {post.paragraphs.map((paragraph) =>
              reduced ? (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ) : (
                <ScrollReveal
                  key={paragraph.slice(0, 24)}
                  enableBlur={false}
                  baseOpacity={0.22}
                  baseRotation={0}
                  rotationEnd="top 52%"
                  wordAnimationEnd="top 42%"
                >
                  {paragraph}
                </ScrollReveal>
              ),
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
