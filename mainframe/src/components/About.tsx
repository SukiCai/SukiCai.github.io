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
              enableBlur={false}
              baseOpacity={0.28}
              baseRotation={0}
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
            <li key={beat.when} className={beat.lanes.length > 1 ? 'about-path-parallel' : undefined}>
              <span className="about-path-when">{beat.when}</span>
              <div className="about-path-lanes">
                {beat.lanes.length > 1 && (
                  <span className="about-path-parallel-label">in parallel</span>
                )}
                {beat.lanes.map((lane) => (
                  <div className="about-path-lane" key={`${beat.when}-${lane.where}-${lane.kind}`}>
                    <div className="about-path-lane-head">
                      <strong>{lane.where}</strong>
                      {lane.kind && <span className="about-path-kind">{lane.kind}</span>}
                    </div>
                    <span>{lane.what}</span>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
