import BlurText from '../bits/BlurText'
import { useReducedMotion } from '../hooks/useReducedMotion'

const LABEL_FROM = { filter: 'blur(8px)', opacity: 0, y: 10 }
const LABEL_TO = [
  { filter: 'blur(3px)', opacity: 0.7, y: 2 },
  { filter: 'blur(0px)', opacity: 1, y: 0 },
]

export function SectionLabel({ text, className = '' }: { text: string; className?: string }) {
  const reduced = useReducedMotion()
  const classes = `section-label ${className}`.trim()

  if (reduced) return <p className={classes}>{text}</p>

  return (
    <BlurText
      text={text}
      className={classes}
      animateBy="words"
      delay={70}
      stepDuration={0.28}
      direction="bottom"
      animationFrom={LABEL_FROM}
      animationTo={LABEL_TO}
    />
  )
}
