export type Category = 'Social' | 'Work' | 'Shopping' | 'Finance' | 'Education' | 'Other';

export interface Credential {
  id: string;
  user_id: string;
  website_name: string;
  website_url: string;
  category: Category;
  username_email: string;
  password: string;
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

export type SubscriptionPlan = 'free_trial' | 'monthly_pro' | 'annual_pro';
export type SubscriptionStatus = 'active_trial' | 'active_subscription' | 'trial_expired' | 'canceled';

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  trialDaysLeft: number;
  price: string;
  billingCycle: 'monthly' | 'annual' | 'trial';
}

export type AutoLockTimeout = 1 | 5 | 15 | 30 | 60 | 0; // 0 = Never

export interface AuthSession {
  user: {
    id: string;
    email: string;
    full_name: string;
    email_verified: boolean;
  } | null;
  isAuthenticated: boolean;
}
