import { ABOUT } from '../data/content'
import CountUp from '../bits/CountUp'
import ScrollReveal from '../bits/ScrollReveal'
import { SectionLabel } from './SectionLabel'
import { useReducedMotion } from '../hooks/useReducedMotion'

function splitStat(value: string): { n: number | null; rest: string } {
  const match = value.match(/^(\d+)(.*)$/)
  if (!match) return { n: null, rest: value }
  return { n: Number(match[1]), rest: match[2] }
}

export function About() {
  const reduced = useReducedMotion()

  return (
    <section className="section" id="about">
      <div className="section-inner">
        <SectionLabel text="About" />
        {ABOUT.paragraphs.map((paragraph) =>
          reduced ? (
            <p className="about-text" key={paragraph.slice(0, 32)}>
              {paragraph}
            </p>
          ) : (
            <ScrollReveal
              key={paragraph.slice(0, 32)}
              textClassName="about-text"
              enableBlur
              baseOpacity={0.28}
              baseRotation={0.6}
              blurStrength={2.4}
              rotationEnd="top 55%"
              wordAnimationEnd="top 45%"
            >
              {paragraph}
            </ScrollReveal>
          ),
        )}

        <dl className="about-stats">
          {ABOUT.stats.map((stat) => {
            const { n, rest } = splitStat(stat.value)
            return (
              <div className="about-stat" key={stat.value}>
                <dt>
                  {reduced || n === null ? (
                    stat.value
                  ) : (
                    <>
                      <CountUp to={n} duration={0.9} />
                      {rest}
                    </>
                  )}
                </dt>
                <dd>{stat.label}</dd>
              </div>
            )
          })}
        </dl>

        <ol className="about-path">
          {ABOUT.path.map((beat) => (
            <li key={`${beat.when}-${beat.where}`}>
              <span className="about-path-when">{beat.when}</span>
              <span className="about-path-body">
                <strong>{beat.where}</strong>
                <span>{beat.what}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
