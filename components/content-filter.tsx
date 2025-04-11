"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SortAsc } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ContentFilterProps {
  genres?: string[]
  years?: string[]
  ratings?: string[]
  onFilterChange: (filters: any) => void
  showGenreFilter?: boolean
  showYearFilter?: boolean
  showRatingFilter?: boolean
}

export function ContentFilter({
  genres = [],
  years = [],
  ratings = [],
  onFilterChange,
  showGenreFilter = true,
  showYearFilter = true,
  showRatingFilter = true,
}: ContentFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    genre: searchParams.get("genre") || "",
    year: searchParams.get("year") || "",
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "popularity",
  })

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.genre) params.set("genre", filters.genre)
    if (filters.year) params.set("year", filters.year)
    if (filters.rating) params.set("rating", filters.rating)
    if (filters.sort) params.set("sort", filters.sort)

    const url = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, "", url)

    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      genre: "",
      year: "",
      rating: "",
      sort: "popularity",
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex flex-wrap gap-4">
        {showGenreFilter && genres.length > 0 && (
          <Select value={filters.genre} onValueChange={(value) => handleFilterChange("genre", value)}>
            <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Genres</SelectLabel>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        {showYearFilter && years.length > 0 && (
          <Select value={filters.year} onValueChange={(value) => handleFilterChange("year", value)}>
            <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Release Year</SelectLabel>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        {showRatingFilter && ratings.length > 0 && (
          <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
            <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Content Rating</SelectLabel>
                <SelectItem value="all">All Ratings</SelectItem>
                {ratings.map((rating) => (
                  <SelectItem key={rating} value={rating}>
                    {rating}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        {(filters.genre || filters.year || filters.rating) && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="h-10">
            Clear Filters
          </Button>
        )}
      </div>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-gray-900 border-gray-700">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => handleFilterChange("sort", "popularity")}
                className={filters.sort === "popularity" ? "bg-accent" : ""}
              >
                Popularity
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("sort", "newest")}
                className={filters.sort === "newest" ? "bg-accent" : ""}
              >
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("sort", "oldest")}
                className={filters.sort === "oldest" ? "bg-accent" : ""}
              >
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("sort", "az")}
                className={filters.sort === "az" ? "bg-accent" : ""}
              >
                A-Z
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("sort", "za")}
                className={filters.sort === "za" ? "bg-accent" : ""}
              >
                Z-A
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
