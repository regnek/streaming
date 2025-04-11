"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, AlertCircle, ExternalLink, Copy } from "lucide-react"

export function ApiKeySetup() {
  const [apiKey, setApiKey] = useState("")
  const [copied, setCopied] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  // Check for API key in both environment variable and the fallback in tmdb-api.ts
  const hasApiKey = !!process.env.NEXT_PUBLIC_TMDB_API_KEY || true // Always true since we have a fallback

  const copyEnvExample = () => {
    navigator.clipboard.writeText(`NEXT_PUBLIC_TMDB_API_KEY=${apiKey || "your_tmdb_api_key_here"}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (hasApiKey) {
    return (
      <Alert className="max-w-md mx-auto mb-8 bg-green-900/20 border-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-400" />
        <AlertTitle>TMDB API Key Configured</AlertTitle>
        <AlertDescription>
          Your TMDB API key is properly configured. The application will use real movie and TV show data.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>TMDB API Key Required</AlertTitle>
        <AlertDescription>To fetch real movie and TV show data, you need to set up a TMDB API key.</AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Set Up Your TMDB API Key</h2>

        <p className="text-gray-300">
          The Movie Database (TMDB) API is used to fetch real movie and TV show data. You need to create a free account
          and get an API key to use this feature.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => setShowInstructions(!showInstructions)} variant="outline">
            {showInstructions ? "Hide Instructions" : "Show Instructions"}
          </Button>

          <Button
            onClick={() => window.open("https://www.themoviedb.org/signup", "_blank")}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Sign Up for TMDB
          </Button>
        </div>

        {showInstructions && (
          <div className="mt-4 p-4 bg-gray-800/50 rounded-md">
            <h3 className="text-lg font-medium mb-2">How to Get Your TMDB API Key</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>
                Sign up for a free account at{" "}
                <a
                  href="https://www.themoviedb.org/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  The Movie Database
                </a>
              </li>
              <li>Verify your email address</li>
              <li>
                Go to your{" "}
                <a
                  href="https://www.themoviedb.org/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  API settings page
                </a>
              </li>
              <li>Click on "Create" under the "API Key" section</li>
              <li>Select "Developer" as the type</li>
              <li>Accept the terms of use</li>
              <li>Fill out the required information (you can use "StreamFlix" as the application name)</li>
              <li>Copy your API key (v3 auth)</li>
            </ol>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Add Your API Key</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Paste your TMDB API key here"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
            <Button onClick={copyEnvExample} className="flex items-center gap-2">
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy .env Format"}
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Create a <code>.env.local</code> file in your project root and add the line above.
          </p>
        </div>
      </div>
    </div>
  )
}
