import { createClient, SupabaseClient, User, Session } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

/**
 * Checks whether valid Supabase environment variables are present.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    anonKey &&
    !url.includes("your-project.supabase.co") &&
    !anonKey.includes("your-supabase-anon-key") &&
    url.startsWith("https://")
  );
}

/**
 * Returns the singleton Supabase client instance.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    supabaseClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseClient;
}

/**
 * Real Supabase Authentication Methods
 */

export async function supabaseSignUp(name: string, email: string, pass: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Supabase not configured in environment." };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Registration failed";
    return { success: false, error: msg };
  }
}

export async function supabaseSignIn(email: string, pass: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Supabase not configured in environment." };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sign in failed";
    return { success: false, error: msg };
  }
}

export async function supabaseSignInWithGoogle() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Supabase not configured in environment." };
  }

  try {
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, url: data.url };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Google sign in failed";
    return { success: false, error: msg };
  }
}

export async function supabaseSignOut() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sign out failed";
    return { success: false, error: msg };
  }
}

export async function supabaseResetPassword(email: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Supabase not configured in environment." };
  }

  try {
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Password reset request failed";
    return { success: false, error: msg };
  }
}

export async function supabaseUpdatePassword(newPassword: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Supabase not configured in environment." };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Password update failed";
    return { success: false, error: msg };
  }
}
