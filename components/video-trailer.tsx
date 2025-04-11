"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

import { Button } from "@/components/ui/button"

interface VideoTrailerProps {
  src: string
  poster?: string
}

export function VideoTrailer({ src, poster }: VideoTrailerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isYouTube, setIsYouTube] = useState(false)
  const [youtubeId, setYoutubeId] = useState("")

  useEffect(() => {
    // Check if the source is a YouTube URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const match = src.match(youtubeRegex)

    if (match && match[1]) {
      setIsYouTube(true)
      setYoutubeId(match[1])
    } else {
      setIsYouTube(false)
      setYoutubeId("")
    }
  }, [src])

  const togglePlay = () => {
    if (isYouTube) {
      // For YouTube, we need to use the iframe API
      if (iframeRef.current) {
        if (isPlaying) {
          // Pause the video
          iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*")
        } else {
          // Play the video
          iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
        }
        setIsPlaying(!isPlaying)
      }
    } else {
      // For direct video sources
      const video = videoRef.current
      if (!video) return

      if (isPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (isYouTube) {
      // For YouTube, we need to use the iframe API
      if (iframeRef.current) {
        if (isMuted) {
          // Unmute the video
          iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', "*")
        } else {
          // Mute the video
          iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', "*")
        }
        setIsMuted(!isMuted)
      }
    } else {
      // For direct video sources
      const video = videoRef.current
      if (!video) return

      video.muted = !video.muted
      setIsMuted(!video.muted)
    }
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
      {isYouTube ? (
        // YouTube embed
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full absolute inset-0"
        ></iframe>
      ) : (
        // Direct video source
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
          muted={isMuted}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white fill-white" />}
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 rounded-full bg-black/50 hover:bg-black/70"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
        </Button>
      </div>
    </div>
  )
}
