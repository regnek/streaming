"use client"
import Image from "next/image"
import Link from "next/link"
import { Info, Play, Star } from "lucide-react"

import { Button } from "@/components/ui/button"

interface FeaturedContentProps {
  content: any
}

export function FeaturedContent({ content }: FeaturedContentProps) {
  if (!content) {
    return null
  }

  return (
    <div className="relative w-full h-[75vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={content.thumbnail || "/placeholder.svg"}
          alt={content.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Poster overlay */}
      {/* <div className="absolute left-4 md:left-16 bottom-16 hidden md:block">
        <div className="relative h-64 w-44 rounded-lg overflow-hidden shadow-2xl">
          <Image
            src={content.poster || content.thumbnail || "/placeholder.svg"}
            alt={content.title}
            fill
            className="object-cover"
          />
        </div>
      </div> */}

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <div className="pt-[30vh]">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl">{content.title}</h1>

          {/* <div className="flex items-center text-sm text-gray-300 mb-4">
            <span>{content.releaseYear}</span>
            <span className="mx-2">•</span>
            <span>{content.rating}</span>
            <span className="mx-2">•</span>
            <span>{content.duration}</span>
            {content.userRating && (
              <>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  {content.userRating.toFixed(1)}
                </span>
              </>
            )}
          </div> */}

          <p className="text-lg text-gray-200 mb-6 line-clamp-3 max-w-2xl">{content.description}</p>

          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href={`/watch/${content.id}`}>
                  <Play fill="#171717" className="w-5 h-5" />
                  Play
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href={`/details/${content.id}`}>
                  {/* <Info className="w-5 h-5" /> */}
                  More info
                </Link>
              </Button>
            </div>
            <div>
              <span className="text-lg">{content.rating}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
