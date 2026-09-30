export type Category = 'Social' | 'Work' | 'Shopping' | 'Finance' | 'Education' | 'Other';

export interface Credential {
  id: string;
  user_id: string;
  website_name: string;
  website_url: string;
  category: Category;
  username_email: string;
  password: string; // Stored in memory / local mock in Phase 1
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PasswordGeneratorSettings {
  password_length: number;
  uppercase_enabled: boolean;
  lowercase_enabled: boolean;
  numbers_enabled: boolean;
  symbols_enabled: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    full_name: string;
    email_verified: boolean;
  } | null;
  isAuthenticated: boolean;
}
