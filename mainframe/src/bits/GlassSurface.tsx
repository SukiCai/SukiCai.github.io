import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'

export interface GlassSurfaceProps {
  children?: ReactNode
  width?: number | string
  height?: number | string
  borderRadius?: number
  brightness?: number
  opacity?: number
  blur?: number
  backgroundOpacity?: number
  saturation?: number
  className?: string
  style?: CSSProperties
}

export default function GlassSurface({
  children,
  width = '100%',
  height = '100%',
  borderRadius = 0,
  brightness = 1.08,
  opacity = 0.93,
  blur = 16,
  backgroundOpacity = 0.42,
  saturation = 1.6,
  className = '',
  style = {},
}: GlassSurfaceProps) {
  const uniqueId = useId().replace(/:/g, '-')
  const filterId = `glass-filter-${uniqueId}`
  const containerRef = useRef<HTMLDivElement>(null)
  const [svgSupported, setSvgSupported] = useState(false)

  useEffect(() => {
    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    const isFirefox = /Firefox/.test(navigator.userAgent)
    if (isWebkit || isFirefox) {
      setSvgSupported(false)
      return
    }
    const div = document.createElement('div')
    div.style.backdropFilter = `url(#${filterId})`
    setSvgSupported(div.style.backdropFilter !== '')
  }, [filterId])

  const widthValue = typeof width === 'number' ? `${width}px` : width
  const heightValue = typeof height === 'number' ? `${height}px` : height

  const glassStyle: CSSProperties = svgSupported
    ? {
        background: `hsl(40 14% 97% / ${backgroundOpacity})`,
        backdropFilter: `url(#${filterId}) saturate(${saturation})`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation})`,
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.55), 0 8px 24px rgba(17,17,26,0.04)`,
      }
    : {
        background: `rgba(251, 250, 248, ${backgroundOpacity})`,
        backdropFilter: `blur(${blur}px) saturate(${saturation}) brightness(${brightness})`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}) brightness(${brightness})`,
        borderBottom: '1px solid rgba(255,255,255,0.45)',
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.5), 0 8px 24px rgba(17,17,26,0.04)`,
      }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        width: widthValue,
        height: heightValue,
        borderRadius: `${borderRadius}px`,
        opacity,
        ...glassStyle,
        ...style,
      }}
    >
      {svgSupported ? (
        <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
          <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </svg>
      ) : null}
      {children}
    </div>
  )
}
