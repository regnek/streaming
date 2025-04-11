"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveVideo } from "@/lib/api"

interface AdminVideoFormProps {
  video?: any
  onCancel: () => void
  onSave: (video: any) => void
}

export function AdminVideoForm({ video, onCancel, onSave }: AdminVideoFormProps) {
  const [formData, setFormData] = useState({
    id: video?.id || `video-${Date.now()}`,
    title: video?.title || "",
    description: video?.description || "",
    thumbnail: video?.thumbnail || "/placeholder.svg?height=169&width=300",
    videoUrl: video?.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: video?.category || "movie",
    releaseYear: video?.releaseYear || new Date().getFullYear().toString(),
    duration: video?.duration || "1h 30m",
    rating: video?.rating || "PG-13",
    genres: video?.genres || ["Action", "Adventure"],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const genresString = e.target.value
    const genresArray = genresString
      .split(",")
      .map((genre) => genre.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, genres: genresArray }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title || !formData.description) {
      setError("Title and description are required")
      return
    }

    setIsSubmitting(true)
    try {
      // In a real app, this would save to an API
      const savedVideo = await saveVideo(formData)
      onSave(savedVideo)
    } catch (err: any) {
      setError(err.message || "Failed to save video")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{video ? "Edit Content" : "Add New Content"}</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-900/50 border border-red-800 rounded-md text-red-200 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="tv-show">TV Show</SelectItem>
                <SelectItem value="documentary">Documentary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="releaseYear" className="text-sm font-medium">
              Release Year
            </label>
            <Input
              id="releaseYear"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm font-medium">
              Duration
            </label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="rating" className="text-sm font-medium">
              Rating
            </label>
            <Select value={formData.rating} onValueChange={(value) => handleSelectChange("rating", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="G">G</SelectItem>
                <SelectItem value="PG">PG</SelectItem>
                <SelectItem value="PG-13">PG-13</SelectItem>
                <SelectItem value="R">R</SelectItem>
                <SelectItem value="TV-Y">TV-Y</SelectItem>
                <SelectItem value="TV-G">TV-G</SelectItem>
                <SelectItem value="TV-PG">TV-PG</SelectItem>
                <SelectItem value="TV-14">TV-14</SelectItem>
                <SelectItem value="TV-MA">TV-MA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="genres" className="text-sm font-medium">
              Genres (comma separated)
            </label>
            <Input
              id="genres"
              name="genres"
              value={formData.genres.join(", ")}
              onChange={handleGenreChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="thumbnail" className="text-sm font-medium">
              Thumbnail URL
            </label>
            <Input
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="videoUrl" className="text-sm font-medium">
              Video URL
            </label>
            <Input
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="bg-gray-800 border-gray-700 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Content"}
          </Button>
        </div>
      </form>
    </div>
  )
}
