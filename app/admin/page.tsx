"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { getAllVideos, deleteVideo } from "@/lib/api"
import { AdminVideoForm } from "@/components/admin-video-form"

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading, isAdmin } = useAuth()
  const [videos, setVideos] = useState<any[]>([])
  const [isLoadingVideos, setIsLoadingVideos] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<any>(null)

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!isLoading && (!user || !isAdmin)) {
      router.push("/login?redirect=/admin")
    }

    const fetchVideos = async () => {
      if (user && isAdmin) {
        setIsLoadingVideos(true)
        try {
          const allVideos = await getAllVideos()
          setVideos(allVideos)
        } catch (error) {
          console.error("Failed to fetch videos:", error)
        } finally {
          setIsLoadingVideos(false)
        }
      }
    }

    if (user && isAdmin) {
      fetchVideos()
    }
  }, [user, isLoading, isAdmin, router])

  const handleDeleteVideo = async (videoId: string) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(videoId)
        setVideos(videos.filter((video) => video.id !== videoId))
      } catch (error) {
        console.error("Failed to delete video:", error)
      }
    }
  }

  const filteredVideos = videos.filter((video) => video.title.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading || !user || !isAdmin) {
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
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button
            onClick={() => {
              setShowAddForm(true)
              setEditingVideo(null)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Content
          </Button>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            {showAddForm || editingVideo ? (
              <AdminVideoForm
                video={editingVideo}
                onCancel={() => {
                  setShowAddForm(false)
                  setEditingVideo(null)
                }}
                onSave={(savedVideo) => {
                  if (editingVideo) {
                    setVideos(videos.map((v) => (v.id === savedVideo.id ? savedVideo : v)))
                  } else {
                    setVideos([...videos, savedVideo])
                  }
                  setShowAddForm(false)
                  setEditingVideo(null)
                }}
              />
            ) : (
              <>
                <div className="mb-6">
                  <Input
                    type="search"
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md bg-gray-900 border-gray-700"
                  />
                </div>

                {isLoadingVideos ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4">Title</th>
                          <th className="text-left py-3 px-4">Category</th>
                          <th className="text-left py-3 px-4">Release Year</th>
                          <th className="text-left py-3 px-4">Duration</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVideos.length > 0 ? (
                          filteredVideos.map((video) => (
                            <tr key={video.id} className="border-b border-gray-800 hover:bg-gray-900">
                              <td className="py-3 px-4">{video.title}</td>
                              <td className="py-3 px-4">{video.category}</td>
                              <td className="py-3 px-4">{video.releaseYear}</td>
                              <td className="py-3 px-4">{video.duration}</td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => setEditingVideo(video)}>
                                    <Pencil className="w-4 h-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteVideo(video.id)}>
                                    <Trash2 className="w-4 h-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-400">
                              No content found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="users">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">User Management</h3>
              <p className="text-gray-400">User management functionality will be implemented in the next phase.</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-400">Analytics functionality will be implemented in the next phase.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
