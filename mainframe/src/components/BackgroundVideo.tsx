import { useRef } from 'react'
import { useVideoScrub } from '../hooks/useVideoScrub'

const VIDEO_SRC = '/assets/hero/character.mp4?v=70'

/** Limestone wall from the current character.mp4 */
const WALL = '#aba398'

export function BackgroundVideo({ enabled = true }: { enabled?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoScrub(videoRef, enabled)

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: WALL }}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-[75%_40%]"
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
      />
    </div>
  )
}
