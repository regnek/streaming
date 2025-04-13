import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { removeFromWatchlist } from "@/lib/auth/dynamodb"

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { contentId } = body

    if (!contentId) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 })
    }

    // Remove from watchlist
    const success = await removeFromWatchlist(user.id, contentId)

    if (!success) {
      return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 })
    }

    return NextResponse.json({ message: "Removed from watchlist" })
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return NextResponse.json({ error: "An error occurred while removing from watchlist" }, { status: 500 })
  }
}
