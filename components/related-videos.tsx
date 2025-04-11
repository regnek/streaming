import Link from "next/link"
import Image from "next/image"

interface RelatedVideosProps {
  videoId: string
}

export function RelatedVideos({ videoId }: RelatedVideosProps) {
  // In a real app, this would be fetched from an API based on the videoId
  const relatedVideos = [
    {
      id: "related-1",
      title: "The Witcher: Season 2 Official Trailer",
      thumbnail: "/placeholder.svg?height=169&width=300",
      duration: "2:15",
    },
    {
      id: "related-2",
      title: "Stranger Things 4 | From Russia With Love...",
      thumbnail: "/placeholder.svg?height=169&width=300",
      duration: "1:45",
    },
    {
      id: "related-3",
      title: "The Umbrella Academy Season 3 | First Look",
      thumbnail: "/placeholder.svg?height=169&width=300",
      duration: "3:10",
    },
    {
      id: "related-4",
      title: "Money Heist: Part 5 | Official Trailer",
      thumbnail: "/placeholder.svg?height=169&width=300",
      duration: "2:30",
    },
    {
      id: "related-5",
      title: "Ozark: Season 4 | Announcement Teaser",
      thumbnail: "/placeholder.svg?height=169&width=300",
      duration: "1:55",
    },
  ]

  return (
    <div className="space-y-4">
      {relatedVideos.map((video) => (
        <Link key={video.id} href={`/watch/${video.id}`} className="flex gap-3 group">
          <div className="relative flex-none w-32 sm:w-40">
            <div className="aspect-video relative rounded-md overflow-hidden">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute bottom-1 right-1 text-xs bg-black/80 px-1 rounded">{video.duration}</div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
