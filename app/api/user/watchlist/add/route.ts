import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { addToWatchlist } from "@/lib/auth/dynamodb"

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

    // Add to watchlist
    const success = await addToWatchlist(user.id, contentId)

    if (!success) {
      return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 })
    }

    return NextResponse.json({ message: "Added to watchlist" })
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return NextResponse.json({ error: "An error occurred while adding to watchlist" }, { status: 500 })
  }
}
