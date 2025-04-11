"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the session with an API
        const storedUser = localStorage.getItem("streamflix_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would authenticate with an API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (email === "admin@example.com" && password === "password") {
        const userData = {
          id: "admin-user",
          name: "Admin User",
          email: "admin@example.com",
        }
        setUser(userData)
        localStorage.setItem("streamflix_user", JSON.stringify(userData))
      } else if (email === "user@example.com" && password === "password") {
        const userData = {
          id: "regular-user",
          name: "Regular User",
          email: "user@example.com",
        }
        setUser(userData)
        localStorage.setItem("streamflix_user", JSON.stringify(userData))
      } else {
        throw new Error("Invalid email or password")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would register with an API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData = {
        id: `user-${Date.now()}`,
        name,
        email,
      }
      setUser(userData)
      localStorage.setItem("streamflix_user", JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("streamflix_user")
  }

  // Check if user is admin
  const isAdmin = user?.email === "admin@example.com"

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, signIn, signUp, signOut }}>
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
