"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Search, User, X, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { useNavigationVisibility } from "@/hooks/use-navigation-visibility"

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
  const [searchError, setSearchError] = useState<string | null>(null)

  // Get navigation visibility state from context
  const { isNavVisible } = useNavigationVisibility()

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
    setSearchError(null)

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

        try {
          // Navigate to search page with the query
          router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        } catch (error) {
          console.error("Error navigating to search page:", error)
          setSearchError("Failed to perform search. Please try again.")
        }
      }, 500)

      setSearchTimeout(timeout)
    }
  }

  // Clear search button handler
  const handleClearSearch = (inputType: "desktop" | "mobile") => {
    setSearchQuery("")
    setSearchError(null)
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

  // Handle click outside mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest(".mobile-menu-container")) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Determine if this is a watch page
  const isWatchPage = pathname.startsWith("/watch")

  // Apply transition classes based on navigation visibility
  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled || mobileMenuOpen ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"
  } ${isWatchPage && !isNavVisible ? "-translate-y-full" : "translate-y-0"}`

  // Navigation links with active state
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/tv-shows", label: "TV Shows" },
    { href: "/new", label: "New & Popular" },
  ]

  return (
    <header className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <svg
                width="120"
                height="36"
                viewBox="0 0 120 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-8 sm:w-32 sm:h-10"
              >
                <path
                  d="M116.626 24.1314L117.441 21.6522H120L116.142 32.2939C115.715 33.4192 115.211 34.182 114.591 34.6016C113.951 35.0402 113.039 35.25 111.837 35.25C111.43 35.25 111.081 35.2309 110.771 35.1928V33.3047H111.702C112.225 33.3047 112.632 33.1712 112.923 32.8661C113.195 32.58 113.35 32.1986 113.35 31.7218C113.35 31.2641 113.195 30.5966 112.884 29.7384L109.976 21.6522H112.613L113.427 24.1124C113.989 25.8669 114.513 27.6978 115.017 29.6049C115.405 28.1745 115.928 26.3437 116.626 24.1314Z"
                  fill="#F50600"
                />
                {/* SVG path data continues... */}
              </svg>
            </Link>

            <nav className="hidden md:flex ml-8 space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    pathname === link.href ? "text-white font-medium" : "text-gray-300 hover:text-white"
                  }`}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop search */}
            <div className="hidden md:block relative">
              <Input
                ref={desktopSearchRef}
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e, "desktop")}
                onFocus={() => setActiveSearchInput("desktop")}
                className="w-48 lg:w-64 bg-gray-900/50 border-gray-700 focus:bg-gray-900 pr-16"
                data-testid="desktop-search-input"
                aria-label="Search"
              />
              {searchQuery ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-8 top-0 h-full"
                  onClick={() => handleClearSearch("desktop")}
                  data-testid="desktop-clear-button"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              ) : null}
              <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" aria-label="Search">
                <Search className="w-4 h-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>

            {/* User profile or sign in button */}
            {user ? (
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Profile">
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

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Menu"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-black border-t border-gray-800 mobile-menu-container"
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm py-2 ${pathname === link.href ? "text-white font-medium" : "text-gray-300"}`}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}

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
                    aria-label="Search"
                  />
                  {searchQuery ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-8 top-0 h-full"
                      onClick={() => handleClearSearch("mobile")}
                      data-testid="mobile-clear-button"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" aria-label="Search">
                    <Search className="w-4 h-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Search error alert */}
      {searchError && (
        <div className="container mx-auto px-4 mt-2">
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        </div>
      )}
    </header>
  )
}
