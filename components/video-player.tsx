"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  Settings,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { updateVideoProgress, getVideoProgress } from "@/lib/progress-service"
import Image from "next/image"

// Update the VideoPlayerProps interface to include tooltip information
interface VideoPlayerProps {
  src: string
  poster?: string
  title: string
  videoId?: string
  onNext?: () => void
  onPrevious?: () => void
  creditsStartTime?: number // Time in seconds when credits start
  autoplay?: boolean // New prop to control autoplay behavior
  nextEpisodeData?: {
    src: string
    poster?: string
    title: string
    videoId?: string
    creditsStartTime?: number
  }
  onEpisodeChange?: (videoId: string) => void
  // Add new props for tooltip information
  previousEpisodeInfo?: {
    title: string
    thumbnail: string
    episodeNumber: number
    seasonNumber: number
  }
  nextEpisodeInfo?: {
    title: string
    thumbnail: string
    episodeNumber: number
    seasonNumber: number
  }
}

export function VideoPlayer({
  src,
  poster,
  title,
  videoId,
  onNext,
  onPrevious,
  creditsStartTime,
  autoplay = false,
  nextEpisodeData,
  onEpisodeChange,
  previousEpisodeInfo,
  nextEpisodeInfo,
}: VideoPlayerProps) {
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
  const [showNextEpisodeButton, setShowNextEpisodeButton] = useState(false)
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false)
  const [isTransitioningToNextEpisode, setIsTransitioningToNextEpisode] = useState(false)
  const [currentEpisodeData, setCurrentEpisodeData] = useState({
    src,
    poster,
    title,
    videoId,
    creditsStartTime,
  })

  // Add state variables for tooltip visibility
  const [showPrevTooltip, setShowPrevTooltip] = useState(false)
  const [showNextTooltip, setShowNextTooltip] = useState(false)

  // Update current episode data when props change
  useEffect(() => {
    if (!isTransitioningToNextEpisode) {
      setCurrentEpisodeData({
        src,
        poster,
        title,
        videoId,
        creditsStartTime,
      })
    }
  }, [src, poster, title, videoId, creditsStartTime, isTransitioningToNextEpisode])

  // Add a new useEffect for autoplay functionality
  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoplay || hasAttemptedAutoplay) return

    // Mark that we've attempted autoplay to prevent multiple attempts
    setHasAttemptedAutoplay(true)

    // Function to start playback
    const startPlayback = async () => {
      try {
        // Most browsers require videos to be muted for autoplay without user interaction
        video.muted = true
        setIsMuted(true)

        // Start playback
        const playPromise = video.play()

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playback started successfully
              setIsPlaying(true)
              console.log("Autoplay started successfully")
            })
            .catch((error) => {
              // Autoplay was prevented
              console.warn("Autoplay prevented:", error)
              // Keep the video paused and unmuted, waiting for user interaction
              video.muted = false
              setIsMuted(false)
            })
        }
      } catch (error) {
        console.error("Error during autoplay:", error)
      }
    }

    // Wait for the video to be loaded enough to play
    const handleCanPlay = () => {
      startPlayback()
    }

    // If the video is already loaded enough, start playback immediately
    if (video.readyState >= 3) {
      // HAVE_FUTURE_DATA or higher
      startPlayback()
    } else {
      // Otherwise, wait for the canplay event
      video.addEventListener("canplay", handleCanPlay)
      return () => {
        video.removeEventListener("canplay", handleCanPlay)
      }
    }
  }, [autoplay, hasAttemptedAutoplay])

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

    // Replace the existing handleTimeUpdate function in the useEffect with this improved version
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)

      // Determine if we should show the next episode button based on:
      // 1. If a specific creditsStartTime is provided, use that
      // 2. Otherwise, use a percentage-based approach as fallback (98%)
      const creditsHaveStarted = currentEpisodeData.creditsStartTime
        ? video.currentTime >= currentEpisodeData.creditsStartTime
        : video.duration && video.currentTime > video.duration * 0.98

      // Only update state when there's a change to avoid unnecessary re-renders
      if (creditsHaveStarted && !showNextEpisodeButton && (onNext || nextEpisodeData)) {
        setShowNextEpisodeButton(true)
      }

      // Important: Don't hide the button once it's shown
      // This fixes the issue where the button would disappear
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

    // Update the handleEnded function to handle seamless transitions
    const handleEnded = () => {
      setIsPlaying(false)
      setShowNextEpisodeButton(false)

      // If we have next episode data and we're in fullscreen, handle the transition seamlessly
      if (nextEpisodeData && isFullscreen) {
        handleSeamlessTransition()
      } else if (onNext) {
        // Otherwise use the traditional navigation approach
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
  }, [onNext, showNextEpisodeButton, currentEpisodeData.creditsStartTime, nextEpisodeData, isFullscreen])

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
    if (!video || !currentEpisodeData.videoId) return

    const savedProgress = getVideoProgress(currentEpisodeData.videoId)
    if (savedProgress && savedProgress.position > 0) {
      // Only seek if we're not near the end (to avoid skipping to the end of completed videos)
      if (savedProgress.percent < 95) {
        video.currentTime = savedProgress.position
      }
    }
  }, [currentEpisodeData.videoId])

  // Add this function to save progress periodically
  useEffect(() => {
    const video = videoRef.current
    if (!video || !currentEpisodeData.videoId) return

    // Save progress every 5 seconds while playing
    const progressInterval = setInterval(() => {
      if (!isPlaying) return

      updateVideoProgress(currentEpisodeData.videoId!, video.currentTime, video.duration || 0)
    }, 5000)

    // Save progress when video ends
    const handleEnded = () => {
      updateVideoProgress(currentEpisodeData.videoId!, video.duration || 0, video.duration || 0)
    }

    // Save progress when component unmounts or video changes
    const handleUnload = () => {
      updateVideoProgress(currentEpisodeData.videoId!, video.currentTime, video.duration || 0)
    }

    video.addEventListener("ended", handleEnded)
    window.addEventListener("beforeunload", handleUnload)

    return () => {
      clearInterval(progressInterval)
      video.removeEventListener("ended", handleEnded)
      window.removeEventListener("beforeunload", handleUnload)

      // Save progress when component unmounts
      if (video.currentTime > 0 && video.duration) {
        updateVideoProgress(currentEpisodeData.videoId!, video.currentTime, video.duration)
      }
    }
  }, [currentEpisodeData.videoId, isPlaying])

  // Function to handle seamless transition to next episode
  const handleSeamlessTransition = async () => {
    if (!nextEpisodeData || !videoRef.current) return

    setIsTransitioningToNextEpisode(true)
    setIsBuffering(true)

    try {
      // Update the current episode data with the next episode's data
      setCurrentEpisodeData({
        src: nextEpisodeData.src,
        poster: nextEpisodeData.poster,
        title: nextEpisodeData.title,
        videoId: nextEpisodeData.videoId,
        creditsStartTime: nextEpisodeData.creditsStartTime,
      })

      // Reset state for the new episode
      setCurrentTime(0)
      setDuration(0)
      setShowNextEpisodeButton(false)

      // Notify parent component about the episode change
      if (onEpisodeChange && nextEpisodeData.videoId) {
        onEpisodeChange(nextEpisodeData.videoId)
      }

      // Wait for the video element to update with the new source
      // This will happen in the next render cycle
      setTimeout(() => {
        const video = videoRef.current
        if (video) {
          // Play the video once it's loaded
          const playHandler = () => {
            video
              .play()
              .then(() => {
                setIsPlaying(true)
                setIsBuffering(false)
              })
              .catch((err) => {
                console.error("Error playing next episode:", err)
                setIsBuffering(false)
              })
            video.removeEventListener("loadeddata", playHandler)
          }

          video.addEventListener("loadeddata", playHandler)

          // Reset autoplay attempt flag to allow autoplay for the new episode
          setHasAttemptedAutoplay(false)
        }
      }, 100)
    } catch (error) {
      console.error("Error during seamless transition:", error)
      setIsBuffering(false)
    } finally {
      setIsTransitioningToNextEpisode(false)
    }
  }

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

  // Function to handle next episode button click
  const handleNextEpisode = (e: React.MouseEvent) => {
    e.stopPropagation()

    // If we have next episode data and we're in fullscreen, handle the transition seamlessly
    if (nextEpisodeData && isFullscreen) {
      handleSeamlessTransition()
    } else if (onNext) {
      // Exit fullscreen before navigation to prevent URL issues
      if (isFullscreen && document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => {
            // Small delay to ensure fullscreen exit completes
            setTimeout(() => {
              onNext()
            }, 100)
          })
          .catch(() => {
            // If exiting fullscreen fails, still try to navigate
            onNext()
          })
      } else {
        // If not in fullscreen, just navigate
        onNext()
      }
    }
  }

  return (
    <div ref={playerRef} className="relative w-full aspect-video bg-black max-h-[100vh]" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={currentEpisodeData.src}
        poster={currentEpisodeData.poster}
        className="w-full h-full"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {showNextEpisodeButton && (nextEpisodeData || onNext) && (
        <div className="absolute bottom-24 right-4 z-10 transition-opacity duration-300 ease-in-out">
          <Button
            onClick={handleNextEpisode}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 px-4 py-2 rounded-md shadow-lg"
          >
            Next Episode
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Video title */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <h2 className="text-white font-medium">{currentEpisodeData.title}</h2>
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
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={onPrevious}
                    onMouseEnter={() => setShowPrevTooltip(true)}
                    onMouseLeave={() => setShowPrevTooltip(false)}
                  >
                    <SkipBack className="w-5 h-5" />
                    <span className="sr-only">Previous Episode</span>
                  </Button>

                  {/* Previous Episode Tooltip */}
                  {showPrevTooltip && previousEpisodeInfo && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 bg-black/90 rounded-md shadow-lg overflow-hidden z-50">
                      <div className="relative aspect-video w-full">
                        <Image
                          src={previousEpisodeInfo.thumbnail || "/placeholder.svg?height=90&width=160"}
                          alt={previousEpisodeInfo.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-300">
                          Previous: S{previousEpisodeInfo.seasonNumber}E{previousEpisodeInfo.episodeNumber}
                        </p>
                        <p className="text-sm font-medium truncate">{previousEpisodeInfo.title}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(nextEpisodeData || onNext) && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={handleNextEpisode}
                    onMouseEnter={() => setShowNextTooltip(true)}
                    onMouseLeave={() => setShowNextTooltip(false)}
                  >
                    <SkipForward className="w-5 h-5" />
                    <span className="sr-only">Next Episode</span>
                  </Button>

                  {/* Next Episode Tooltip */}
                  {showNextTooltip && nextEpisodeInfo && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 bg-black/90 rounded-md shadow-lg overflow-hidden z-50">
                      <div className="relative aspect-video w-full">
                        <Image
                          src={nextEpisodeInfo.thumbnail || "/placeholder.svg?height=90&width=160"}
                          alt={nextEpisodeInfo.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-300">
                          Next: S{nextEpisodeInfo.seasonNumber}E{nextEpisodeInfo.episodeNumber}
                        </p>
                        <p className="text-sm font-medium truncate">{nextEpisodeInfo.title}</p>
                      </div>
                    </div>
                  )}
                </div>
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
