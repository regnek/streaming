"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"

/**
 * A hook to manage search input focus across navigation
 */
export function useSearchFocus() {
  const router = useRouter()
  const pathname = usePathname()
  const [previousPage, setPreviousPage] = useState<string | null>(null)
  const [shouldFocus, setShouldFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Store the previous page when not on search
  useEffect(() => {
    if (!pathname.startsWith("/search")) {
      setPreviousPage(pathname)
      localStorage.setItem("previousPage", pathname)
    }
  }, [pathname])

  // Focus input after navigation if needed
  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      const focusTimer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
        setShouldFocus(false)
      }, 150)

      return () => clearTimeout(focusTimer)
    }
  }, [shouldFocus, pathname])

  const navigateBack = () => {
    const targetPage = previousPage || "/"
    setShouldFocus(true)
    router.push(targetPage)
  }

  return {
    inputRef,
    navigateBack,
    setShouldFocus,
    previousPage,
  }
}
