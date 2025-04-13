// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Password requirements
const MIN_PASSWORD_LENGTH = 8
const REQUIRE_UPPERCASE = true
const REQUIRE_LOWERCASE = true
const REQUIRE_NUMBER = true
const REQUIRE_SPECIAL = true

/**
 * Validate an email address
 * @param email The email to validate
 * @returns True if the email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

/**
 * Validate a password
 * @param password The password to validate
 * @returns An object with a valid flag and an error message if invalid
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    }
  }

  if (REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter",
    }
  }

  if (REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter",
    }
  }

  if (REQUIRE_NUMBER && !/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one number",
    }
  }

  if (REQUIRE_SPECIAL && !/[^A-Za-z0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one special character",
    }
  }

  return { valid: true }
}

/**
 * Validate a name
 * @param name The name to validate
 * @returns An object with a valid flag and an error message if invalid
 */
export function validateName(name: string): { valid: boolean; message?: string } {
  if (!name || name.trim().length < 2) {
    return {
      valid: false,
      message: "Name must be at least 2 characters long",
    }
  }

  if (name.trim().length > 50) {
    return {
      valid: false,
      message: "Name must be less than 50 characters long",
    }
  }

  return { valid: true }
}
