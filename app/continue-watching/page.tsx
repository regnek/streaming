"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { History } from "lucide-react"

import { ContentGrid } from "@/components/content-grid"
import { Button } from "@/components/ui/button"
import { getContinueWatching } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function ContinueWatchingPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [content, setContent] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect if not logged in
    if (!authLoading && !user) {
      router.push("/login?redirect=/continue-watching")
      return
    }

    const fetchContinueWatching = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const data = await getContinueWatching(user.id)
        setContent(data)
      } catch (error) {
        console.error("Failed to fetch continue watching:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchContinueWatching()
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <History className="w-6 h-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Continue Watching</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {content.length > 0 ? (
              <div>
                <ContentGrid
                  items={content.map((item) => ({
                    ...item,
                    subtitle: `Last watched ${new Date(item.lastWatched).toLocaleDateString()}`,
                  }))}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">Your continue watching list is empty</h3>
                <p className="text-gray-400 mb-4">Start watching some content to see it here.</p>
                <Button onClick={() => router.push("/")}>Browse Content</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
