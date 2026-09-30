"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Credential, Category, PasswordGeneratorSettings, UserProfile } from "./types";

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
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toastMessage: { text: string; type: "success" | "error" | "warning" | "info" } | null;
  showToast: (text: string, type?: "success" | "error" | "warning" | "info") => void;
  activeGeneratedPassword: string | null;
  setActiveGeneratedPassword: (pass: string | null) => void;
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
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
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
  const [activeGeneratedPassword, setActiveGeneratedPassword] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  // Load from local storage on mount (Phase 1 Frontend MVP)
  useEffect(() => {
    try {
      const storedCreds = localStorage.getItem("passvault_credentials");
      if (storedCreds) {
        setCredentials(JSON.parse(storedCreds));
      } else {
        localStorage.setItem("passvault_credentials", JSON.stringify(SEED_CREDENTIALS));
      }

      const storedProfile = localStorage.getItem("passvault_profile");
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }

      const storedSettings = localStorage.getItem("passvault_generator_settings");
      if (storedSettings) {
        setGeneratorSettings(JSON.parse(storedSettings));
      }

      const storedAuth = localStorage.getItem("passvault_auth_state");
      if (storedAuth !== null) {
        setIsAuthenticated(storedAuth === "true");
      }
    } catch (e) {
      console.error("Local storage load error:", e);
    }
  }, []);

  const showToast = (text: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((current) => (current?.text === text ? null : current));
    }, 4000);
  };

  const saveCredentialsToStorage = (updated: Credential[]) => {
    setCredentials(updated);
    try {
      localStorage.setItem("passvault_credentials", JSON.stringify(updated));
    } catch (e) {
      console.error("Local storage save error:", e);
    }
  };

  const updateGeneratorSettings = (settings: Partial<PasswordGeneratorSettings>) => {
    setGeneratorSettings((prev) => {
      const next = { ...prev, ...settings };
      try {
        localStorage.setItem("passvault_generator_settings", JSON.stringify(next));
      } catch (e) {
        console.error("Local storage settings save error:", e);
      }
      return next;
    });
  };

  const addCredential = async (
    credentialData: Omit<Credential, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<{ success: boolean; id?: string; error?: string }> => {
    try {
      // Simulate realistic async operation
      await new Promise((resolve) => setTimeout(resolve, 350));

      if (!credentialData.website_name || !credentialData.username_email || !credentialData.password) {
        showToast("Please verify your information before continuing.", "warning");
        return { success: false, error: "Required fields cannot be empty." };
      }

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
      await new Promise((resolve) => setTimeout(resolve, 350));
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
      await new Promise((resolve) => setTimeout(resolve, 350));
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
      await new Promise((resolve) => setTimeout(resolve, 300));
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
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (!email || !pass) {
      showToast("Unable to sign in. Please check your email and password.", "error");
      return { success: false, error: "Unable to sign in. Please check your email and password." };
    }
    setIsAuthenticated(true);
    localStorage.setItem("passvault_auth_state", "true");
    showToast("Welcome back!", "success");
    return { success: true };
  };

  const signup = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (!name || !email || !pass) {
      showToast("Please verify your information before continuing.", "warning");
      return { success: false, error: "All fields are required." };
    }
    const newProf: UserProfile = {
      id: "usr_" + Date.now(),
      full_name: name,
      email: email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProfile(newProf);
    setIsAuthenticated(true);
    localStorage.setItem("passvault_profile", JSON.stringify(newProf));
    localStorage.setItem("passvault_auth_state", "true");
    showToast("Account created successfully!", "success");
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("passvault_auth_state", "false");
    showToast("Signed out successfully.", "info");
  };

  // Compute filtered credentials based on category and search query
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
        updateProfile,
        isAuthenticated,
        login,
        signup,
        logout,
        toastMessage,
        showToast,
        activeGeneratedPassword,
        setActiveGeneratedPassword,
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
