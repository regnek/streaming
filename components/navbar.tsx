"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Search, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const [previousPage, setPreviousPage] = useState<string | null>(null)
  const [shouldFocusAfterNavigation, setShouldFocusAfterNavigation] = useState(false)
  const [lastActiveInput, setLastActiveInput] = useState<"desktop" | "mobile" | null>(null)

  // Refs for search input fields
  const desktopSearchRef = useRef<HTMLInputElement>(null)
  const mobileSearchRef = useRef<HTMLInputElement>(null)

  // Track which search input is active
  const [activeSearchInput, setActiveSearchInput] = useState<"desktop" | "mobile" | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Store the previous page when navigating to search
  useEffect(() => {
    if (!pathname.startsWith("/search")) {
      setPreviousPage(pathname)
    }
  }, [pathname])

  // Focus input after navigation if needed
  useEffect(() => {
    if (shouldFocusAfterNavigation && lastActiveInput) {
      // Use a longer timeout to ensure the DOM has updated after navigation
      const focusTimer = setTimeout(() => {
        if (lastActiveInput === "desktop" && desktopSearchRef.current) {
          desktopSearchRef.current.focus()
        } else if (lastActiveInput === "mobile" && mobileSearchRef.current) {
          mobileSearchRef.current.focus()
        }
        setShouldFocusAfterNavigation(false)
      }, 150)

      return () => clearTimeout(focusTimer)
    }
  }, [shouldFocusAfterNavigation, lastActiveInput, pathname])

  // Debounced search function
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>, inputType: "desktop" | "mobile") => {
    const query = e.target.value
    setSearchQuery(query)
    setActiveSearchInput(inputType)
    setLastActiveInput(inputType)

    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // If the search is cleared and we're on the search page, navigate back
    if (query.trim() === "" && pathname.startsWith("/search")) {
      const timeout = setTimeout(() => {
        const targetPage = previousPage || "/"
        setShouldFocusAfterNavigation(true)
        router.push(targetPage)
      }, 300) // Short delay to prevent accidental navigation

      setSearchTimeout(timeout)
      return
    }

    // Only navigate if there's actually a query
    if (query.trim()) {
      // Set a new timeout for 500ms
      const timeout = setTimeout(() => {
        setShouldFocusAfterNavigation(true)
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }, 500)

      setSearchTimeout(timeout)
    }
  }

  // Clear search button handler
  const handleClearSearch = (inputType: "desktop" | "mobile") => {
    setSearchQuery("")
    setLastActiveInput(inputType)

    // If we're on the search page, navigate back
    if (pathname.startsWith("/search")) {
      const targetPage = previousPage || "/"
      setShouldFocusAfterNavigation(true)
      router.push(targetPage)
    } else {
      // If we're not on the search page, just focus the input
      if (inputType === "desktop" && desktopSearchRef.current) {
        desktopSearchRef.current.focus()
      } else if (inputType === "mobile" && mobileSearchRef.current) {
        mobileSearchRef.current.focus()
      }
    }
  }

  // Maintain focus after component updates
  useEffect(() => {
    if (activeSearchInput === "desktop" && desktopSearchRef.current) {
      desktopSearchRef.current.focus()
    } else if (activeSearchInput === "mobile" && mobileSearchRef.current) {
      mobileSearchRef.current.focus()
    }
  }, [activeSearchInput])

  // Clear the timeout when component unmounts
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-red-600">
              StreamFlix
            </Link>

            <nav className="hidden md:flex ml-8 space-x-6">
              <Link
                href="/"
                className={`text-sm ${pathname === "/" ? "text-white font-medium" : "text-gray-300 hover:text-white"}`}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className={`text-sm ${pathname === "/movies" ? "text-white font-medium" : "text-gray-300 hover:text-white"}`}
              >
                Movies
              </Link>
              <Link
                href="/tv-shows"
                className={`text-sm ${pathname === "/tv-shows" ? "text-white font-medium" : "text-gray-300 hover:text-white"}`}
              >
                TV Shows
              </Link>
              <Link
                href="/new"
                className={`text-sm ${pathname === "/new" ? "text-white font-medium" : "text-gray-300 hover:text-white"}`}
              >
                New & Popular
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex">
              <div className="relative">
                <Input
                  ref={desktopSearchRef}
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e, "desktop")}
                  onFocus={() => setActiveSearchInput("desktop")}
                  className="w-48 lg:w-64 bg-gray-900/50 border-gray-700 focus:bg-gray-900 pr-16"
                  data-testid="desktop-search-input"
                />
                {searchQuery ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-8 top-0 h-full"
                    onClick={() => handleClearSearch("desktop")}
                    data-testid="desktop-clear-button"
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

            {user ? (
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`text-sm ${pathname === "/" ? "text-white font-medium" : "text-gray-300"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className={`text-sm ${pathname === "/movies" ? "text-white font-medium" : "text-gray-300"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Movies
              </Link>
              <Link
                href="/tv-shows"
                className={`text-sm ${pathname === "/tv-shows" ? "text-white font-medium" : "text-gray-300"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                TV Shows
              </Link>
              <Link
                href="/new"
                className={`text-sm ${pathname === "/new" ? "text-white font-medium" : "text-gray-300"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                New & Popular
              </Link>

              <div className="pt-2">
                <div className="relative">
                  <Input
                    ref={mobileSearchRef}
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e, "mobile")}
                    onFocus={() => setActiveSearchInput("mobile")}
                    className="w-full bg-gray-900 border-gray-700 pr-16"
                    data-testid="mobile-search-input"
                  />
                  {searchQuery ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-8 top-0 h-full"
                      onClick={() => handleClearSearch("mobile")}
                      data-testid="mobile-clear-button"
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
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
