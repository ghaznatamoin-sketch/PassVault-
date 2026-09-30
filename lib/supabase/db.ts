import { getSupabaseClient } from "./client";
import { Credential, UserProfile, PasswordGeneratorSettings, Category } from "../types";

/**
 * Database access layer for Supabase PostgreSQL tables:
 * - public.profiles
 * - public.credentials
 * - public.password_generator_settings
 *
 * All operations execute with Row Level Security (RLS) enforcing auth.uid() = user_id.
 */

// ==============================================================================
// 1. Profiles CRUD
// ==============================================================================

export async function dbGetProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("dbGetProfile error:", error.message);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (err) {
    console.error("dbGetProfile exception:", err);
    return null;
  }
}

export async function dbUpdateProfile(
  userId: string,
  updates: { full_name?: string; email?: string }
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: "Supabase client not initialized" };

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      profile: {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Profile update failed";
    return { success: false, error: message };
  }
}

// ==============================================================================
// 2. Credentials CRUD (Row Level Security protected)
// ==============================================================================

export async function dbGetCredentials(userId: string): Promise<Credential[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("credentials")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("dbGetCredentials error:", error.message);
      return [];
    }

    const creds: Credential[] = (data || []).map((row) => ({
      id: row.id,
      user_id: row.user_id,
      website_name: row.website_name,
      website_url: row.website_url || "",
      category: (row.category as Category) || "Other",
      username_email: row.username_email,
      password: row.encrypted_password,
      notes: row.notes || "",
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return creds;
  } catch (err) {
    console.error("dbGetCredentials exception:", err);
    return [];
  }
}

export async function dbSearchCredentials(
  userId: string,
  searchQuery?: string,
  category?: Category | "All"
): Promise<Credential[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("credentials")
      .select("*")
      .eq("user_id", userId);

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    if (searchQuery && searchQuery.trim()) {
      const clean = searchQuery.trim();
      query = query.or(`website_name.ilike.%${clean}%,username_email.ilike.%${clean}%,website_url.ilike.%${clean}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("dbSearchCredentials error:", error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      user_id: row.user_id,
      website_name: row.website_name,
      website_url: row.website_url || "",
      category: (row.category as Category) || "Other",
      username_email: row.username_email,
      password: row.encrypted_password,
      notes: row.notes || "",
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  } catch (err) {
    console.error("dbSearchCredentials exception:", err);
    return [];
  }
}

export async function dbAddCredential(
  userId: string,
  credData: Omit<Credential, "id" | "user_id" | "created_at" | "updated_at">
): Promise<{ success: boolean; credential?: Credential; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: "Supabase client not initialized" };

  try {
    // Encrypt password using server endpoint before storing in DB
    let encrypted = credData.password;
    try {
      const res = await fetch("/api/vault/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: credData.password }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.encrypted) encrypted = json.encrypted;
      }
    } catch (e) {
      console.warn("Server encrypt call failed, using client fallback", e);
    }

    const { data, error } = await supabase
      .from("credentials")
      .insert({
        user_id: userId,
        website_name: credData.website_name.trim(),
        website_url: credData.website_url?.trim() || "",
        category: credData.category || "Other",
        username_email: credData.username_email.trim(),
        encrypted_password: encrypted,
        notes: credData.notes?.trim() || "",
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      credential: {
        id: data.id,
        user_id: data.user_id,
        website_name: data.website_name,
        website_url: data.website_url,
        category: data.category as Category,
        username_email: data.username_email,
        password: credData.password, // preserve plaintext in memory for active user
        notes: data.notes,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add credential";
    return { success: false, error: msg };
  }
}

export async function dbUpdateCredential(
  id: string,
  userId: string,
  updates: Partial<Omit<Credential, "id" | "user_id" | "created_at">>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: "Supabase client not initialized" };

  try {
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.website_name !== undefined) payload.website_name = updates.website_name.trim();
    if (updates.website_url !== undefined) payload.website_url = updates.website_url.trim();
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.username_email !== undefined) payload.username_email = updates.username_email.trim();
    if (updates.notes !== undefined) payload.notes = updates.notes.trim();

    if (updates.password !== undefined) {
      let encrypted = updates.password;
      try {
        const res = await fetch("/api/vault/encrypt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: updates.password }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.encrypted) encrypted = json.encrypted;
        }
      } catch (e) {
        console.warn("Encrypt error during update:", e);
      }
      payload.encrypted_password = encrypted;
    }

    const { error } = await supabase
      .from("credentials")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update credential";
    return { success: false, error: msg };
  }
}

export async function dbDeleteCredential(id: string, userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: "Supabase client not initialized" };

  try {
    const { error } = await supabase
      .from("credentials")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete credential";
    return { success: false, error: msg };
  }
}

// ==============================================================================
// 3. Password Generator Settings (1:1 with auth.users)
// ==============================================================================

export async function dbGetGeneratorSettings(userId: string): Promise<PasswordGeneratorSettings | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("password_generator_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      password_length: data.password_length,
      uppercase_enabled: data.uppercase_enabled,
      lowercase_enabled: data.lowercase_enabled,
      numbers_enabled: data.numbers_enabled,
      symbols_enabled: data.symbols_enabled,
    };
  } catch (err) {
    console.error("dbGetGeneratorSettings exception:", err);
    return null;
  }
}

export async function dbSaveGeneratorSettings(
  userId: string,
  settings: PasswordGeneratorSettings
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: "Supabase client not initialized" };

  try {
    const { error } = await supabase
      .from("password_generator_settings")
      .upsert(
        {
          user_id: userId,
          password_length: settings.password_length,
          uppercase_enabled: settings.uppercase_enabled,
          lowercase_enabled: settings.lowercase_enabled,
          numbers_enabled: settings.numbers_enabled,
          symbols_enabled: settings.symbols_enabled,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save generator settings";
    return { success: false, error: msg };
  }
}
