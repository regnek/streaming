"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ContentGrid } from "@/components/content-grid"
import { searchVideos } from "@/lib/api"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const [previousPage, setPreviousPage] = useState<string | null>(null)
  const [shouldFocusAfterNavigation, setShouldFocusAfterNavigation] = useState(false)

  // Reference to the search input
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Track if the input has been focused
  const [hasBeenFocused, setHasBeenFocused] = useState(false)

  // Store the previous page from localStorage when component mounts
  useEffect(() => {
    const storedPreviousPage = localStorage.getItem("previousPage")
    if (storedPreviousPage) {
      setPreviousPage(storedPreviousPage)
    }
  }, [])

  // Function to perform the search
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      // In a real app, this would search via an API
      const searchResults = await searchVideos(searchQuery)
      setResults(searchResults)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial search when page loads with a query parameter
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }

    // Auto-focus the search input when the page loads
    if (searchInputRef.current) {
      searchInputRef.current.focus()
      setHasBeenFocused(true)
    }
  }, [initialQuery])

  // Focus input after navigation if needed
  useEffect(() => {
    if (shouldFocusAfterNavigation) {
      // Use a longer timeout to ensure the DOM has updated after navigation
      const focusTimer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
        setShouldFocusAfterNavigation(false)
      }, 150)

      return () => clearTimeout(focusTimer)
    }
  }, [shouldFocusAfterNavigation])

  // Handle search input with debouncing
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    setHasBeenFocused(true)

    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // If search is cleared, navigate back to previous page
    if (!newQuery.trim()) {
      const timeout = setTimeout(() => {
        const targetPage = previousPage || "/"
        setShouldFocusAfterNavigation(true)
        router.push(targetPage)
      }, 300) // Short delay to prevent accidental navigation

      setSearchTimeout(timeout)
      return
    }

    // Set a new timeout for 500ms
    const timeout = setTimeout(() => {
      // Update the URL with the search query without causing a navigation
      if (newQuery.trim()) {
        const url = new URL(window.location.href)
        url.searchParams.set("q", newQuery)
        window.history.pushState({}, "", url.toString())
      } else {
        // Remove query parameter if search is empty
        const url = new URL(window.location.href)
        url.searchParams.delete("q")
        window.history.pushState({}, "", url.toString())
      }

      // Perform the search
      performSearch(newQuery)

      // Ensure input maintains focus after URL update
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }, 500)

    setSearchTimeout(timeout)
  }

  // Handle clear search button
  const handleClearSearch = () => {
    setQuery("")

    // Navigate back to previous page
    const targetPage = previousPage || "/"
    setShouldFocusAfterNavigation(true)
    router.push(targetPage)
  }

  // Maintain focus after component updates if the input has been focused before
  useEffect(() => {
    if (hasBeenFocused && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [results, isLoading, hasBeenFocused])

  // Clear the timeout when component unmounts
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Search</h1>

        <div className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search for movies, TV shows, genres..."
              value={query}
              onChange={handleSearchInput}
              onFocus={() => setHasBeenFocused(true)}
              className="bg-gray-900 border-gray-700 w-full pr-16"
              data-testid="search-page-input"
            />
            {query ? (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-8 top-0 h-full"
                onClick={handleClearSearch}
                data-testid="search-page-clear-button"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            ) : null}
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
              <Search className="w-4 h-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {query && (
              <h2 className="text-xl mb-4">
                {results.length > 0 ? `Search results for "${query}"` : `No results found for "${query}"`}
              </h2>
            )}

            {results.length > 0 && <ContentGrid items={results} />}
          </>
        )}
      </div>
    </div>
  )
}
