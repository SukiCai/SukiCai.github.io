import { useRef } from 'react'
import { useVideoScrub } from '../hooks/useVideoScrub'

const VIDEO_SRC = '/assets/hero/character.mp4?v=12'

export function BackgroundVideo({ enabled = true }: { enabled?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoScrub(videoRef, enabled)

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover [object-position:70%_center]"
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
      />
    </div>
  )
}
