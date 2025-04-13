"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  isAdmin?: boolean
  watchHistory?: string[]
  watchlist?: string[]
  preferences?: {
    genres?: string[]
    notifications?: boolean
    theme?: string
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  addToWatchlist: (contentId: string) => Promise<boolean>
  removeFromWatchlist: (contentId: string) => Promise<boolean>
  updateWatchHistory: (contentId: string) => Promise<boolean>
  isInWatchlist: (contentId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Login failed")
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign up function
  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Signup failed")
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Add to watchlist
  const addToWatchlist = async (contentId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const response = await fetch(`/api/user/watchlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contentId }),
      })

      if (!response.ok) {
        return false
      }

      // Update local user state
      setUser((prev) => {
        if (!prev) return prev

        const watchlist = [...(prev.watchlist || []), contentId]
        return { ...prev, watchlist }
      })

      return true
    } catch (error) {
      console.error("Add to watchlist error:", error)
      return false
    }
  }

  // Remove from watchlist
  const removeFromWatchlist = async (contentId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const response = await fetch(`/api/user/watchlist/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contentId }),
      })

      if (!response.ok) {
        return false
      }

      // Update local user state
      setUser((prev) => {
        if (!prev) return prev

        const watchlist = (prev.watchlist || []).filter((id) => id !== contentId)
        return { ...prev, watchlist }
      })

      return true
    } catch (error) {
      console.error("Remove from watchlist error:", error)
      return false
    }
  }

  // Update watch history
  const updateWatchHistory = async (contentId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const response = await fetch(`/api/user/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contentId }),
      })

      if (!response.ok) {
        return false
      }

      // Update local user state
      setUser((prev) => {
        if (!prev) return prev

        let watchHistory = [...(prev.watchHistory || [])]
        watchHistory = watchHistory.filter((id) => id !== contentId)
        watchHistory.unshift(contentId)

        if (watchHistory.length > 50) {
          watchHistory = watchHistory.slice(0, 50)
        }

        return { ...prev, watchHistory }
      })

      return true
    } catch (error) {
      console.error("Update watch history error:", error)
      return false
    }
  }

  // Check if content is in watchlist
  const isInWatchlist = (contentId: string): boolean => {
    if (!user || !user.watchlist) return false
    return user.watchlist.includes(contentId)
  }

  // Check if user is admin
  const isAdmin = !!user?.isAdmin

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        addToWatchlist,
        removeFromWatchlist,
        updateWatchHistory,
        isInWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
