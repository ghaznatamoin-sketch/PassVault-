import { PasswordGeneratorSettings } from "./types";

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

/**
 * Generates a cryptographically strong password using crypto.getRandomValues
 */
export function generatePassword(settings: PasswordGeneratorSettings): string {
  let charPool = "";
  const guaranteedChars: string[] = [];

  if (settings.uppercase_enabled) {
    charPool += UPPERCASE_CHARS;
    guaranteedChars.push(getRandomChar(UPPERCASE_CHARS));
  }
  if (settings.lowercase_enabled) {
    charPool += LOWERCASE_CHARS;
    guaranteedChars.push(getRandomChar(LOWERCASE_CHARS));
  }
  if (settings.numbers_enabled) {
    charPool += NUMBER_CHARS;
    guaranteedChars.push(getRandomChar(NUMBER_CHARS));
  }
  if (settings.symbols_enabled) {
    charPool += SYMBOL_CHARS;
    guaranteedChars.push(getRandomChar(SYMBOL_CHARS));
  }

  // Fallback if no sets were chosen
  if (charPool.length === 0) {
    charPool = LOWERCASE_CHARS + UPPERCASE_CHARS + NUMBER_CHARS;
    guaranteedChars.push(getRandomChar(LOWERCASE_CHARS));
  }

  const length = Math.max(4, Math.min(64, settings.password_length || 16));
  const remainingCount = Math.max(0, length - guaranteedChars.length);
  const resultChars: string[] = [...guaranteedChars];

  if (remainingCount > 0 && typeof window !== "undefined" && window.crypto) {
    const randomBuffer = new Uint32Array(remainingCount);
    window.crypto.getRandomValues(randomBuffer);
    for (let i = 0; i < remainingCount; i++) {
      const index = randomBuffer[i] % charPool.length;
      resultChars.push(charPool[index]);
    }
  } else {
    for (let i = 0; i < remainingCount; i++) {
      resultChars.push(getRandomChar(charPool));
    }
  }

  // Shuffle the result
  return shuffleArray(resultChars).join("");
}

function getRandomChar(str: string): string {
  if (typeof window !== "undefined" && window.crypto) {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    return str[randomBuffer[0] % str.length];
  }
  return str[Math.floor(Math.random() * str.length)];
}

function shuffleArray(array: string[]): string[] {
  const arr = [...array];
  if (typeof window !== "undefined" && window.crypto) {
    const randomBuffer = new Uint32Array(arr.length);
    window.crypto.getRandomValues(randomBuffer);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randomBuffer[i] % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } else {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  return arr;
}

export function evaluatePasswordStrength(password: string): {
  score: number; // 0 to 4
  label: string;
  colorClass: string;
} {
  if (!password) {
    return { score: 0, label: "None", colorClass: "text-slate-500" };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 14) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", colorClass: "text-red-400" };
  if (score === 2 || score === 3) return { score: 2, label: "Moderate", colorClass: "text-amber-400" };
  if (score === 4) return { score: 3, label: "Strong", colorClass: "text-blue-400" };
  return { score: 4, label: "Very Strong", colorClass: "text-emerald-400" };
}
