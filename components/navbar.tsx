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
              <svg width="120" height="36" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M116.626 24.1314L117.441 21.6522H120L116.142 32.2939C115.715 33.4192 115.211 34.182 114.591 34.6016C113.951 35.0402 113.039 35.25 111.837 35.25C111.43 35.25 111.081 35.2309 110.771 35.1928V33.3047H111.702C112.225 33.3047 112.632 33.1712 112.923 32.8661C113.195 32.58 113.35 32.1986 113.35 31.7218C113.35 31.2641 113.195 30.5966 112.884 29.7384L109.976 21.6522H112.613L113.427 24.1124C113.989 25.8669 114.513 27.6978 115.017 29.6049C115.405 28.1745 115.928 26.3437 116.626 24.1314Z" fill="#F50600"/>
                <path d="M108.817 21.4996C109.03 21.4996 109.224 21.5187 109.418 21.5377V23.75H108.797C107.867 23.75 107.149 23.9979 106.645 24.4556C106.141 24.9133 105.908 25.5999 105.908 26.4963V31.493H103.465V21.6522H105.831V23.4067C106.374 22.148 107.382 21.4996 108.817 21.4996Z" fill="#F50600"/>
                <path d="M102.01 31.493H99.5671C99.4508 31.3022 99.3538 30.9017 99.2956 30.2915C98.617 31.245 97.5507 31.7218 96.0771 31.7218C94.972 31.7218 94.0994 31.4739 93.4402 30.9399C92.781 30.425 92.4708 29.7003 92.4708 28.7658C92.4708 26.9731 93.7505 25.9623 96.3098 25.6953L97.8221 25.5618C98.3262 25.5046 98.6752 25.3901 98.9079 25.2185C99.1212 25.0469 99.2375 24.7799 99.2375 24.4366C99.2375 24.017 99.0824 23.7119 98.8109 23.5211C98.5395 23.3304 98.0741 23.216 97.4149 23.216C96.6975 23.216 96.1934 23.3495 95.8832 23.5784C95.573 23.8072 95.3791 24.2077 95.3403 24.7799H92.9361C93.0718 22.5485 94.5648 21.4233 97.4343 21.4233C100.207 21.4233 101.603 22.415 101.603 24.3794V29.624C101.603 30.5012 101.739 31.1115 102.01 31.493ZM96.6588 30.0054C97.4149 30.0054 98.0354 29.8147 98.5201 29.3951C98.9854 28.9755 99.2375 28.3843 99.2375 27.6024V26.7061C99.0048 26.9158 98.617 27.0493 98.0935 27.1066L96.7751 27.2591C96.1159 27.3354 95.6506 27.488 95.3791 27.7168C95.1077 27.9457 94.972 28.2508 94.972 28.6704C94.972 29.09 95.1077 29.4333 95.3985 29.6621C95.6893 29.891 96.1159 30.0054 96.6588 30.0054Z" fill="#F50600"/>
                <path d="M91.6812 21.4996C91.8944 21.4996 92.0883 21.5187 92.2822 21.5377V23.75H91.6618C90.7311 23.75 90.0137 23.9979 89.5096 24.4556C89.0055 24.9133 88.7728 25.5999 88.7728 26.4963V31.493H86.3298V21.6522H88.6953V23.4067C89.2382 22.148 90.2464 21.4996 91.6812 21.4996Z" fill="#F50600"/>
                <path d="M80.3251 21.4233C81.6823 21.4233 82.7875 21.9001 83.6018 22.8155C84.3967 23.7691 84.8039 25.0087 84.8039 26.5726C84.8039 28.1364 84.3967 29.376 83.6018 30.3105C82.7875 31.2641 81.6823 31.7218 80.3251 31.7218C78.9097 31.7218 77.8433 31.1878 77.1259 30.0817V31.493H74.7799V17.9142H77.2229V22.9299C77.9209 21.9382 78.9679 21.4233 80.3251 21.4233ZM77.8627 28.9183C78.2893 29.4714 78.9291 29.7384 79.7434 29.7384C80.5384 29.7384 81.1782 29.4523 81.6435 28.8802C82.0895 28.3271 82.3221 27.5261 82.3221 26.4963C82.3221 25.5046 82.0895 24.7417 81.6435 24.2077C81.1976 23.6737 80.5577 23.4067 79.7434 23.4067C78.9291 23.4067 78.2892 23.6928 77.8433 24.2268C77.378 24.7798 77.1647 25.5618 77.1647 26.5726C77.1647 27.6024 77.3974 28.3843 77.8627 28.9183Z" fill="#F50600"/>
                <path d="M72.8243 31.493H70.3813V21.6522H72.8243V31.493Z" fill="#F50600"/>
                <path d="M62.4992 17.9142V29.1853H69.072V31.493H59.8817V18.9631L62.4992 17.9142Z" fill="#F50600"/>
                <path d="M50.092 21.4233C51.1778 21.4233 52.0309 21.7475 52.6514 22.3769C53.2718 23.0253 53.582 23.8835 53.582 24.9896V31.493H51.139V25.3711C51.139 24.1314 50.5574 23.5021 49.4134 23.5021C48.793 23.5021 48.2889 23.7309 47.9011 24.1696C47.5133 24.6082 47.3388 25.2376 47.3388 26.0767V31.493H44.9152V25.3711C44.9152 24.1314 44.3336 23.5021 43.1702 23.5021C42.5498 23.5021 42.0651 23.7309 41.6773 24.1696C41.2895 24.6082 41.115 25.2376 41.115 26.0767V31.493H38.672V21.6522H41.0375V23.0634C41.7161 21.9764 42.6661 21.4233 43.8876 21.4233C45.3999 21.4233 46.4469 22.0336 46.9898 23.2541C47.7266 22.0336 48.7736 21.4233 50.092 21.4233Z" fill="#F50600"/>
                <path d="M36.7033 31.493H34.2603V17.9142H36.7033V31.493Z" fill="#F50600"/>
                <path d="M32.2916 31.493H29.8486V21.6522H32.2916V31.493Z" fill="#F50600"/>
                <path d="M28.8118 17.9142V20.2218H21.6767V23.4258H28.1719V25.6381H21.6767V31.493H19.0592V17.9142H28.8118Z" fill="#F50600"/>
                <path d="M81.627 4.3354C81.8403 4.3354 82.0342 4.35448 82.2281 4.37355V6.58582H81.6076C80.6769 6.58582 79.9596 6.83375 79.4555 7.29146C78.9514 7.74917 78.7187 8.43574 78.7187 9.33209V14.3288H76.2757V4.48798H78.6411V6.24254C79.184 4.98383 80.1922 4.3354 81.627 4.3354Z" fill="#F50600"/>
                <path d="M74.6982 9.58002V10.1522H67.2142C67.2917 10.9913 67.5632 11.6397 68.0091 12.0593C68.455 12.4789 69.0561 12.6886 69.8123 12.6886C70.9174 12.6886 71.6736 12.2309 72.1001 11.2774H74.4462C74.1747 12.2881 73.6318 13.0891 72.8175 13.6803C71.9838 14.2716 70.9756 14.5576 69.7929 14.5576C68.2999 14.5576 67.0978 14.0999 66.1865 13.1464C65.2559 12.2119 64.8099 10.9722 64.8099 9.40837C64.8099 7.8636 65.2559 6.62396 66.1672 5.6704C67.0784 4.7359 68.2805 4.25912 69.7541 4.25912C71.2664 4.25912 72.4685 4.75497 73.3604 5.72761C74.2523 6.71932 74.6982 7.9971 74.6982 9.58002ZM69.7347 6.12811C68.2999 6.12811 67.4662 6.91003 67.2335 8.47388H72.2553C72.1389 7.74917 71.8675 7.17703 71.4409 6.75746C70.995 6.33789 70.4327 6.12811 69.7347 6.12811Z" fill="#F50600"/>
                <path d="M60.9186 5.84204V4.48798H63.284V14.0046C63.284 15.3396 62.838 16.3885 61.9849 17.1513C61.1318 17.9142 59.9103 18.2956 58.3398 18.2956C56.9438 18.2956 55.8387 17.9905 55.0438 17.3802C54.2488 16.7699 53.8223 15.9308 53.7447 14.8628H56.1489C56.2652 15.9308 57.002 16.4457 58.3786 16.4457C59.1736 16.4457 59.7746 16.255 60.2012 15.8354C60.6277 15.4349 60.841 14.8437 60.841 14.0618V12.8221C60.1042 13.8138 59.096 14.2906 57.7776 14.2906C56.4203 14.2906 55.3152 13.8329 54.5009 12.8984C53.6671 12.0021 53.26 10.8006 53.26 9.27487C53.26 7.74917 53.6671 6.54768 54.5009 5.63225C55.3152 4.71683 56.401 4.25912 57.7582 4.25912C59.1542 4.25912 60.2206 4.79312 60.9186 5.84204ZM58.3204 12.3072C59.1348 12.3072 59.7552 12.0402 60.2206 11.5062C60.6665 10.9722 60.8992 10.2284 60.8992 9.27487C60.8992 8.32131 60.6665 7.57753 60.2206 7.04353C59.7552 6.50953 59.1348 6.24254 58.3204 6.24254C57.5255 6.24254 56.9051 6.52861 56.4397 7.0626C55.9744 7.5966 55.7611 8.34038 55.7611 9.29395C55.7611 10.2475 55.9744 10.9722 56.4397 11.5062C56.9051 12.0402 57.5255 12.3072 58.3204 12.3072Z" fill="#F50600"/>
                <path d="M48.211 4.25912C49.2968 4.25912 50.1499 4.58333 50.7703 5.19361C51.3908 5.8039 51.7204 6.68118 51.7204 7.80638V14.3288H49.2774V8.20688C49.2774 6.96725 48.6376 6.33789 47.3967 6.33789C46.7762 6.33789 46.2334 6.56675 45.8068 7.00539C45.3803 7.44403 45.167 8.05431 45.167 8.81716V14.3288H42.724V4.48798H45.0894V5.89925C45.8456 4.81219 46.8926 4.25912 48.211 4.25912Z" fill="#F50600"/>
                <path d="M41.1465 9.58002V10.1522H33.6624C33.74 10.9913 34.0114 11.6397 34.4574 12.0593C34.9033 12.4789 35.5044 12.6886 36.2605 12.6886C37.3657 12.6886 38.1219 12.2309 38.5484 11.2774H40.8945C40.623 12.2881 40.0801 13.0891 39.2658 13.6803C38.4321 14.2716 37.4239 14.5576 36.2412 14.5576C34.7482 14.5576 33.5461 14.0999 32.6348 13.1464C31.7042 12.2119 31.2582 10.9722 31.2582 9.40837C31.2582 7.8636 31.7042 6.62396 32.6155 5.6704C33.5267 4.7359 34.7288 4.25912 36.2024 4.25912C37.7147 4.25912 38.9168 4.75497 39.8087 5.72761C40.7006 6.71932 41.1465 7.9971 41.1465 9.58002ZM36.183 6.12811C34.7482 6.12811 33.9145 6.91003 33.6818 8.47388H38.7035C38.5872 7.74917 38.3158 7.17703 37.8892 6.75746C37.4433 6.33789 36.881 6.12811 36.183 6.12811Z" fill="#F50600"/>
                <path d="M28.1332 0.75H31.3905L25.7096 6.28068L31.3905 14.3288H28.2689L23.8482 7.9971L21.6767 10.0759V14.3288H19.0592V0.75H21.6767V7.15796L28.1332 0.75Z" fill="#F50600"/>
                <path d="M32.4278 19.0966C32.4278 19.8339 31.8201 20.4316 31.0706 20.4316C30.321 20.4316 29.7133 19.8339 29.7133 19.0966C29.7133 18.3593 30.321 17.7616 31.0706 17.7616C31.8201 17.7616 32.4278 18.3593 32.4278 19.0966Z" fill="#F50600"/>
                <path d="M72.9988 19.0966C72.9988 19.8339 72.3912 20.4316 71.6416 20.4316C70.892 20.4316 70.2844 19.8339 70.2844 19.0966C70.2844 18.3593 70.892 17.7616 71.6416 17.7616C72.3912 17.7616 72.9988 18.3593 72.9988 19.0966Z" fill="#F50600"/>
                <path d="M16.5 5.93579V6.27856H12.2762C12.3315 6.67661 12.4753 6.97515 12.7075 7.17418C12.9286 7.38426 13.2271 7.48378 13.581 7.48378C14.1338 7.48378 14.5208 7.27369 14.7309 6.84247H16.3673C16.2125 7.43955 15.8808 7.90394 15.3832 8.24671C14.8746 8.58948 14.2775 8.75533 13.581 8.75533C12.6964 8.75533 11.9777 8.48996 11.4359 7.93711C10.883 7.39532 10.6177 6.67661 10.6177 5.76994C10.6177 4.86326 10.883 4.14456 11.4248 3.60276C11.9556 3.06097 12.6632 2.78455 13.5588 2.78455C14.4434 2.78455 15.1511 3.07203 15.7039 3.63594C16.2346 4.2109 16.5 4.98489 16.5 5.93579ZM13.5367 4.0561C12.8291 4.0561 12.4089 4.43204 12.2873 5.18392H14.8083C14.7419 4.83009 14.6093 4.55367 14.3881 4.35464C14.167 4.15562 13.8795 4.0561 13.5367 4.0561Z" fill="#F50600"/>
                <path d="M7.87547 2.78449C8.47255 2.78449 8.95905 2.97246 9.31288 3.33734C9.6667 3.70222 9.85467 4.2219 9.85467 4.88532V8.62259H8.12978V5.22809C8.12978 4.58678 7.82018 4.25507 7.21205 4.25507C6.90245 4.25507 6.63708 4.36564 6.43806 4.56467C6.22797 4.77475 6.12846 5.06224 6.12846 5.43817V8.62259H4.40356V0.75H6.12846V3.66905C6.55968 3.08303 7.1457 2.78449 7.87547 2.78449Z" fill="#F50600"/>
                <path d="M3.67093 2.91719V4.17769H2.57628V6.84243C2.57628 7.04145 2.62051 7.17414 2.72003 7.24048C2.80848 7.30682 2.98539 7.33999 3.22865 7.33999H3.67093V8.62261C3.46085 8.65578 3.19548 8.66683 2.87482 8.66683C2.15612 8.66683 1.63644 8.54521 1.32684 8.2909C1.00619 8.03658 0.85139 7.61642 0.85139 7.0304V4.17769H0V2.91719H0.85139V1.22546H2.57628V2.91719H3.67093Z" fill="#F50600"/>
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
