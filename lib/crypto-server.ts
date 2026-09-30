import crypto from "crypto";

/**
 * Server-Side AES-256-GCM Encryption / Decryption Service
 * Uses Node.js crypto module.
 * The master encryption key is kept strictly on the server and is never sent to the client.
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 16;

/**
 * Derives a 32-byte (256-bit) key from the server encryption secret and salt using scrypt
 */
function deriveServerKey(secret: string, salt: Buffer): Buffer {
  return crypto.scryptSync(secret, salt, 32);
}

/**
 * Gets the server-side master key from environment or fallback
 */
function getServerSecret(): string {
  const secret = process.env.ENCRYPTION_KEY || process.env.VAULT_SERVER_SECRET;
  if (!secret) {
    // In production without key, warn and use deterministic fallback for local dev
    return "passvault_default_server_secret_key_32_bytes!!";
  }
  return secret;
}

/**
 * Encrypts plaintext password into an AES-256-GCM bundle:
 * Format: "v1:salt_hex:iv_hex:authTag_hex:ciphertext_hex"
 */
export function encryptServerPassword(plaintext: string): string {
  if (!plaintext) return "";

  const secret = getServerSecret();
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveServerKey(secret, salt);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `v1:${salt.toString("hex")}:${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM bundle back into plaintext password.
 */
export function decryptServerPassword(encryptedBundle: string): string {
  if (!encryptedBundle) return "";
  if (!encryptedBundle.startsWith("v1:")) {
    // If not in encrypted format (e.g. legacy plain text), return as-is
    return encryptedBundle;
  }

  const parts = encryptedBundle.split(":");
  if (parts.length !== 5) {
    // Format mismatch
    return encryptedBundle;
  }

  const [, saltHex, ivHex, authTagHex, ciphertextHex] = parts;

  try {
    const secret = getServerSecret();
    const salt = Buffer.from(saltHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const key = deriveServerKey(secret, salt);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertextHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Server-side decryption failed:", err);
    return encryptedBundle;
  }
}
