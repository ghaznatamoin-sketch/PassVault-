/**
 * PassVault Form Validation Utilities
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validateUrl(url: string): boolean {
  if (!url || !url.trim()) return true; // Optional field
  try {
    let clean = url.trim();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = "https://" + clean;
    }
    new URL(clean);
    return true;
  } catch {
    return false;
  }
}

export function validateCredentialForm(data: {
  website_name: string;
  website_url?: string;
  username_email: string;
  password: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.website_name || !data.website_name.trim()) {
    errors.website_name = "Website or Application name is required.";
  }

  if (data.website_url && !validateUrl(data.website_url)) {
    errors.website_url = "Please enter a valid website URL (e.g. https://example.com).";
  }

  if (!data.username_email || !data.username_email.trim()) {
    errors.username_email = "Username or email is required.";
  }

  if (!data.password) {
    errors.password = "Password cannot be empty.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
