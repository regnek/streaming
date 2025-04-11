"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, SkipBack, SkipForward, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { updateVideoProgress, getVideoProgress } from "@/lib/progress-service"

import Hls from 'hls.js'

interface VideoPlayerProps {
  src: string
  poster?: string
  title: string
  videoId?: string
  onNext?: () => void
  onPrevious?: () => void
}

export function VideoPlayer({ src, poster, title, videoId, onNext, onPrevious }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)

  // hls playback support
  // useEffect(() => {
  //   const video = videoRef.current
  //   const src = 'https://moviesandshow.s3.eu-west-2.amazonaws.com/Shows/arrested-development/s1/1-1.mp4'
  //   if (!video) return
  
  //   if (Hls.isSupported()) {
  //     const hls = new Hls()
  
  //     hls.loadSource(src) // src is your .m3u8 URL
  //     hls.attachMedia(video)
  
  //     hls.on(Hls.Events.MANIFEST_PARSED, () => {
  //       video.play()
  //     })
  
  //     return () => {
  //       hls.destroy()
  //     }
  //   } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  //     video.src = src
  //     video.addEventListener('loadedmetadata', () => {
  //       video.play()
  //     })
  //   }
  // }, [src])

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    const playerElement = playerRef.current
    if (playerElement) {
      playerElement.addEventListener("mousemove", handleMouseMove)
      playerElement.addEventListener("mouseleave", () => {
        if (isPlaying) {
          setShowControls(false)
        }
      })
      playerElement.addEventListener("mouseenter", () => {
        setShowControls(true)
      })
    }

    return () => {
      clearTimeout(timeout)
      if (playerElement) {
        playerElement.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [isPlaying])

  // Update time and duration
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(video.duration)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleWaiting = () => {
      setIsBuffering(true)
    }

    const handlePlaying = () => {
      setIsBuffering(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (onNext) {
        // Auto-play next episode after a short delay
        setTimeout(() => {
          onNext()
        }, 1500)
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("durationchange", handleDurationChange)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("durationchange", handleDurationChange)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
      video.removeEventListener("ended", handleEnded)
    }
  }, [onNext])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Add this useEffect to load saved progress
  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoId) return

    const savedProgress = getVideoProgress(videoId)
    if (savedProgress && savedProgress.position > 0) {
      // Only seek if we're not near the end (to avoid skipping to the end of completed videos)
      if (savedProgress.percent < 95) {
        video.currentTime = savedProgress.position
      }
    }
  }, [videoId])

  // Add this function to save progress periodically
  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoId) return

    // Save progress every 5 seconds while playing
    const progressInterval = setInterval(() => {
      if (!isPlaying) return

      updateVideoProgress(videoId, video.currentTime, video.duration || 0)
    }, 5000)

    // Save progress when video ends
    const handleEnded = () => {
      updateVideoProgress(videoId, video.duration || 0, video.duration || 0)
    }

    // Save progress when component unmounts or video changes
    const handleUnload = () => {
      updateVideoProgress(videoId, video.currentTime, video.duration || 0)
    }

    video.addEventListener("ended", handleEnded)
    window.addEventListener("beforeunload", handleUnload)

    return () => {
      clearInterval(progressInterval)
      video.removeEventListener("ended", handleEnded)
      window.removeEventListener("beforeunload", handleUnload)

      // Save progress when component unmounts
      if (video.currentTime > 0 && video.duration) {
        updateVideoProgress(videoId, video.currentTime, video.duration)
      }
    }
  }, [videoId, isPlaying])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.muted = false
      setIsMuted(false)
      setVolume(video.volume)
    } else {
      video.muted = true
      setIsMuted(true)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)

    if (newVolume === 0) {
      video.muted = true
      setIsMuted(true)
    } else if (isMuted) {
      video.muted = false
      setIsMuted(false)
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const toggleFullscreen = () => {
    const player = playerRef.current
    if (!player) return

    if (!isFullscreen) {
      if (player.requestFullscreen) {
        player.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const skipForward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.min(video.currentTime + 10, video.duration)
  }

  const skipBackward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(video.currentTime - 10, 0)
  }

  return (
    <div ref={playerRef} className="relative w-full aspect-video bg-black max-h-[100vh]" onClick={togglePlay}>
      <video ref={videoRef} src={src} poster={poster} className="w-full h-full" onClick={(e) => e.stopPropagation()} />

      {/* Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Video title */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <h2 className="text-white font-medium">{title}</h2>
        </div>
      )}

      {/* Center play/pause button */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
            onClick={togglePlay}
          >
            <Play className="w-10 h-10 text-white fill-white" />
            <span className="sr-only">Play</span>
          </Button>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress bar */}
          <div className="mb-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer [&>span:first-child]:h-1.5 [&>span:first-child]:bg-gray-600 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-white [&>span:first-child_span]:bg-red-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={togglePlay}>
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={skipBackward}>
                <SkipBack className="w-5 h-5" />
                <span className="sr-only">Skip back 10 seconds</span>
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={skipForward}>
                <SkipForward className="w-5 h-5" />
                <span className="sr-only">Skip forward 10 seconds</span>
              </Button>

              <div className="flex items-center gap-2 ml-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={toggleMute}>
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
                </Button>

                <div className="w-20 hidden sm:block">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-600 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-white [&>span:first-child_span]:bg-white"
                  />
                </div>
              </div>

              <div className="text-white text-sm ml-2">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onPrevious && (
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onPrevious}>
                  <SkipBack className="w-5 h-5" />
                  <span className="sr-only">Previous Episode</span>
                </Button>
              )}

              {onNext && (
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onNext}>
                  <SkipForward className="w-5 h-5" />
                  <span className="sr-only">Next Episode</span>
                </Button>
              )}

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Settings className="w-5 h-5" />
                <span className="sr-only">Settings</span>
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                <span className="sr-only">{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
