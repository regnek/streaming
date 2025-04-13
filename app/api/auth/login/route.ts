import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/auth/dynamodb"
import { verifyPassword } from "@/lib/auth/password"
import { createSession } from "@/lib/auth/session"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Get the user
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify the password
    const passwordValid = await verifyPassword(password, user.hashedPassword)
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create a session
    await createSession(user.id)

    // Return the user (without the password)
    const { hashedPassword, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Error in login:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
