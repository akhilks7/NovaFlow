/** Trimmed string from a FormData field; empty becomes `null`. */
export function readText(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function readOneOf<T extends string>(
  formData: FormData,
  key: string,
  allowed: readonly T[],
): T | null {
  const value = readText(formData, key);
  return value !== null && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export const MIN_PASSWORD_LENGTH = 8;

/** Returns a message when the password is unusable, otherwise `null`. */
export function checkPassword(password: string | null): string | null {
  if (!password) return "Enter a password.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

/**
 * Supabase surfaces terse, sometimes leaky messages. Map the ones users
 * actually hit onto plain language and let anything else through.
 */
export function humanizeAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "That email and password combination does not match an account.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Confirm your email address first — check your inbox for the link.";
  }
  if (normalized.includes("already registered") || normalized.includes("already been registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many requests")) {
    return "Too many attempts. Wait a minute and try again.";
  }
  if (normalized.includes("password should be at least")) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (normalized.includes("new password should be different")) {
    return "Choose a password you have not used here before.";
  }

  return message;
}
