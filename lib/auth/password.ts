import bcrypt from "bcryptjs"

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10

/**
 * Hash a password using bcrypt
 * @param password The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash
 * @param password The plain text password to verify
 * @param hashedPassword The hashed password to compare against
 * @returns True if the password matches, false otherwise
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
