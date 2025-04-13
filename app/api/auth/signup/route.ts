import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { createUser, getUserByEmail } from "@/lib/auth/dynamodb"
import { hashPassword } from "@/lib/auth/password"
import { validateEmail, validatePassword, validateName } from "@/lib/auth/validation"
import { createSession } from "@/lib/auth/session"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate email
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Validate name
    const nameValidation = validateName(name)
    if (!nameValidation.valid) {
      return NextResponse.json({ error: nameValidation.message }, { status: 400 })
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create the user
    const user = await createUser({
      id: uuidv4(),
      email,
      name,
      hashedPassword,
      isAdmin: false,
      watchHistory: [],
      watchlist: [],
      preferences: {
        notifications: true,
        theme: "dark",
      },
    })

    // Create a session
    await createSession(user.id)

    // Return the user (without the password)
    const { hashedPassword: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword, message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error in signup:", error)
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}
