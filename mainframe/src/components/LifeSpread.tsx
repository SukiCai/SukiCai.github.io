import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useLifeSpread } from '../hooks/useLifeSpread'
import { LIFE_CARDS } from '../data/content'

export function LifeSpread() {
  const introRef = useReveal<HTMLDivElement>()
  const spreadRef = useReveal<HTMLDivElement>()
  const armRefs = useRef<(HTMLDivElement | null)[]>([])

  useLifeSpread(armRefs)

  return (
    <section className="section life-section" id="life">
      <div className="section-inner reveal" ref={introRef}>
        <p className="section-label">Off the Clock</p>
        <p className="life-intro">A few frames from outside the editor &mdash; hover, or tab through, to pull one out of the fan.</p>
      </div>

      <div className="life-spread reveal" ref={spreadRef} role="group" aria-label="A few personal moments outside of work">
        {LIFE_CARDS.map((card, i) => (
          <div className="life-arm" key={card.image} ref={(el) => { armRefs.current[i] = el }}>
            <button className="life-card" type="button">
              <span className="life-card-face">
                <img src={card.image} alt={card.alt} loading="lazy" width={373} height={560} />
                <span className="life-caption">{card.caption}</span>
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
