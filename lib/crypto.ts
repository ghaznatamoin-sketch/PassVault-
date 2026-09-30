/**
 * PassVault Cryptographic Utilities
 * Real AES-GCM 256-bit encryption and decryption using Web Crypto API.
 * Uses PBKDF2 key derivation with SHA-256 and 100,000 iterations.
 */

// Convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 string to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derive a 256-bit AES-GCM key from a master secret and salt using PBKDF2
 */
async function deriveKey(masterSecret: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(masterSecret),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a plaintext password string using AES-GCM 256-bit
 * Returns a serialized bundle: "v1:salt_base64:iv_base64:ciphertext_base64"
 */
export async function encryptPassword(plaintext: string, masterSecret: string = "passvault_secure_key"): Promise<string> {
  if (!plaintext) return "";
  try {
    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);

    const iv = new Uint8Array(12);
    crypto.getRandomValues(iv);

    const key = await deriveKey(masterSecret, salt);
    const encoder = new TextEncoder();
    const encodedPlaintext = encoder.encode(plaintext);

    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv as BufferSource,
      },
      key,
      encodedPlaintext
    );

    const saltB64 = arrayBufferToBase64(salt.buffer);
    const ivB64 = arrayBufferToBase64(iv.buffer);
    const ciphertextB64 = arrayBufferToBase64(encryptedBuffer);

    return `v1:${saltB64}:${ivB64}:${ciphertextB64}`;
  } catch (err) {
    console.error("Encryption failed:", err);
    return plaintext;
  }
}

/**
 * Decrypt a serialized AES-GCM ciphertext bundle back to plaintext
 */
export async function decryptPassword(encryptedBundle: string, masterSecret: string = "passvault_secure_key"): Promise<string> {
  if (!encryptedBundle) return "";
  if (!encryptedBundle.startsWith("v1:")) {
    // If not in encrypted format (e.g. legacy plain text), return as-is
    return encryptedBundle;
  }

  try {
    const parts = encryptedBundle.split(":");
    if (parts.length !== 4) return encryptedBundle;

    const salt = base64ToUint8Array(parts[1]);
    const iv = base64ToUint8Array(parts[2]);
    const ciphertext = base64ToUint8Array(parts[3]);

    const key = await deriveKey(masterSecret, salt);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv as BufferSource,
      },
      key,
      ciphertext as BufferSource
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    console.error("Decryption failed:", err);
    return encryptedBundle;
  }
}
