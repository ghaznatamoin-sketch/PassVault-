# PassVault — Secure Password Manager
## Product Requirements Document (PRD)

> Source of truth for building PassVault. Consolidated from Assignments 1–11 without changing any product decision.
> **Product name:** PassVault — Secure Password Manager
> **Type:** Full-stack web application (Next.js + TypeScript + Tailwind CSS + Supabase + PostgreSQL, deployed on Vercel)

---

## 1. Product Overview

**One-liner:** PassVault is a secure password management product that helps users safely store, find, generate, and manage their website and application login credentials without needing to remember every password.

**Description:** A secure web application where users store, organize, search, generate, and manage credentials for websites and apps in one place. It reduces the need to remember many passwords or keep them in notebooks, notes, or documents.

**Product objective:** Provide a simple, secure, and convenient way to manage multiple login credentials while reducing password-related confusion and memory burden.

**Unique value / workflow:** Save → Search → View/Copy → Generate → Manage. (Future: Detect → Review → Save → Autofill via browser extension.) Designed to be understandable for ordinary, non-technical users.

---

## 2. Problem

- People use many websites/apps (social, email, shopping, education, work), each needing a password.
- Users forget or mix up passwords, reuse the same password, or keep them in notes, documents, notebooks, or browser storage.
- Reuse increases the impact of a single credential compromise (credential-stuffing).
- Existing tools (browser managers, notes, password-reset flows, some dedicated managers) can be insecure, incomplete, or too complicated for ordinary users.

**Evidence:** NordPass 2026 — average of 120 passwords per user (1,509 users, April 2026); NordPass 2025 — password reuse common among 1,727 adults (US/UK/DE); 40% store passwords in a browser's built-in manager; Verizon research links reuse to credential stuffing; password-reset screens are an everyday real-world signal.

---

## 3. Target Users

**Primary:** Students, employees/professionals, freelancers, general internet users, people managing multiple online accounts.
**Secondary:** Online shoppers, small business users, older internet users, people who keep passwords in notes/documents/spreadsheets.

---

## 4. Goals & Success Metrics

**Core journey (must work reliably):**
`Sign up / Login → Save a credential → Search for it → View/Copy it → Generate a strong password when needed`

| Area | Success criteria |
|---|---|
| Authentication | Sign up, login, logout, Google Sign-In, forgot/reset password all work |
| Vault | Create, view, edit, delete credentials; users cannot access other users' data |
| Search & Filter | Search by website/app name and username/email; filter by category; correct results |
| Password mgmt | Hidden by default; Show/Hide and Copy work; generator respects selected options |
| Security | Auth required; passwords never stored as plain text; RLS enforced; no secrets in frontend/GitHub |
| UX | Loading, error, and empty states present; responsive on desktop/tablet/mobile; no horizontal scroll |
| Delivery | Live public URL, GitHub repo, tested with 3 real users |

---

## 5. Scope

### 5.1 In Scope (Version 1 — final product)
Authentication, Password Vault (CRUD), category organization & filtering, search, Show/Hide, Copy, Password Generator (+ saved settings), Profile/Settings, responsive UI, loading/error/empty states, protected routes, RLS, deployment.

### 5.2 Out of Scope (Version 2 — do NOT build now)
Browser Extension, automatic password detection/auto-save, autofill, subscription & payment system (incl. one-month free trial), advanced security reports, security alerts, additional browser support, AI Password Assistant, more account-organization features.

---

## 6. Functional Requirements

### FR-1 Authentication (Supabase Auth)
- FR-1.1 Sign Up with name, email, password, confirm password.
- FR-1.2 Login with email + password.
- FR-1.3 Google Sign-In / Sign-Up.
- FR-1.4 Email verification screen (message, user email, continue, resend, back to login).
- FR-1.5 Forgot Password (enter email → send reset link) and Reset Password (new + confirm password, requirements shown).
- FR-1.6 Secure Logout → session ends → redirect to Login.
- FR-1.7 Session management via Supabase; valid session checked before any protected page.
- FR-1.8 On registration, the auth user is linked to a `profiles` record.
- FR-1.9 Unauthenticated users are redirected to Login.

### FR-2 Password Vault (Credentials CRUD)
- Fields: Website/App Name, Website URL, **Category**, Username/Email, Password, Notes (optional).
- **Create:** validated form; password encrypted before storage; saved to user's account.
- **Read:** list of credential cards/table; Credential Details screen (name, URL, category, username/email, hidden password, notes, created/updated info).
- **Update:** edit any field including password; `updated_at` refreshed.
- **Delete:** confirmation modal ("Delete this saved credential?" → Cancel / Confirm Delete); permanent deletion.

### FR-3 Password Visibility & Copy
- Passwords hidden by default everywhere (vault, details, search results).
- Show/Hide toggle; Copy Password button; copy feedback ("Copied").
- Sensitive values may use monospace styling; avoid displaying sensitive data unnecessarily.

### FR-4 Search
- Query-based/real-time search over the user's real DB records.
- Search by **Website/App Name** and **Username/Email** (e.g., "Facebook" → Facebook credential).
- Search Results view: matching name, username/email, hidden password, Show/Hide, Copy, Open Details.
- No-result message: "No credentials found for your search."

### FR-5 Category Filtering
- Categories: **Social, Work, Shopping, Finance, Education, Other**.
- Category stored on each credential; filter uses DB data.
- Empty category message: "No credentials found in this category."

### FR-6 Password Generator
- Options: length, uppercase, lowercase, numbers, symbols.
- Generate, Copy, and **Use Password** (pass into Add/Edit credential form).
- Preview visually separated from normal text; easy to copy.
- Validation: at least one character type; sensible length bounds.
- Per-user preferences saved in `password_generator_settings`.
- Generate with a cryptographically secure RNG (`crypto.getRandomValues`), not `Math.random`.

### FR-7 Dashboard
- Welcome message, total saved credentials, quick search, Add New Credential button, Password Generator shortcut, recently added accounts, security-related reminders where appropriate.

### FR-8 Profile / Account Settings
- Name, email, account information, profile update.
- Security settings: change account password, session/security options, logout.

### FR-9 Landing Page
- Logo, nav bar, headline, short description, **Get Started** CTA, Login button, feature highlights, password security/value section, How PassVault Works, footer.

### FR-10 Navigation
- Dashboard → Password Vault → Add Credential → Password Generator → Settings → Profile → Logout, with clear active state.
- Desktop: full sidebar. Tablet: compact sidebar. Mobile: collapsible menu or bottom navigation.

---

## 7. Non-Functional Requirements

### 7.1 Security (critical)
- Supabase Auth + protected routes + **Row Level Security (RLS)** on all user tables; policy concept `auth.uid() = user_id` for SELECT/INSERT/UPDATE/DELETE.
- User A can never read, update, or delete User B's data. Do not rely on frontend checks alone.
- Website passwords are **never stored as plain text**; encrypt before storing in `encrypted_password`.
- **Encryption keys/secrets must never be in frontend source code.** Perform encryption/decryption server-side (Next.js server actions / route handlers) with the key in a server-only environment variable.
- Never expose or commit: user passwords, API secrets, private keys, Supabase **service-role key**, `.env` files.
- Public config (Supabase URL, anon key) separated from private secrets; production env vars set in Vercel.
- Error messages must not expose technical/sensitive details.
- Decrypted passwords shown only on explicit request (Show/Copy).

### 7.2 Validation
- Required fields not empty; valid email format; password requirements checked; valid URL format where required; generator length/settings validated; clear inline error messages.

### 7.3 Error, Loading & Empty States
| Type | Examples |
|---|---|
| Login error | "Unable to sign in. Please check your email and password." |
| Save error | "Your credential could not be saved. Please try again." |
| Delete error | "The credential could not be deleted." |
| Network/DB error | "Something went wrong. Please try again." |
| Success | "Credential saved successfully." |
| Warning | "Please verify your information before continuing." |
| Empty vault | "Your vault is empty. Add your first account to get started." |
| Empty search | "No credentials found for your search." |
| Empty category | "No credentials found in this category." |

Loading indicators for: login, registration, dashboard/credential loading, save/update/delete, search/filter. Buttons show a spinner and disable during the operation.

### 7.4 Responsiveness
Desktop, tablet, mobile. Forms/cards stack on small screens, full-width primary buttons on mobile, easy-to-tap Show/Hide and Copy, readable text, **no horizontal scrolling**.

### 7.5 Performance
Main screens load and respond without unnecessary delay.

---

## 8. Data Model (Supabase / PostgreSQL)

**Relationship:** `Supabase Auth User → Profile (1:1) | Credentials (1:many) | Password Generator Settings (1:1)`

### `profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| full_name | text | |
| email | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `credentials`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| website_name | text | |
| website_url | text | |
| category | text | Social / Work / Shopping / Finance / Education / Other |
| username_email | text | |
| encrypted_password | text | never plain text |
| notes | text | optional |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `password_generator_settings`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| password_length | integer | |
| uppercase_enabled | boolean | |
| lowercase_enabled | boolean | |
| numbers_enabled | boolean | |
| symbols_enabled | boolean | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

RLS enabled on all three tables. Supabase Storage is **not** needed (no uploads/images/attachments).

---

## 9. Screens

1. Landing Page  2. Sign Up  3. Login  4. Email Verification  5. Forgot Password  6. Reset Password
7. Dashboard  8. Password Vault  9. Add Credential  10. Credential Details  11. Edit Credential
12. Password Generator  13. Search Results  14. Profile / Account Settings  15. Security Settings  16. Logout / Session handling

---

## 10. User Flows

**Main:** Landing → Sign Up/Login → (Email Verification) → Dashboard → Password Vault → Add Credential (enter name, URL, category, username/email, password *or* generate, notes) → Save to Supabase → Credential appears in Vault → Search/Filter → View / Edit / Copy / Delete.

**Generator:** Dashboard → Password Generator → Select length → Select character types → Generate → Copy (or Use in credential form).

**Forgot password:** Login → Forgot Password → Enter email → Reset link → Create new password → Login.

**Logout:** Dashboard → Logout → Session ends → Login.

---

## 11. UI/UX & Design System

**Feel:** modern, premium, secure, minimal, professional, trustworthy, clean, beginner-friendly. Avoid visual complexity; keep key actions easy to find.

**Colors:** Midnight Black (primary bg), Dark Charcoal (secondary bg), **Electric Blue** (primary accent/active/links/glow), White (primary text), Light Silver/Gray (secondary text), Green (success), Amber (warning), Red (error/delete only).

**Typography:** Plus Jakarta Sans; clear large headings, medium section headings, comfortable body, readable labels, monospace for sensitive credential values.

**Visual style:** dark backgrounds, subtle blue glow, soft shadows, glass-style cards, rounded corners, clean borders, simple icons, subtle hover/transition animations.

**Spacing:** 8px (small), 16px (medium), 24px (large), 32px (section), 48px+ (major sections).

**Components:**
- **Buttons:** Primary (Electric Blue, white text) for Login/Create Account/Save/Generate; Secondary for Cancel/Back; Danger (red) only for Delete/destructive.
- **Inputs:** label, placeholder, consistent height, rounded, focus + error states, validation message; password fields include Show/Hide.
- **Cards:** dark surface, subtle border, rounded, soft shadow/glow, consistent padding (credentials, stats, features, generator).
- **Navigation:** visible active state.
- **Modals:** delete confirmation and important security confirmations.
- **Lists/Tables:** desktop = structured table/list; mobile = stacked credential cards; passwords hidden by default.
- **Alerts:** success / error / warning.
- **Badges:** account status, security status, recent items, active states.
- Accessible text contrast, clear hover/focus states, consistent button sizes and input heights.

---

## 12. Technology Stack & Architecture

| Layer | Technology |
|---|---|
| Frontend | Next.js + TypeScript + Tailwind CSS |
| Backend | Supabase |
| Database | PostgreSQL (via Supabase) |
| Authentication | Supabase Auth (email/password + Google) |
| Deployment | Vercel |
| Source control | GitHub |
| Dev tool | Google Antigravity (AI-assisted) |

```
User → PassVault UI (Next.js) → Supabase Auth → Supabase Backend → PostgreSQL → RLS Policies → User-specific data
```

---

## 13. Quality, Testing & Delivery Requirements

- **Testing:** functional (all features), UI, responsive (desktop/tablet/mobile), error testing (empty forms, invalid email, weak password, wrong login, invalid URL, DB/network/auth errors, unauthorized access), and **user testing with 3 real users**. Record real bugs (title, description, steps, expected, actual, status). Never fabricate results or feedback.
- **GitHub:** clean structure, `.gitignore`, meaningful commits, README (problem, solution, features, stack, real setup/env instructions without secrets, screenshots, future improvements).
- **Deployment:** GitHub → Vercel + production Supabase; env vars via Vercel; test on another browser/device and on mobile; capture screenshots.
- **Final submission:** live URL, GitHub repo, Supabase project, documentation, presentation (10 slides), screenshots, recorded demo.

---

## 14. Future Improvements (Version 2)

Browser Extension (detect login fields, "Save Password to PassVault?" prompt, review/edit, autofill), automatic password saving, autofill, advanced security reports, security alerts, additional browser support, subscription & payment (one-month free trial, affordable paid plan), more account organization features, AI Password Assistant.
