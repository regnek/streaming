"use client"

import { useEffect, useRef } from "react"

interface InfiniteScrollObserverProps {
  onIntersect: () => void
  isLoading: boolean
  hasMore: boolean
}

export function InfiniteScrollObserver({ onIntersect, isLoading, hasMore }: InfiniteScrollObserverProps) {
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the sentinel element is intersecting and we're not currently loading and there's more content to load
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          onIntersect()
        }
      },
      {
        // Start loading more content when the user is 200px away from the bottom
        rootMargin: "0px 0px 200px 0px",
        threshold: 0.1,
      },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [onIntersect, isLoading, hasMore])

  return (
    <div ref={observerRef} className="h-10 w-full flex items-center justify-center">
      {isLoading && hasMore && (
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      )}
    </div>
  )
}
