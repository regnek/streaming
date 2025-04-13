import { randomBytes, createCipheriv, createDecipheriv } from "crypto"

// Get encryption key from environment or generate a fallback
// In production, this should be set in the environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "this_is_a_fallback_key_that_should_be_replaced_in_production_32"

// Ensure the key is 32 bytes (256 bits)
const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32))

/**
 * Encrypt a string
 * @param text The text to encrypt
 * @returns The encrypted text
 */
export async function encrypt(text: string): Promise<string> {
  // Generate a random initialization vector
  const iv = randomBytes(16)

  // Create a cipher
  const cipher = createCipheriv("aes-256-cbc", key, iv)

  // Encrypt the text
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  // Return the IV and encrypted text
  return `${iv.toString("hex")}:${encrypted}`
}

/**
 * Decrypt a string
 * @param encryptedText The encrypted text to decrypt
 * @returns The decrypted text
 */
export async function decrypt(encryptedText: string): Promise<string> {
  // Split the IV and encrypted text
  const [ivHex, encrypted] = encryptedText.split(":")

  // Convert the IV from hex to a buffer
  const iv = Buffer.from(ivHex, "hex")

  // Create a decipher
  const decipher = createDecipheriv("aes-256-cbc", key, iv)

  // Decrypt the text
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
