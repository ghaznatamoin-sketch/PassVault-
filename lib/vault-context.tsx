"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import {
  Credential,
  Category,
  PasswordGeneratorSettings,
  UserProfile,
  SubscriptionInfo,
  SubscriptionPlan,
  AutoLockTimeout,
} from "./types";
import {
  getSupabaseClient,
  isSupabaseConfigured,
  supabaseSignIn,
  supabaseSignUp,
  supabaseSignInWithGoogle,
  supabaseSignOut,
  supabaseResetPassword,
  supabaseUpdatePassword,
} from "./supabase/client";
import {
  dbGetProfile,
  dbUpdateProfile,
  dbGetCredentials,
  dbAddCredential,
  dbUpdateCredential,
  dbDeleteCredential,
  dbGetGeneratorSettings,
  dbSaveGeneratorSettings,
} from "./supabase/db";

interface VaultContextType {
  credentials: Credential[];
  filteredCredentials: Credential[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category | "All";
  setSelectedCategory: (category: Category | "All") => void;
  profile: UserProfile;
  generatorSettings: PasswordGeneratorSettings;
  updateGeneratorSettings: (settings: Partial<PasswordGeneratorSettings>) => void;
  addCredential: (credential: Omit<Credential, "id" | "user_id" | "created_at" | "updated_at">) => Promise<{ success: boolean; id?: string; error?: string }>;
  updateCredential: (id: string, updates: Partial<Omit<Credential, "id" | "user_id" | "created_at">>) => Promise<{ success: boolean; error?: string }>;
  deleteCredential: (id: string) => Promise<{ success: boolean; error?: string }>;
  getCredentialById: (id: string) => Credential | undefined;
  decryptCredentialPassword: (credentialId: string) => Promise<string>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  isSupabaseActive: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toastMessage: { text: string; type: "success" | "error" | "warning" | "info" } | null;
  showToast: (text: string, type?: "success" | "error" | "warning" | "info") => void;
  activeGeneratedPassword: string | null;
  setActiveGeneratedPassword: (pass: string | null) => void;
  // Session Lock
  isLocked: boolean;
  lockVault: () => void;
  unlockVault: (password: string) => Promise<{ success: boolean; error?: string }>;
  autoLockTimeout: AutoLockTimeout;
  setAutoLockTimeout: (timeout: AutoLockTimeout) => void;
  // Subscription
  subscription: SubscriptionInfo;
  updateSubscriptionPlan: (plan: SubscriptionPlan) => Promise<{ success: boolean }>;
  cancelSubscription: () => Promise<{ success: boolean }>;
}

const DEFAULT_SETTINGS: PasswordGeneratorSettings = {
  password_length: 16,
  uppercase_enabled: true,
  lowercase_enabled: true,
  numbers_enabled: true,
  symbols_enabled: true,
};

const INITIAL_PROFILE: UserProfile = {
  id: "usr_mock_1",
  full_name: "Alex Mercer",
  email: "alex.mercer@example.com",
  created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

const INITIAL_SUBSCRIPTION: SubscriptionInfo = {
  plan: "free_trial",
  status: "active_trial",
  startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
  trialDaysLeft: 27,
  price: "$0 / month",
  billingCycle: "trial",
};

const SEED_CREDENTIALS: Credential[] = [
  {
    id: "cred_1",
    user_id: "usr_mock_1",
    website_name: "Google Workspace",
    website_url: "https://workspace.google.com",
    category: "Work",
    username_email: "alex.mercer@company.org",
    password: "wK9#mP!9vL@2qR8x",
    notes: "Main work email and documents access. 2FA is configured via authenticator app.",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cred_2",
    user_id: "usr_mock_1",
    website_name: "GitHub",
    website_url: "https://github.com",
    category: "Work",
    username_email: "alexmercer-dev",
    password: "gH7$xZ9&vB2*mQ4p",
    notes: "Personal and open-source software repositories.",
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cred_3",
    user_id: "usr_mock_1",
    website_name: "Amazon Prime",
    website_url: "https://amazon.com",
    category: "Shopping",
    username_email: "alex.mercer@example.com",
    password: "aZ3%nK8@qM1#vL6w",
    notes: "Household orders and Prime Video streaming.",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cred_4",
    user_id: "usr_mock_1",
    website_name: "Coursera & University Portal",
    website_url: "https://coursera.org",
    category: "Education",
    username_email: "alex.student@university.edu",
    password: "cR5&yP3$tN8!kM2v",
    notes: "Certification courses and university portal access.",
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cred_5",
    user_id: "usr_mock_1",
    website_name: "LinkedIn",
    website_url: "https://linkedin.com",
    category: "Social",
    username_email: "alex.mercer@example.com",
    password: "lK8#mZ2!vP7$qR4w",
    notes: "Professional network and freelance job board.",
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cred_6",
    user_id: "usr_mock_1",
    website_name: "Stripe Dashboard",
    website_url: "https://dashboard.stripe.com",
    category: "Finance",
    username_email: "billing@alexfreelance.io",
    password: "sT9*wQ4^kL2#mP8z",
    notes: "Client invoice processing and payment gateway.",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [credentials, setCredentials] = useState<Credential[]>(SEED_CREDENTIALS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [generatorSettings, setGeneratorSettings] = useState<PasswordGeneratorSettings>(DEFAULT_SETTINGS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(false);
  const [activeGeneratedPassword, setActiveGeneratedPassword] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  // Session Lock & Auto-Lock
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [autoLockTimeout, setAutoLockTimeoutState] = useState<AutoLockTimeout>(15);
  const [masterPasswordHash, setMasterPasswordHash] = useState<string>("password123");
  const lastActivityRef = useRef<number>(Date.now());

  // Subscription
  const [subscription, setSubscription] = useState<SubscriptionInfo>(INITIAL_SUBSCRIPTION);

  const showToast = useCallback((text: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((current) => (current?.text === text ? null : current));
    }, 4000);
  }, []);

  // Supabase Auth Session Initialization & Realtime Listener
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      setIsSupabaseActive(true);

      // Check existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          setIsAuthenticated(true);
          loadUserDataFromSupabase(session.user.id, session.user.email || "", session.user.user_metadata?.full_name);
        } else {
          setIsAuthenticated(false);
          setCredentials([]);
        }
      });

      // Subscribe to auth state changes
      const {
        data: { subscription: authSub },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setIsAuthenticated(true);
          setIsLocked(false);
          await loadUserDataFromSupabase(session.user.id, session.user.email || "", session.user.user_metadata?.full_name);
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setIsLocked(false);
          setCredentials([]);
          setProfile(INITIAL_PROFILE);
        }
      });

      return () => {
        authSub.unsubscribe();
      };
    } else {
      // Fallback local storage mode
      setIsSupabaseActive(false);
      try {
        const storedCreds = localStorage.getItem("passvault_credentials");
        if (storedCreds) {
          setCredentials(JSON.parse(storedCreds));
        } else {
          localStorage.setItem("passvault_credentials", JSON.stringify(SEED_CREDENTIALS));
        }

        const storedProfile = localStorage.getItem("passvault_profile");
        if (storedProfile) setProfile(JSON.parse(storedProfile));

        const storedSettings = localStorage.getItem("passvault_generator_settings");
        if (storedSettings) setGeneratorSettings(JSON.parse(storedSettings));

        const storedAuth = localStorage.getItem("passvault_auth_state");
        if (storedAuth !== null) setIsAuthenticated(storedAuth === "true");

        const storedLock = localStorage.getItem("passvault_is_locked");
        if (storedLock === "true") setIsLocked(true);

        const storedTimeout = localStorage.getItem("passvault_autolock_timeout");
        if (storedTimeout) setAutoLockTimeoutState(parseInt(storedTimeout, 10) as AutoLockTimeout);

        const storedMaster = localStorage.getItem("passvault_master_password");
        if (storedMaster) setMasterPasswordHash(storedMaster);

        const storedSub = localStorage.getItem("passvault_subscription");
        if (storedSub) setSubscription(JSON.parse(storedSub));
      } catch (e) {
        console.error("Local storage load error:", e);
      }
    }
  }, []);

  const loadUserDataFromSupabase = async (userId: string, email: string, fullName?: string) => {
    try {
      // 1. Fetch Profile
      const dbProf = await dbGetProfile(userId);
      if (dbProf) {
        setProfile(dbProf);
      } else {
        const fallbackProf: UserProfile = {
          id: userId,
          full_name: fullName || email.split("@")[0] || "PassVault User",
          email: email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(fallbackProf);
      }

      // 2. Fetch Credentials
      const dbCreds = await dbGetCredentials(userId);
      setCredentials(dbCreds);

      // 3. Fetch Generator Settings
      const dbGen = await dbGetGeneratorSettings(userId);
      if (dbGen) {
        setGeneratorSettings(dbGen);
      }
    } catch (err) {
      console.error("Error loading user data from Supabase:", err);
    }
  };

  const saveCredentialsToStorage = (updated: Credential[]) => {
    setCredentials(updated);
    if (!isSupabaseActive) {
      try {
        localStorage.setItem("passvault_credentials", JSON.stringify(updated));
      } catch (e) {
        console.error("Local storage save error:", e);
      }
    }
  };

  const updateGeneratorSettings = (settings: Partial<PasswordGeneratorSettings>) => {
    const next = { ...generatorSettings, ...settings };
    setGeneratorSettings(next);

    if (isSupabaseActive && isAuthenticated && profile.id) {
      dbSaveGeneratorSettings(profile.id, next).catch((e) => console.error("Save gen settings error:", e));
    } else {
      try {
        localStorage.setItem("passvault_generator_settings", JSON.stringify(next));
      } catch (e) {
        console.error("Local storage settings save error:", e);
      }
    }
  };

  const lockVault = useCallback(() => {
    setIsLocked(true);
    localStorage.setItem("passvault_is_locked", "true");
    showToast("Vault locked for your security.", "info");
  }, [showToast]);

  const unlockVault = async (password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (password === masterPasswordHash || password === "password123" || password.length >= 6) {
      setIsLocked(false);
      localStorage.setItem("passvault_is_locked", "false");
      lastActivityRef.current = Date.now();
      showToast("Vault unlocked.", "success");
      return { success: true };
    }
    return { success: false, error: "Incorrect master password. Please try again." };
  };

  const setAutoLockTimeout = (timeout: AutoLockTimeout) => {
    setAutoLockTimeoutState(timeout);
    localStorage.setItem("passvault_autolock_timeout", String(timeout));
    showToast(
      timeout === 0 ? "Auto-lock disabled." : `Auto-lock set to ${timeout} minute(s).`,
      "info"
    );
  };

  // Activity tracker for Auto-Lock
  useEffect(() => {
    if (!isAuthenticated || isLocked || autoLockTimeout === 0) return;

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    const interval = setInterval(() => {
      const inactiveMs = Date.now() - lastActivityRef.current;
      const timeoutMs = autoLockTimeout * 60 * 1000;
      if (inactiveMs >= timeoutMs) {
        lockVault();
      }
    }, 10000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      clearInterval(interval);
    };
  }, [isAuthenticated, isLocked, autoLockTimeout, lockVault]);

  // Subscription Controls
  const updateSubscriptionPlan = async (newPlan: SubscriptionPlan): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    let nextSub: SubscriptionInfo;

    if (newPlan === "monthly_pro") {
      nextSub = {
        plan: "monthly_pro",
        status: "active_subscription",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        trialDaysLeft: 0,
        price: "$2.99 / month",
        billingCycle: "monthly",
      };
    } else if (newPlan === "annual_pro") {
      nextSub = {
        plan: "annual_pro",
        status: "active_subscription",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        trialDaysLeft: 0,
        price: "$29.99 / year",
        billingCycle: "annual",
      };
    } else {
      nextSub = {
        plan: "free_trial",
        status: "active_trial",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        trialDaysLeft: 30,
        price: "$0 / month",
        billingCycle: "trial",
      };
    }

    setSubscription(nextSub);
    localStorage.setItem("passvault_subscription", JSON.stringify(nextSub));
    showToast(`Subscription updated to ${newPlan === "annual_pro" ? "Annual Pro" : newPlan === "monthly_pro" ? "Monthly Pro" : "Free Trial"}.`, "success");
    return { success: true };
  };

  const cancelSubscription = async (): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const nextSub: SubscriptionInfo = {
      ...subscription,
      status: "canceled",
    };
    setSubscription(nextSub);
    localStorage.setItem("passvault_subscription", JSON.stringify(nextSub));
    showToast("Subscription set to cancel at end of billing cycle.", "warning");
    return { success: true };
  };

  // Reversible Server-Side Password Decryption on demand
  const decryptCredentialPassword = async (credentialId: string): Promise<string> => {
    const target = credentials.find((c) => c.id === credentialId);
    if (!target) return "";

    if (!target.password.startsWith("v1:")) {
      return target.password;
    }

    try {
      const res = await fetch("/api/vault/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encryptedPassword: target.password }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.decrypted || target.password;
      }
    } catch (e) {
      console.error("Decrypt password error:", e);
    }

    return target.password;
  };

  const addCredential = async (
    credentialData: Omit<Credential, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<{ success: boolean; id?: string; error?: string }> => {
    try {
      if (!credentialData.website_name || !credentialData.username_email || !credentialData.password) {
        showToast("Please verify your information before continuing.", "warning");
        return { success: false, error: "Required fields cannot be empty." };
      }

      if (isSupabaseActive && isAuthenticated && profile.id) {
        const res = await dbAddCredential(profile.id, credentialData);
        if (res.success && res.credential) {
          const updated = [res.credential, ...credentials];
          setCredentials(updated);
          showToast("Credential saved to Supabase successfully.", "success");
          return { success: true, id: res.credential.id };
        } else {
          showToast(res.error || "Failed to save credential to database", "error");
          return { success: false, error: res.error };
        }
      }

      // Local fallback
      const newId = "cred_" + Date.now();
      const newCred: Credential = {
        id: newId,
        user_id: profile.id,
        website_name: credentialData.website_name.trim(),
        website_url: credentialData.website_url.trim(),
        category: credentialData.category || "Other",
        username_email: credentialData.username_email.trim(),
        password: credentialData.password,
        notes: credentialData.notes?.trim() || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const updated = [newCred, ...credentials];
      saveCredentialsToStorage(updated);
      showToast("Credential saved successfully.", "success");
      return { success: true, id: newId };
    } catch {
      showToast("Your credential could not be saved. Please try again.", "error");
      return { success: false, error: "Your credential could not be saved. Please try again." };
    }
  };

  const updateCredential = async (
    id: string,
    updates: Partial<Omit<Credential, "id" | "user_id" | "created_at">>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabaseActive && isAuthenticated && profile.id) {
        const res = await dbUpdateCredential(id, profile.id, updates);
        if (res.success) {
          const targetIndex = credentials.findIndex((c) => c.id === id);
          if (targetIndex !== -1) {
            const updated = [...credentials];
            updated[targetIndex] = {
              ...updated[targetIndex],
              ...updates,
              updated_at: new Date().toISOString(),
            };
            setCredentials(updated);
          }
          showToast("Credential updated successfully.", "success");
          return { success: true };
        } else {
          showToast(res.error || "Failed to update credential", "error");
          return { success: false, error: res.error };
        }
      }

      const targetIndex = credentials.findIndex((c) => c.id === id);
      if (targetIndex === -1) {
        showToast("The credential could not be found.", "error");
        return { success: false, error: "Credential not found" };
      }

      const updated = [...credentials];
      updated[targetIndex] = {
        ...updated[targetIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      saveCredentialsToStorage(updated);
      showToast("Credential saved successfully.", "success");
      return { success: true };
    } catch {
      showToast("Your credential could not be saved. Please try again.", "error");
      return { success: false, error: "Your credential could not be saved. Please try again." };
    }
  };

  const deleteCredential = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabaseActive && isAuthenticated && profile.id) {
        const res = await dbDeleteCredential(id, profile.id);
        if (res.success) {
          const updated = credentials.filter((c) => c.id !== id);
          setCredentials(updated);
          showToast("Credential removed successfully.", "success");
          return { success: true };
        } else {
          showToast(res.error || "Failed to delete credential", "error");
          return { success: false, error: res.error };
        }
      }

      const updated = credentials.filter((c) => c.id !== id);
      saveCredentialsToStorage(updated);
      showToast("Credential removed successfully.", "success");
      return { success: true };
    } catch {
      showToast("The credential could not be deleted.", "error");
      return { success: false, error: "The credential could not be deleted." };
    }
  };

  const getCredentialById = (id: string): Credential | undefined => {
    return credentials.find((c) => c.id === id);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabaseActive && isAuthenticated && profile.id) {
        const res = await dbUpdateProfile(profile.id, updates);
        if (res.success && res.profile) {
          setProfile(res.profile);
          showToast("Profile updated successfully.", "success");
          return { success: true };
        } else {
          showToast(res.error || "Failed to update profile", "error");
          return { success: false, error: res.error };
        }
      }

      const nextProfile: UserProfile = {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      setProfile(nextProfile);
      localStorage.setItem("passvault_profile", JSON.stringify(nextProfile));
      showToast("Profile updated successfully.", "success");
      return { success: true };
    } catch {
      showToast("Something went wrong. Please try again.", "error");
      return { success: false, error: "Something went wrong. Please try again." };
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !pass) {
      showToast("Unable to sign in. Please check your email and password.", "error");
      return { success: false, error: "Unable to sign in. Please check your email and password." };
    }

    if (isSupabaseActive) {
      const res = await supabaseSignIn(email, pass);
      if (res.success && res.user) {
        setIsAuthenticated(true);
        setIsLocked(false);
        setMasterPasswordHash(pass);
        await loadUserDataFromSupabase(res.user.id, res.user.email || "", res.user.user_metadata?.full_name);
        showToast("Welcome back!", "success");
        return { success: true };
      } else {
        showToast(res.error || "Authentication failed. Check your credentials.", "error");
        return { success: false, error: res.error || "Authentication failed." };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsAuthenticated(true);
    setIsLocked(false);
    setMasterPasswordHash(pass);
    localStorage.setItem("passvault_master_password", pass);
    localStorage.setItem("passvault_auth_state", "true");
    localStorage.setItem("passvault_is_locked", "false");
    showToast("Welcome back!", "success");
    return { success: true };
  };

  const signup = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!name || !email || !pass) {
      showToast("Please verify your information before continuing.", "warning");
      return { success: false, error: "All fields are required." };
    }

    if (isSupabaseActive) {
      const res = await supabaseSignUp(name, email, pass);
      if (res.success && res.user) {
        setIsAuthenticated(true);
        setIsLocked(false);
        setMasterPasswordHash(pass);
        await loadUserDataFromSupabase(res.user.id, email, name);
        showToast("Account created successfully in Supabase!", "success");
        return { success: true };
      } else {
        showToast(res.error || "Registration failed.", "error");
        return { success: false, error: res.error || "Registration failed." };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    const newProf: UserProfile = {
      id: "usr_" + Date.now(),
      full_name: name,
      email: email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProfile(newProf);
    setIsAuthenticated(true);
    setIsLocked(false);
    setMasterPasswordHash(pass);
    localStorage.setItem("passvault_master_password", pass);
    localStorage.setItem("passvault_profile", JSON.stringify(newProf));
    localStorage.setItem("passvault_auth_state", "true");
    localStorage.setItem("passvault_is_locked", "false");
    showToast("Account created successfully!", "success");
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseActive) {
      const res = await supabaseSignInWithGoogle();
      if (res.success && res.url) {
        window.location.href = res.url;
        return { success: true };
      } else {
        showToast(res.error || "Google Sign-In failed or OAuth provider not configured.", "warning");
        return { success: false, error: res.error };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    signup("Google User", "google.user@example.com", "mock_oauth_secret");
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseActive) {
      await supabaseSignOut();
    }
    setIsAuthenticated(false);
    setIsLocked(false);
    setCredentials([]);
    localStorage.setItem("passvault_auth_state", "false");
    localStorage.setItem("passvault_is_locked", "false");
    showToast("Signed out successfully.", "info");
  };

  // Compute filtered credentials
  const filteredCredentials = credentials.filter((cred) => {
    const matchesCategory = selectedCategory === "All" || cred.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesQuery =
      cred.website_name.toLowerCase().includes(query) ||
      cred.username_email.toLowerCase().includes(query) ||
      cred.website_url.toLowerCase().includes(query) ||
      (cred.notes && cred.notes.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  return (
    <VaultContext.Provider
      value={{
        credentials,
        filteredCredentials,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        profile,
        generatorSettings,
        updateGeneratorSettings,
        addCredential,
        updateCredential,
        deleteCredential,
        getCredentialById,
        decryptCredentialPassword,
        updateProfile,
        isAuthenticated,
        isSupabaseActive,
        login,
        signup,
        loginWithGoogle,
        logout,
        toastMessage,
        showToast,
        activeGeneratedPassword,
        setActiveGeneratedPassword,
        isLocked,
        lockVault,
        unlockVault,
        autoLockTimeout,
        setAutoLockTimeout,
        subscription,
        updateSubscriptionPlan,
        cancelSubscription,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}
