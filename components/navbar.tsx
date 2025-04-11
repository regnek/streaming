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
            <Link href="/">
              <svg width="160" height="46" viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M155.502 31.1752L156.588 27.8695H160L154.856 42.0586C154.287 43.5589 153.615 44.576 152.787 45.1354C151.934 45.7203 150.719 46 149.116 46C148.574 46 148.108 45.9746 147.695 45.9237V43.4063H148.935C149.633 43.4063 150.176 43.2283 150.564 42.8214C150.926 42.44 151.133 41.9315 151.133 41.2957C151.133 40.6855 150.926 39.7955 150.512 38.6512L146.635 27.8695H150.151L151.236 31.1498C151.986 33.4892 152.684 35.9304 153.356 38.4732C153.873 36.5661 154.571 34.1249 155.502 31.1752Z" fill="#F50600"/>
                <path d="M145.089 27.6661C145.373 27.6661 145.632 27.6915 145.89 27.717V30.6667H145.063C143.822 30.6667 142.866 30.9972 142.194 31.6075C141.521 32.2178 141.211 33.1332 141.211 34.3284V40.9906H137.954V27.8695H141.108V30.209C141.832 28.5307 143.176 27.6661 145.089 27.6661Z" fill="#F50600"/>
                <path d="M136.013 40.9906H132.756C132.601 40.7363 132.472 40.2023 132.394 39.3886C131.489 40.66 130.068 41.2957 128.103 41.2957C126.629 41.2957 125.466 40.9652 124.587 40.2532C123.708 39.5666 123.294 38.6003 123.294 37.3543C123.294 34.9641 125.001 33.6164 128.413 33.2604L130.429 33.0824C131.102 33.0061 131.567 32.8535 131.877 32.6247C132.162 32.3958 132.317 32.0398 132.317 31.5821C132.317 31.0227 132.11 30.6158 131.748 30.3615C131.386 30.1072 130.766 29.9547 129.887 29.9547C128.93 29.9547 128.258 30.1327 127.844 30.4378C127.431 30.743 127.172 31.277 127.12 32.0398H123.915C124.096 29.0647 126.086 27.5644 129.912 27.5644C133.609 27.5644 135.471 28.8867 135.471 31.5058V38.4986C135.471 39.6683 135.652 40.482 136.013 40.9906ZM128.878 39.0072C129.887 39.0072 130.714 38.7529 131.36 38.1935C131.981 37.6341 132.317 36.8458 132.317 35.8032V34.6081C132.006 34.8878 131.489 35.0658 130.791 35.1421L129.033 35.3455C128.155 35.4472 127.534 35.6506 127.172 35.9558C126.81 36.2609 126.629 36.6678 126.629 37.2272C126.629 37.7866 126.81 38.2443 127.198 38.5495C127.586 38.8546 128.155 39.0072 128.878 39.0072Z" fill="#F50600"/>
                <path d="M122.242 27.6661C122.526 27.6661 122.784 27.6915 123.043 27.717V30.6667H122.216C120.975 30.6667 120.018 30.9972 119.346 31.6075C118.674 32.2178 118.364 33.1332 118.364 34.3284V40.9906H115.106V27.8695H118.26V30.209C118.984 28.5307 120.329 27.6661 122.242 27.6661Z" fill="#F50600"/>
                <path d="M107.1 27.5644C108.91 27.5644 110.383 28.2001 111.469 29.4207C112.529 30.6921 113.072 32.3449 113.072 34.4301C113.072 36.5152 112.529 38.168 111.469 39.414C110.383 40.6855 108.91 41.2957 107.1 41.2957C105.213 41.2957 103.791 40.5837 102.835 39.1089V40.9906H99.7065V22.8856H102.964V29.5732C103.894 28.251 105.29 27.5644 107.1 27.5644ZM103.817 37.5578C104.386 38.2952 105.239 38.6512 106.325 38.6512C107.384 38.6512 108.238 38.2698 108.858 37.5069C109.453 36.7695 109.763 35.7015 109.763 34.3284C109.763 33.0061 109.453 31.9889 108.858 31.2769C108.263 30.565 107.41 30.209 106.325 30.209C105.239 30.209 104.386 30.5904 103.791 31.3024C103.171 32.0398 102.886 33.0824 102.886 34.4301C102.886 35.8032 103.196 36.8458 103.817 37.5578Z" fill="#F50600"/>
                <path d="M97.0991 40.9906H93.8418V27.8695H97.0991V40.9906Z" fill="#F50600"/>
                <path d="M83.3322 22.8856V37.9138H92.096V40.9906H79.8423V24.2841L83.3322 22.8856Z" fill="#F50600"/>
                <path d="M66.7894 27.5644C68.2371 27.5644 69.3745 27.9967 70.2018 28.8358C71.0291 29.7004 71.4427 30.8447 71.4427 32.3195V40.9906H68.1854V32.8281C68.1854 31.1752 67.4098 30.3361 65.8846 30.3361C65.0573 30.3361 64.3852 30.6412 63.8681 31.2261C63.3511 31.811 63.1184 32.6501 63.1184 33.7689V40.9906H59.887V32.8281C59.887 31.1752 59.1114 30.3361 57.5603 30.3361C56.733 30.3361 56.0867 30.6412 55.5697 31.2261C55.0527 31.811 54.82 32.6501 54.82 33.7689V40.9906H51.5627V27.8695H54.7166V29.7512C55.6214 28.3018 56.8882 27.5644 58.5168 27.5644C60.5332 27.5644 61.9292 28.3781 62.6531 30.0055C63.6355 28.3781 65.0314 27.5644 66.7894 27.5644Z" fill="#F50600"/>
                <path d="M48.9377 40.9906H45.6804V22.8856H48.9377V40.9906Z" fill="#F50600"/>
                <path d="M43.0555 40.9906H39.7981V27.8695H43.0555V40.9906Z" fill="#F50600"/>
                <path d="M38.4157 22.8856V25.9624H28.9022V30.2344H37.5626V33.1841H28.9022V40.9906H25.4123V22.8856H38.4157Z" fill="#F50600"/>
                <path d="M108.836 4.78054C109.12 4.78054 109.379 4.80597 109.637 4.8314V7.78109H108.81C107.569 7.78109 106.613 8.11166 105.941 8.72194C105.268 9.33223 104.958 10.2476 104.958 11.4428V18.105H101.701V4.98397H104.855V7.32338C105.579 5.64511 106.923 4.78054 108.836 4.78054Z" fill="#F50600"/>
                <path d="M99.5976 11.7734V12.5362H89.6189C89.7223 13.6551 90.0842 14.5196 90.6788 15.079C91.2734 15.6385 92.0748 15.9182 93.083 15.9182C94.5565 15.9182 95.5648 15.3079 96.1335 14.0365H99.2616C98.8996 15.3842 98.1758 16.4522 97.09 17.2405C95.9784 18.0287 94.6341 18.4102 93.0571 18.4102C91.0666 18.4102 89.4637 17.7999 88.2487 16.5285C87.0078 15.2825 86.4133 13.6296 86.4133 11.5445C86.4133 9.4848 87.0078 7.83195 88.2229 6.56053C89.4379 5.31454 91.0407 4.67883 93.0054 4.67883C95.0219 4.67883 96.6247 5.33996 97.8139 6.63681C99.003 7.95909 99.5976 9.6628 99.5976 11.7734ZM92.9796 7.17081C91.0666 7.17081 89.9549 8.21338 89.6447 10.2985H96.3403C96.1852 9.33223 95.8233 8.56937 95.2545 8.00995C94.66 7.45052 93.9103 7.17081 92.9796 7.17081Z" fill="#F50600"/>
                <path d="M81.2247 6.78938V4.98397H84.3786V17.6727C84.3786 19.4527 83.784 20.8513 82.6466 21.8684C81.5091 22.8856 79.8804 23.3941 77.7864 23.3941C75.9251 23.3941 74.4516 22.9873 73.3917 22.1736C72.3317 21.3599 71.763 20.241 71.6596 18.817H74.8652C75.0203 20.241 76.0027 20.9276 77.8381 20.9276C78.8981 20.9276 79.6995 20.6733 80.2682 20.1139C80.8369 19.5799 81.1213 18.7916 81.1213 17.749V16.0962C80.139 17.4185 78.7947 18.0542 77.0367 18.0542C75.2271 18.0542 73.7536 17.4439 72.6678 16.1979C71.5562 15.0028 71.0133 13.4008 71.0133 11.3665C71.0133 9.33223 71.5562 7.73024 72.6678 6.50967C73.7536 5.28911 75.2013 4.67883 77.0109 4.67883C78.8722 4.67883 80.2941 5.39082 81.2247 6.78938ZM77.7606 15.4096C78.8464 15.4096 79.6736 15.0536 80.2941 14.3416C80.8887 13.6296 81.1989 12.6379 81.1989 11.3665C81.1989 10.0951 80.8887 9.10337 80.2941 8.39137C79.6736 7.67938 78.8464 7.32338 77.7606 7.32338C76.7007 7.32338 75.8734 7.70481 75.253 8.4168C74.6325 9.1288 74.3482 10.1205 74.3482 11.3919C74.3482 12.6633 74.6325 13.6296 75.253 14.3416C75.8734 15.0536 76.7007 15.4096 77.7606 15.4096Z" fill="#F50600"/>
                <path d="M64.2813 4.67883C65.729 4.67883 66.8665 5.11111 67.6938 5.92482C68.521 6.73853 68.9605 7.90823 68.9605 9.40851V18.105H65.7032V9.94251C65.7032 8.28966 64.8501 7.45052 63.1956 7.45052C62.3683 7.45052 61.6445 7.75566 61.0757 8.34052C60.507 8.92537 60.2226 9.73908 60.2226 10.7562V18.105H56.9653V4.98397H60.1192V6.86567C61.1274 5.41625 62.5234 4.67883 64.2813 4.67883Z" fill="#F50600"/>
                <path d="M54.862 11.7734V12.5362H44.8832C44.9867 13.6551 45.3486 14.5196 45.9432 15.079C46.5378 15.6385 47.3392 15.9182 48.3474 15.9182C49.8209 15.9182 50.8292 15.3079 51.3979 14.0365H54.5259C54.164 15.3842 53.4402 16.4522 52.3544 17.2405C51.2428 18.0287 49.8985 18.4102 48.3215 18.4102C46.3309 18.4102 44.7281 17.7999 43.5131 16.5285C42.2722 15.2825 41.6776 13.6296 41.6776 11.5445C41.6776 9.4848 42.2722 7.83195 43.4873 6.56053C44.7023 5.31454 46.3051 4.67883 48.2698 4.67883C50.2863 4.67883 51.8891 5.33996 53.0783 6.63681C54.2674 7.95909 54.862 9.6628 54.862 11.7734ZM48.244 7.17081C46.3309 7.17081 45.2193 8.21338 44.9091 10.2985H51.6047C51.4496 9.33223 51.0877 8.56937 50.5189 8.00995C49.9243 7.45052 49.1746 7.17081 48.244 7.17081Z" fill="#F50600"/>
                <path d="M37.5109 0H41.854L34.2794 7.37424L41.854 18.105H37.6918L31.7976 9.6628L28.9022 12.4345V18.105H25.4123V0H28.9022V8.54395L37.5109 0Z" fill="#F50600"/>
                <path d="M43.237 24.4621C43.237 25.4452 42.4268 26.2421 41.4274 26.2421C40.428 26.2421 39.6178 25.4452 39.6178 24.4621C39.6178 23.4791 40.428 22.6821 41.4274 22.6821C42.4268 22.6821 43.237 23.4791 43.237 24.4621Z" fill="#F50600"/>
                <path d="M97.3318 24.4621C97.3318 25.4452 96.5216 26.2421 95.5222 26.2421C94.5227 26.2421 93.7125 25.4452 93.7125 24.4621C93.7125 23.4791 94.5227 22.6821 95.5222 22.6821C96.5216 22.6821 97.3318 23.4791 97.3318 24.4621Z" fill="#F50600"/>
                <path d="M22.2456 7.11487V7.57258H16.2584C16.3204 8.24389 16.5376 8.76263 16.8943 9.09829C17.2511 9.43394 17.7319 9.60177 18.3368 9.60177C19.221 9.60177 19.8259 9.2356 20.1671 8.47275H22.044C21.8268 9.28137 21.3925 9.92217 20.741 10.3951C20.0741 10.8681 19.2675 11.097 18.3213 11.097C17.127 11.097 16.1653 10.7308 15.4363 9.96794C14.6917 9.22034 14.335 8.22864 14.335 6.97756C14.335 5.74174 14.6917 4.75003 15.4208 3.98718C16.1498 3.23958 17.1115 2.85816 18.2903 2.85816C19.5002 2.85816 20.4618 3.25484 21.1754 4.03295C21.8889 4.82631 22.2456 5.84854 22.2456 7.11487ZM18.2748 4.35335C17.127 4.35335 16.46 4.97888 16.2739 6.22996H20.2912C20.1982 5.65019 19.981 5.19248 19.6398 4.85683C19.283 4.52117 18.8332 4.35335 18.2748 4.35335Z" fill="#F50600"/>
                <path d="M10.2958 2.85815C11.1644 2.85815 11.8469 3.11752 12.3433 3.60575C12.8396 4.09397 13.1033 4.7958 13.1033 5.69596V10.9139H11.1489V6.01636C11.1489 5.02465 10.6371 4.52117 9.64435 4.52117C9.148 4.52117 8.71369 4.70426 8.37245 5.05517C8.0312 5.40608 7.86058 5.89431 7.86058 6.50459V10.9139H5.90619V0.0508561H7.86058V4.09397C8.46551 3.27009 9.27209 2.85815 10.2958 2.85815Z" fill="#F50600"/>
                <path d="M4.76189 3.04124V4.50591H3.17976V8.76263C3.17976 9.022 3.24181 9.20508 3.38141 9.29663C3.52101 9.40343 3.75367 9.4492 4.09491 9.4492H4.76189V10.9139C4.32758 10.9596 3.98634 10.9749 3.73816 10.9749C2.86954 10.9749 2.23359 10.8223 1.8303 10.5019C1.42702 10.1815 1.24088 9.6628 1.24088 8.96097V4.50591H0V3.04124H1.24088V0.752679H3.17976V3.04124H4.76189Z" fill="#F50600"/>
              </svg>

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
