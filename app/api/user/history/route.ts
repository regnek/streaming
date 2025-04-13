import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { updateWatchHistory } from "@/lib/auth/dynamodb"

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

    // Update watch history
    const success = await updateWatchHistory(user.id, contentId)

    if (!success) {
      return NextResponse.json({ error: "Failed to update watch history" }, { status: 500 })
    }

    return NextResponse.json({ message: "Watch history updated" })
  } catch (error) {
    console.error("Error updating watch history:", error)
    return NextResponse.json({ error: "An error occurred while updating watch history" }, { status: 500 })
  }
}
