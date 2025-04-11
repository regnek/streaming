"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * A hook that tracks navigation history and stores the previous page in localStorage
 */
export function useNavigationHistory() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't store search pages in history
    if (!pathname.startsWith("/search")) {
      localStorage.setItem("previousPage", pathname)
    }
  }, [pathname])

  return null
}
