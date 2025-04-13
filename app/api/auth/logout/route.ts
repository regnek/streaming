import { NextResponse } from "next/server"
import { destroySession } from "@/lib/auth/session"

export async function POST() {
  try {
    // Destroy the session
    destroySession()

    return NextResponse.json({ message: "Logout successful" })
  } catch (error) {
    console.error("Error in logout:", error)
    return NextResponse.json({ error: "An error occurred during logout" }, { status: 500 })
  }
}
