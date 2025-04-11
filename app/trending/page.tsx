"use client"

import { useState, useEffect } from "react"
import { Flame } from "lucide-react"

import { ContentGrid } from "@/components/content-grid"
import { getTrendingContent } from "@/lib/api"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TrendingPage() {
  const [content, setContent] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchTrendingContent = async () => {
      setIsLoading(true)
      try {
        const data = await getTrendingContent(20)
        setContent(data)
      } catch (error) {
        console.error("Failed to fetch trending content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrendingContent()
  }, [])

  const filteredContent = content.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "movies") return item.category === "movie"
    if (activeTab === "tvshows") return item.category === "tv-show"
    return true
  })

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Flame className="w-6 h-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Trending Now</h1>
        </div>

        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="tvshows">TV Shows</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {filteredContent.length > 0 ? (
              <div>
                <ContentGrid
                  items={filteredContent.map((item) => ({
                    ...item,
                    subtitle: `Trending • ${
                      item.category === "movie" ? item.duration : `${item.episodeCount} Episodes`
                    }`,
                  }))}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No trending content found</h3>
                <p className="text-gray-400">Check back later for trending content.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
