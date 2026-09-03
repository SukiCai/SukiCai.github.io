import { useRef } from 'react'
import { useVideoScrub } from '../hooks/useVideoScrub'

const VIDEO_SRC = '/assets/hero/character.mp4?v=16'

export function BackgroundVideo({ enabled = true }: { enabled?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoScrub(videoRef, enabled)

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <video
        ref={videoRef}
        className="absolute left-0 top-0 h-[112%] w-full object-cover object-[70%_top]"
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
      />
    </div>
  )
}
