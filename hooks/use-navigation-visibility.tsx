"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"

// Create a context to manage navigation visibility across the app
type NavigationVisibilityContextType = {
  isNavVisible: boolean
  setIsNavVisible: (visible: boolean) => void
  hideNavigation: () => void
  showNavigation: () => void
  toggleNavigation: () => void
}

const NavigationVisibilityContext = createContext<NavigationVisibilityContextType | undefined>(undefined)

export function NavigationVisibilityProvider({ children }: { children: ReactNode }) {
  const [isNavVisible, setIsNavVisible] = useState(true)
  const pathname = usePathname()

  // Set initial state based on pathname
  useEffect(() => {
    const isWatchPage = pathname.startsWith("/watch/")
    setIsNavVisible(!isWatchPage)
  }, [pathname])

  // Handle window resize events to ensure proper visibility on different devices
  useEffect(() => {
    const handleResize = () => {
      // On larger screens, we might want to show the navigation more often
      if (window.innerWidth >= 1024 && !pathname.startsWith("/watch/")) {
        setIsNavVisible(true)
      }
    }

    window.addEventListener("resize", handleResize)

    // Initial check
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [pathname])

  const hideNavigation = () => setIsNavVisible(false)
  const showNavigation = () => setIsNavVisible(true)
  const toggleNavigation = () => setIsNavVisible((prev) => !prev)

  return (
    <NavigationVisibilityContext.Provider
      value={{
        isNavVisible,
        setIsNavVisible,
        hideNavigation,
        showNavigation,
        toggleNavigation,
      }}
    >
      {children}
    </NavigationVisibilityContext.Provider>
  )
}

export function useNavigationVisibility() {
  const context = useContext(NavigationVisibilityContext)
  if (context === undefined) {
    throw new Error("useNavigationVisibility must be used within a NavigationVisibilityProvider")
  }
  return context
}
