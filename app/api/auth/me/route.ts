import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"

export async function GET() {
  try {
    // Get the current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json({ error: "An error occurred while getting user data" }, { status: 500 })
  }
}
