import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/hooks/use-auth"
import { ApiKeySetup } from "@/components/api-key-setup"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StreamFlix - Watch Movies & TV Shows",
  description: "Stream your favorite movies and TV shows anytime, anywhere.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const hasApiKey = !!process.env.NEXT_PUBLIC_TMDB_API_KEY

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {!hasApiKey && <ApiKeySetup />}
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'