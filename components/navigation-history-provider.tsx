"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function NavigationHistoryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Don't store search pages in history
    if (!pathname.startsWith("/search")) {
      localStorage.setItem("previousPage", pathname)

      // Also store in sessionStorage for more reliable access
      sessionStorage.setItem("previousPage", pathname)
    }
  }, [pathname])

  return <>{children}</>
}
