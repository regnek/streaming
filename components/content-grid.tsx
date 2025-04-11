import Link from "next/link"
import Image from "next/image"
import { Play, Info } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ContentItem {
  id: string
  title: string
  thumbnail: string
  releaseYear?: string
  duration?: string
  progress?: number
  subtitle?: string
  episodeCount?: number
}

interface ContentGridProps {
  items: ContentItem[]
}

export function ContentGrid({ items }: ContentGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {items && items.length > 0 ? (
        items.map((item) => (
          <div key={item.id || `item-${Math.random()}`} className="flex flex-col group">
            <div className="relative aspect-video rounded-md overflow-hidden">
              <Image
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.title || "Content item"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {item.progress !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div className="h-full bg-red-600" style={{ width: `${item.progress}%` }} />
                </div>
              )}

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                <h3 className="text-sm font-medium line-clamp-1">{item.title || "Untitled"}</h3>
              </Link>
              {item.subtitle ? (
                <div className="text-xs text-gray-400 mt-1">{item.subtitle}</div>
              ) : (
                <>
                  {(item.releaseYear || item.duration || item.episodeCount) && (
                    <div className="text-xs text-gray-400 mt-1">
                      {item.releaseYear && <span>{item.releaseYear}</span>}
                      {item.releaseYear && (item.duration || item.episodeCount) && <span className="mx-1">•</span>}
                      {item.duration && <span>{item.duration}</span>}
                      {!item.duration && item.episodeCount && <span>{item.episodeCount} Episodes</span>}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-400">No content available</p>
        </div>
      )}
    </div>
  )
}
