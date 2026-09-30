# PassVault — Secure Password Manager
## MVP Plan & Technical Specification

> Read together with `PRD.md`. This file defines **what to build first, in what order, and how**.
> Product name: **PassVault — Secure Password Manager**

---

## 1. MVP Definition

The PassVault MVP is the first functional version: a secure, simple web app to store, find, and manage website/app login credentials. It solves the core problem — forgetting, mixing up, and struggling to find many passwords — without building every planned feature.

**MVP goal (user journey):**
`Create account → Login → Save credentials → Search credentials → View/Copy password → Generate strong password when needed`

---

## 2. Instructions for Antigravity (Build Rules)

1. Stack: **Next.js (App Router) + TypeScript + Tailwind CSS + Supabase (Auth + PostgreSQL) + Vercel**.
2. Follow the PassVault design system (Midnight Black + Electric Blue + White/Silver, Plus Jakarta Sans, glass-style cards, subtle blue glow, rounded components).
3. Use a clean structure with reusable components (see §9). Explain/review important generated code.
4. Build in the phases of §8. Finish and verify each phase before starting the next.
5. **Security rules (non-negotiable):**
   - Passwords hidden by default; never stored as plain text.
   - Encrypt/decrypt **server-side only** (server actions / route handlers). Encryption key lives in a server-only env var (no `NEXT_PUBLIC_` prefix), never in frontend code.
   - Never expose or commit the Supabase service-role key, `.env` files, or secrets. Provide `.env.example` with placeholder names only.
   - Enable RLS on every table with `auth.uid() = user_id` policies.
   - Use `crypto.getRandomValues` for password generation.
6. Do **not** build Version 2 features (see §5).
7. Every user action needs loading, error, and empty states with the exact messages in `PRD.md` §7.3.

---

## 3. MVP Features

### 3.1 Authentication
Registration (name, email, password, confirm), email/password login, **Google Sign-In**, account (email) verification, Forgot Password, Reset Password, secure logout, session management, protected routes with redirect to Login.

### 3.2 Password Vault
Fields: Website/App Name, Website URL, **Category**, Username/Email, Password, Notes (optional).
Actions: Add, View list, View details, Edit, Delete (with confirmation modal).

### 3.3 Password Visibility
Hidden by default; Show / Hide toggle.

### 3.4 Copy Password
Copy button on cards, details, and search results, with "Copied" feedback.

### 3.5 Search
By Website/App Name **and** Username/Email; real-time or query-based on DB data.

### 3.6 Category Filtering
Social, Work, Shopping, Finance, Education, Other.

### 3.7 Password Generator
Length, uppercase, lowercase, numbers, symbols; Generate, Copy, **Use Password** (fills credential form); settings saved per user.

### 3.8 Dashboard & Profile
Welcome message, total credentials, quick search, Add button, generator shortcut, recent accounts, security reminders; profile name/email update; security settings (change password, session options, logout).

### 3.9 Basic Security
Authenticated vault access, users access only their own credentials, secure logout, protected DB access (RLS).

### 3.10 Interface Requirements
Working navigation (Dashboard, Vault, Add Credential, Generator, Settings, Profile, Logout), responsive design (desktop/tablet/mobile), reusable components (buttons, inputs, password fields, search bar, sidebar/nav, cards, credential list, modals, dropdowns, toggles, copy buttons, alerts, loading indicators), loading/error/empty states, form validation.

---

## 4. MVP Screens (16)

1. Landing Page  2. Sign Up  3. Login  4. Email Verification  5. Forgot Password  6. Reset Password
7. Dashboard  8. Password Vault  9. Add New Credential  10. Credential Details  11. Edit Credential
12. Password Generator  13. Search Results  14. Profile / Account Settings  15. Security Settings  16. Logout / Session handling

---

## 5. Explicitly NOT in MVP (postponed to Version 2)

| Feature | Reason |
|---|---|
| Browser Extension | Needs browser-specific development, permissions, login-field detection, secure communication, autofill |
| Automatic password detection & auto-save | Part of the extension; needs extra security testing |
| Autofill | Depends on the extension; needs cross-site testing |
| AI Password Assistant | Not required to solve the core problem |
| Subscription & payment (incl. free trial) | Validate core functionality before billing |
| Advanced security reports / alerts | Add after the core vault is stable |

---

## 6. MVP User Flows

- **New user:** Landing → Sign Up → Verify Account → Login → Dashboard → Password Vault
- **Add credential:** Vault → Add New Credential → name → URL → category → username/email → password (type or generate) → notes → Save → appears in Vault
- **Find credential:** Dashboard/Vault → Search → select account → View → Show Password → Copy
- **Filter:** Vault → choose category → filtered list
- **Generate password:** Generator → options → Generate → Copy / Use in credential form
- **Edit:** Vault → select → Edit → update → Save
- **Delete:** Vault → select → Delete → Confirm
- **Forgot password:** Login → Forgot Password → email → reset link → new password → Login
- **Logout:** Dashboard → Logout → session ends → Login

---

## 7. Technical Architecture

```
User → Next.js Web App → Supabase Auth → Supabase Backend → PostgreSQL → RLS Policies → User's protected data
```

- **Frontend:** Next.js + TypeScript UI (dashboard, vault, forms, search, generator), Tailwind CSS styling.
- **Auth:** Supabase Auth (registration, login, Google, verification, recovery, sessions).
- **Backend/DB:** Supabase + PostgreSQL.
- **Authorization:** RLS — authenticated users only see their own rows.
- **Deployment:** Vercel (env vars set in Vercel settings).

### Database (all tables have RLS enabled)

**profiles:** id (uuid PK), user_id (uuid FK), full_name (text), email (text), created_at, updated_at (timestamptz)

**credentials:** id (uuid PK), user_id (uuid FK), website_name, website_url, category, username_email, encrypted_password, notes (all text), created_at, updated_at (timestamptz)

**password_generator_settings:** id (uuid PK), user_id (uuid FK), password_length (integer), uppercase_enabled, lowercase_enabled, numbers_enabled, symbols_enabled (boolean), created_at, updated_at (timestamptz)

**RLS pattern (apply to SELECT / INSERT / UPDATE / DELETE on each table):**
```sql
alter table credentials enable row level security;

create policy "own rows select" on credentials for select using (auth.uid() = user_id);
create policy "own rows insert" on credentials for insert with check (auth.uid() = user_id);
create policy "own rows update" on credentials for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows delete" on credentials for delete using (auth.uid() = user_id);
```
Auto-maintain `updated_at` with a trigger; create the `profiles` row on sign-up (trigger or on first login).

### Password protection flow
```
User enters password → server encrypts (key in server-only env) → encrypted value saved in credentials.encrypted_password
Show/Copy requested → authenticated session verified → server decrypts → password returned only on request
```

### Environment variables
| Variable | Exposure |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public |
| `ENCRYPTION_KEY` | **server-only secret** |
| Supabase service-role key | **never in frontend / never committed** (avoid using it) |

---

## 8. Build Phases

**Phase 1 — Frontend MVP (Assignment 6)**
Project setup, design system tokens (Tailwind theme, Plus Jakarta Sans), reusable components, all 16 screens with working navigation, responsive layout, loading/error/empty states, using temporary local data for vault, search, filter, generator, show/hide, copy, add/edit/delete.

**Phase 2 — Backend, Database & Auth (Assignment 7)**
Supabase project, tables, relationships, RLS + policies, real Supabase Auth (sign up, login, Google, logout, verification, forgot/reset), session management, protected routes, credential CRUD with server-side password encryption, secure environment configuration.

**Phase 3 — Full-Stack Integration (Assignment 8)**
Replace all dummy data with Supabase data; add `category` field; real search (name + username/email) and category filtering; form validation; database queries scoped to the user; profile and generator settings persistence; error/loading/empty states wired to real operations.

**Phase 4 — Testing, Bug Fixing & GitHub (Assignment 9)**
Functional, UI, responsive, and error testing; 3-user feedback; bug log; fixes; GitHub repo with README, `.gitignore`, meaningful commits.

**Phase 5 — Deployment (Assignment 10)**
GitHub → Vercel, production Supabase, env vars in Vercel, Google OAuth redirect URLs for production, 10 deployment tests (live URL, test account, login, features, create/update/delete record, other browser/device, mobile, errors).

**Phase 6 — Final Product (Assignment 11)**
Polish UI, final docs, 10-slide presentation, screenshots, recorded demo.

---

## 9. Suggested Project Structure

```
/app                 # routes: (marketing), (auth), (dashboard)
  /login /signup /verify-email /forgot-password /reset-password
  /dashboard /vault /vault/new /vault/[id] /vault/[id]/edit
  /generator /search /profile /settings
/components
  /ui                # Button, Input, PasswordField, Card, Modal, Alert, Badge, Toggle, Dropdown, Spinner
  /forms             # AuthForms, CredentialForm
  /navigation        # Sidebar, MobileNav, Topbar
  /vault             # CredentialCard, CredentialList, CredentialDetails, SearchBar, CategoryFilter
  /generator         # GeneratorPanel, LengthSlider, OptionToggles
/lib
  /supabase          # browser + server clients, middleware helpers
  /crypto            # server-only encrypt/decrypt
  /validation        # form validators
  /utils             # password generator, clipboard, formatters
/types
/styles              # Tailwind theme / globals
/public              # assets, logo
.env.example
```

---

## 10. MVP Success Criteria (Definition of Done)

**Authentication:** create account; login/logout; Google Sign-In; forgot + reset password.
**Vault:** create, view, edit, delete credential; cannot access another user's credentials.
**Search/Filter:** search by name and username/email returns the correct account; category filter works.
**Password management:** hidden by default; Show/Hide and Copy work; generator honors selected options.
**Security:** auth required for vault; passwords not stored as plain text; RLS restricts rows; no secrets in frontend/GitHub.
**Responsiveness/Performance:** works on desktop, tablet, mobile; no horizontal scroll; screens respond without unnecessary delay.
**Core validation:** a user reliably completes `Login → Save a password → Search for it → View/Copy it → Generate a new strong password`.

---

## 11. Feature Checklist

- [ ] Landing Page  - [ ] Sign Up  - [ ] Login  - [ ] Google Sign-In  - [ ] Email Verification
- [ ] Forgot Password  - [ ] Reset Password  - [ ] Logout / Session handling  - [ ] Protected routes
- [ ] Dashboard  - [ ] Password Vault  - [ ] Add / Edit / Delete Credential  - [ ] Credential Details
- [ ] Show/Hide Password  - [ ] Copy Password  - [ ] Search (name + username/email)  - [ ] Category filter
- [ ] Password Generator (+ saved settings)  - [ ] Profile / Settings
- [ ] Row Level Security  - [ ] Password encryption  - [ ] Form validation
- [ ] Loading / Error / Empty states  - [ ] Responsive design  - [ ] Reusable components
- [ ] GitHub repo + README  - [ ] Vercel deployment  - [ ] Testing + 3-user feedback
