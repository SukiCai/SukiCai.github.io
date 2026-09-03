import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'

export type DockItemData = {
  href: string
  label: string
}

type DockProps = {
  items: DockItemData[]
  className?: string
  distance?: number
  magnification?: number
  spring?: SpringOptions
  activeHref?: string
}

type DockItemProps = {
  item: DockItemData
  mouseX: MotionValue<number>
  spring: SpringOptions
  distance: number
  magnification: number
  active?: boolean
}

function DockItem({ item, mouseX, spring, distance, magnification, active }: DockItemProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [baseWidth, setBaseWidth] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setBaseWidth(el.offsetWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [item.label])

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect || !Number.isFinite(val)) return distance
    return val - rect.left - rect.width / 2
  })

  const targetScale = useTransform(mouseDistance, [-distance, 0, distance], [1, magnification, 1])
  const scale = useSpring(targetScale, spring)
  const spread = useTransform(scale, (s) => (baseWidth * (s - 1)) / 2)

  return (
    <motion.span className="inline-flex" style={{ paddingLeft: spread, paddingRight: spread }}>
      <motion.a
        ref={ref}
        href={item.href}
        aria-current={active ? 'location' : undefined}
        style={{ scale, transformOrigin: 'top center' }}
        className={`relative inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[14px] tracking-[-0.01em] text-black no-underline outline-none transition-colors duration-150 hover:bg-black/[0.06] focus-visible:bg-black/[0.06] lg:text-[15px] ${
          active ? 'font-medium' : ''
        }`}
      >
        {item.label}
        {active ? (
          <span
            className="absolute bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-black"
            aria-hidden="true"
          />
        ) : null}
      </motion.a>
    </motion.span>
  )
}

export default function Dock({
  items,
  className = '',
  distance = 130,
  magnification = 1.42,
  spring = { mass: 0.08, stiffness: 380, damping: 16 },
  activeHref,
}: DockProps) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className={`flex items-start rounded-full px-1.5 py-1 ${className}`}
      role="navigation"
      aria-label="Sections"
    >
      {items.map((item) => (
        <DockItem
          key={item.href}
          item={item}
          mouseX={mouseX}
          spring={spring}
          distance={distance}
          magnification={magnification}
          active={activeHref === item.href}
        />
      ))}
    </div>
  )
}
