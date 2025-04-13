import { getItem, putItem, queryItems, updateItem } from "./dynamodb-client"

// Table name for users
export const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || "StreamflixUsers"

// User interface
export interface User {
  id: string
  email: string
  name: string
  hashedPassword: string
  createdAt: string
  updatedAt: string
  isAdmin?: boolean
  watchHistory?: string[] // Array of content IDs
  watchlist?: string[] // Array of content IDs
  preferences?: {
    genres?: string[]
    notifications?: boolean
    theme?: string
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await getItem(USERS_TABLE, { id })
    return (result as User) || null
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    return null
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const items = await queryItems(
      USERS_TABLE,
      "EmailIndex", // Secondary index on email
      "email = :email",
      { ":email": email.toLowerCase() },
    )

    if (items && items.length > 0) {
      return items[0] as User
    }

    return null
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

// Create a new user
export async function createUser(user: Omit<User, "createdAt" | "updatedAt">): Promise<User> {
  const now = new Date().toISOString()

  const newUser: User = {
    ...user,
    email: user.email.toLowerCase(), // Store email in lowercase for case-insensitive lookups
    createdAt: now,
    updatedAt: now,
  }

  try {
    await putItem(USERS_TABLE, newUser)
    return newUser
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

// Update user data
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  // Remove fields that shouldn't be updated directly
  const { id: _, createdAt, hashedPassword, ...validUpdates } = updates as any

  // Build update expression and attribute values
  let updateExpression = "SET updatedAt = :updatedAt"
  const expressionAttributeValues: Record<string, any> = {
    ":updatedAt": new Date().toISOString(),
  }

  // Add each update field to the expression
  Object.entries(validUpdates).forEach(([key, value], index) => {
    const attrName = `:attr${index}`
    updateExpression += `, ${key} = ${attrName}`
    expressionAttributeValues[attrName] = value
  })

  try {
    const result = await updateItem(USERS_TABLE, { id }, updateExpression, expressionAttributeValues)

    return (result as User) || null
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

// Add item to user's watchlist
export async function addToWatchlist(userId: string, contentId: string): Promise<boolean> {
  try {
    // First get the current user
    const user = await getUserById(userId)
    if (!user) return false

    // Create or update the watchlist
    const watchlist = [...(user.watchlist || []), contentId]

    await updateItem(USERS_TABLE, { id: userId }, "SET watchlist = :watchlist, updatedAt = :updatedAt", {
      ":watchlist": watchlist,
      ":updatedAt": new Date().toISOString(),
    })

    return true
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return false
  }
}

// Remove item from user's watchlist
export async function removeFromWatchlist(userId: string, contentId: string): Promise<boolean> {
  try {
    // First get the current watchlist
    const user = await getUserById(userId)
    if (!user || !user.watchlist) return false

    // Filter out the content ID
    const updatedWatchlist = user.watchlist.filter((id) => id !== contentId)

    // Update the user with the new watchlist
    await updateItem(USERS_TABLE, { id: userId }, "SET watchlist = :watchlist, updatedAt = :updatedAt", {
      ":watchlist": updatedWatchlist,
      ":updatedAt": new Date().toISOString(),
    })

    return true
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return false
  }
}

// Update user's watch history
export async function updateWatchHistory(userId: string, contentId: string): Promise<boolean> {
  try {
    // First check if the content is already in the history
    const user = await getUserById(userId)
    if (!user) return false

    let updatedHistory = user.watchHistory || []

    // Remove the content ID if it already exists (to move it to the front)
    updatedHistory = updatedHistory.filter((id) => id !== contentId)

    // Add the content ID to the front of the array
    updatedHistory.unshift(contentId)

    // Limit history to 50 items
    if (updatedHistory.length > 50) {
      updatedHistory = updatedHistory.slice(0, 50)
    }

    // Update the user with the new history
    await updateItem(USERS_TABLE, { id: userId }, "SET watchHistory = :watchHistory, updatedAt = :updatedAt", {
      ":watchHistory": updatedHistory,
      ":updatedAt": new Date().toISOString(),
    })

    return true
  } catch (error) {
    console.error("Error updating watch history:", error)
    return false
  }
}
