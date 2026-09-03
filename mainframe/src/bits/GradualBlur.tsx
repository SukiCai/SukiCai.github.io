import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

type GradualBlurProps = {
  position?: 'top' | 'bottom' | 'left' | 'right'
  strength?: number
  height?: string
  width?: string
  divCount?: number
  exponential?: boolean
  zIndex?: number
  animated?: boolean | 'scroll'
  duration?: string
  easing?: string
  opacity?: number
  curve?: 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out'
  preset?: 'subtle' | 'intense' | 'smooth' | 'sharp' | 'header' | 'footer'
  target?: 'parent' | 'page'
  className?: string
  style?: CSSProperties
}

const CURVE_FUNCTIONS: Record<string, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  'ease-in': (p) => p * p,
  'ease-out': (p) => 1 - (1 - p) ** 2,
  'ease-in-out': (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2),
}

const PRESETS: Record<string, Partial<GradualBlurProps>> = {
  subtle: { height: '4rem', strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: '10rem', strength: 4, divCount: 8, exponential: true },
  smooth: { height: '8rem', curve: 'bezier', divCount: 10 },
  sharp: { height: '5rem', curve: 'linear', divCount: 4 },
  header: { position: 'top', height: '8rem', curve: 'ease-out' },
  footer: { position: 'bottom', height: '8rem', curve: 'ease-out' },
}

function getGradientDirection(position: string): string {
  if (position === 'top') return 'to top'
  if (position === 'left') return 'to left'
  if (position === 'right') return 'to right'
  return 'to bottom'
}

export default function GradualBlur(props: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(props.animated !== 'scroll')

  const config = useMemo(() => {
    const preset = props.preset ? PRESETS[props.preset] ?? {} : {}
    return {
      position: 'bottom' as const,
      strength: 2,
      height: '6rem',
      divCount: 5,
      exponential: false,
      zIndex: 4,
      animated: false as boolean | 'scroll',
      duration: '0.3s',
      easing: 'ease-out',
      opacity: 1,
      curve: 'linear' as const,
      target: 'parent' as const,
      className: '',
      style: {},
      ...preset,
      ...props,
    }
  }, [props])

  useEffect(() => {
    if (config.animated !== 'scroll' || !containerRef.current) return
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.1,
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [config.animated])

  const blurDivs = useMemo(() => {
    const divs = []
    const increment = 100 / config.divCount
    const curveFunc = CURVE_FUNCTIONS[config.curve] ?? CURVE_FUNCTIONS.linear

    for (let i = 1; i <= config.divCount; i += 1) {
      const progress = curveFunc(i / config.divCount)
      const blurValue = config.exponential
        ? 2 ** (progress * 4) * 0.0625 * config.strength
        : 0.0625 * (progress * config.divCount + 1) * config.strength

      const p1 = Math.round((increment * i - increment) * 10) / 10
      const p2 = Math.round(increment * i * 10) / 10
      const p3 = Math.round((increment * i + increment) * 10) / 10
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10

      let gradient = `transparent ${p1}%, black ${p2}%`
      if (p3 <= 100) gradient += `, black ${p3}%`
      if (p4 <= 100) gradient += `, transparent ${p4}%`

      divs.push(
        <div
          key={i}
          className="pointer-events-none absolute inset-0"
          style={{
            maskImage: `linear-gradient(${getGradientDirection(config.position)}, ${gradient})`,
            WebkitMaskImage: `linear-gradient(${getGradientDirection(config.position)}, ${gradient})`,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity: config.opacity,
          }}
        />,
      )
    }
    return divs
  }, [config])

  const isVertical = config.position === 'top' || config.position === 'bottom'
  const isPageTarget = config.target === 'page'

  const containerStyle: CSSProperties = {
    position: isPageTarget ? 'fixed' : 'absolute',
    pointerEvents: 'none',
    opacity: isVisible ? 1 : 0,
    transition: config.animated ? `opacity ${config.duration} ${config.easing}` : undefined,
    zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
    ...(isVertical
      ? { height: config.height, width: config.width || '100%', [config.position]: 0, left: 0, right: 0 }
      : { width: config.width || config.height, height: '100%', [config.position]: 0, top: 0, bottom: 0 }),
    ...config.style,
  }

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${config.className}`}
      style={containerStyle}
      aria-hidden="true"
    >
      {blurDivs}
    </div>
  )
}
