"use client"

import { Input } from "@/components/ui/input"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ContentGrid } from "@/components/content-grid"
import { useAuth } from "@/hooks/use-auth"
import { getUserWatchlist, getUserHistory } from "@/lib/api"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()
  const [watchlist, setWatchlist] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      router.push("/login?redirect=/profile")
    }

    const fetchUserData = async () => {
      if (user) {
        setIsLoadingData(true)
        try {
          // In a real app, these would fetch from an API
          const [watchlistData, historyData] = await Promise.all([getUserWatchlist(user.id), getUserHistory(user.id)])

          setWatchlist(watchlistData)
          setHistory(historyData)
        } catch (error) {
          console.error("Failed to fetch user data:", error)
        } finally {
          setIsLoadingData(false)
        }
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="watchlist" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
            <TabsTrigger value="history">Watch History</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="watchlist">
            {isLoadingData ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {watchlist.length > 0 ? (
                  <ContentGrid items={watchlist} />
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
                    <p className="text-gray-400 mb-4">
                      Add movies and TV shows to your watchlist to keep track of what you want to watch.
                    </p>
                    <Button onClick={() => router.push("/")}>Browse Content</Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="history">
            {isLoadingData ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {history.length > 0 ? (
                  <ContentGrid items={history} />
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">Your watch history is empty</h3>
                    <p className="text-gray-400 mb-4">Videos you watch will appear here.</p>
                    <Button onClick={() => router.push("/")}>Browse Content</Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

              <div className="space-y-6">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" defaultValue={user.name} />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" defaultValue={user.email} disabled />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input id="password" type="password" value="********" disabled />
                  <Button variant="outline" size="sm" className="mt-1 w-fit">
                    Change Password
                  </Button>
                </div>

                <div className="pt-4">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
