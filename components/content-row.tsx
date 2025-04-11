"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ContentItem {
  id: string
  title: string
  thumbnail: string
  poster: string
  progress?: number
}

interface ContentRowProps {
  title: string
  seeAllLink: string
  items: ContentItem[]
}

export function ContentRow({ title, seeAllLink, items }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75

      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link href={seeAllLink} className="text-sm text-gray-400 hover:text-white">
          See All
        </Link>
      </div>

      <div className="relative group">
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="sr-only">Scroll left</span>
          </Button>
        )}

        <div ref={rowRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4" onScroll={handleScroll}>
          {items.map((item) => (
            <div key={item.id} className="flex-none w-[180px]">
              <div className="relative aspect-[2/3] group/item rounded-md overflow-hidden">
                <Image
                  src={item.poster || item.thumbnail || "/placeholder.svg?height=600&width=400"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover/item:scale-105"
                />

                {item.progress !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div className="h-full bg-red-600" style={{ width: `${item.progress}%` }} />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button asChild size="sm" variant="secondary" className="rounded-full">
                    <Link href={`/watch/${item.id}`}>
                      <Play className="w-4 h-4" />
                      <span className="sr-only">Play</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <Link href={`/details/${item.id}`}>
                      <Info className="w-4 h-4" />
                      <span className="sr-only">More Info</span>
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-2">
                <Link href={`/details/${item.id}`} className="hover:text-primary transition-colors">
                  <h3 className="text-sm font-medium line-clamp-1">{item.title}</h3>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-6 h-6" />
            <span className="sr-only">Scroll right</span>
          </Button>
        )}
      </div>
    </div>
  )
}
