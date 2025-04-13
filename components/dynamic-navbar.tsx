"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { useNavigationVisibility } from "@/hooks/use-navigation-visibility"

export function DynamicNavbar() {
  const pathname = usePathname()
  const isWatchPage = pathname.startsWith("/watch/")
  const videoPlayerRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const { isNavVisible, setIsNavVisible } = useNavigationVisibility()

  // Force hide navigation on watch pages initially
  useEffect(() => {
    if (isWatchPage) {
      // Immediately hide the navigation on watch pages
      setIsNavVisible(false)
    } else {
      // Show navigation on non-watch pages
      setIsNavVisible(true)
    }
  }, [pathname, isWatchPage, setIsNavVisible])

  // Set up intersection observer for watch pages
  useEffect(() => {
    // Only set up observer on watch pages
    if (!isWatchPage) return

    // Function to find the video player element
    const findVideoPlayer = () => {
      const videoPlayerElement = document.querySelector(".video-player-container") as HTMLDivElement
      if (videoPlayerElement) {
        videoPlayerRef.current = videoPlayerElement
        setupObserver(videoPlayerElement)
      } else {
        // If not found immediately, try again after a short delay
        setTimeout(findVideoPlayer, 200)
      }
    }

    // Set up the intersection observer with refined configuration
    const setupObserver = (targetElement: HTMLElement) => {
      // Clean up any existing observer
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      // Create new observer with refined options
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          console.log("Video player intersection:", entry.isIntersecting ? "visible" : "hidden")

          // Show navbar when video player is NOT in view (scrolled past it)
          // Hide navbar when video player IS in view
          setIsNavVisible(!entry.isIntersecting)
        },
        {
          // Trigger when video player enters/exits viewport
          threshold: [0.05, 0.1], // Multiple thresholds for more accurate detection
          rootMargin: "-1px 0px 0px 0px", // Slight negative top margin to detect when fully scrolled past
        },
      )

      // Start observing the video player
      observerRef.current.observe(targetElement)
      console.log("Observer set up for video player element")
    }

    // Start the process
    findVideoPlayer()

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        console.log("Observer disconnected")
      }
    }
  }, [isWatchPage, setIsNavVisible])

  // Add scroll direction detection for better UX
  useEffect(() => {
    if (!isWatchPage) return

    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // If scrolling up and near the top, ensure navbar is hidden
      // This prevents the navbar from appearing when slightly scrolling at the top
      if (currentScrollY < lastScrollY && currentScrollY < 50) {
        setIsNavVisible(false)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isWatchPage, setIsNavVisible])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isNavVisible ? "translate-y-0" : "translate-y-[-100%]"
      }`}
      aria-hidden={!isNavVisible && isWatchPage}
    >
      <Navbar />
    </div>
  )
}
