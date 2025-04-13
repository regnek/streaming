import { cookies } from "next/headers"
import { encrypt, decrypt } from "./crypto"
import { getUserById } from "./dynamodb"
import type { User } from "./dynamodb"

// Session cookie name
const SESSION_COOKIE_NAME = "streamflix_session"

// Session duration in seconds (7 days)
const SESSION_DURATION = 7 * 24 * 60 * 60

// Session interface
export interface Session {
  userId: string
  expires: number // Unix timestamp
}

/**
 * Create a new session for a user
 * @param userId The ID of the user to create a session for
 * @returns True if the session was created successfully
 */
export async function createSession(userId: string): Promise<boolean> {
  try {
    const expires = Math.floor(Date.now() / 1000) + SESSION_DURATION
    const session: Session = { userId, expires }

    // Encrypt the session data
    const encryptedSession = await encrypt(JSON.stringify(session))

    // Set the session cookie
    cookies().set({
      name: SESSION_COOKIE_NAME,
      value: encryptedSession,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION,
    })

    return true
  } catch (error) {
    console.error("Error creating session:", error)
    return false
  }
}

/**
 * Get the current session
 * @returns The session if it exists and is valid, null otherwise
 */
export async function getSession(): Promise<Session | null> {
  try {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME)

    if (!sessionCookie) {
      return null
    }

    // Decrypt the session data
    const decryptedSession = await decrypt(sessionCookie.value)
    const session = JSON.parse(decryptedSession) as Session

    // Check if the session has expired
    if (session.expires < Math.floor(Date.now() / 1000)) {
      destroySession()
      return null
    }

    return session
  } catch (error) {
    console.error("Error getting session:", error)
    destroySession()
    return null
  }
}

/**
 * Get the current user from the session
 * @returns The user if the session exists and is valid, null otherwise
 */
export async function getCurrentUser(): Promise<Omit<User, "hashedPassword"> | null> {
  try {
    const session = await getSession()

    if (!session) {
      return null
    }

    const user = await getUserById(session.userId)

    if (!user) {
      destroySession()
      return null
    }

    // Don't return the hashed password
    const { hashedPassword, ...userWithoutPassword } = user

    return userWithoutPassword
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

/**
 * Destroy the current session
 */
export function destroySession(): void {
  cookies().delete(SESSION_COOKIE_NAME)
}
