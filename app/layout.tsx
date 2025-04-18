import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/hooks/use-auth"
import { NavigationHistoryProvider } from "@/components/navigation-history-provider"
import { NavigationVisibilityProvider } from "@/hooks/use-navigation-visibility"
import { DynamicNavbar } from "@/components/dynamic-navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StreamFlix - Watch Movies & TV Shows",
  description: "Stream your favorite movies and TV shows anytime, anywhere.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <NavigationHistoryProvider>
              <NavigationVisibilityProvider>
                <div className="flex flex-col min-h-screen">
                  <DynamicNavbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </NavigationVisibilityProvider>
            </NavigationHistoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"

import "./globals.css"
