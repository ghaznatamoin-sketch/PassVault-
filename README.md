# PassVault — Secure Password Manager

A secure, intuitive, and modern web application to safely store, search, copy, generate, and manage website and application login credentials in one central vault.

---

## 🎯 Phase 4 Status: MVP TECHNICAL SPECIFICATION COMPLETE

In Phase 4, we implemented and verified the complete **MVP Planning & Technical Specification**, strictly focusing on the core web application journey:
`Create Account → Login → Save Credential → Search Credential → View/Copy Password → Generate Strong Password`

---

## 🚀 Key MVP Features

### 1. 🔐 Password Vault (CRUD)
- **Add Credential (`/vault/new`):** Validated form storing Website/App Name, Website URL, Category (*Social, Work, Shopping, Finance, Education, Other*), Username/Email, Password (manual or generated), and Optional Notes.
- **View Saved Credentials (`/vault`):** Responsive grid & card views with masked passwords by default.
- **Credential Details (`/vault/[id]`):** Dedicated view with full account details, timestamps, and notes.
- **Edit Credential (`/vault/[id]/edit`):** In-place updates refreshing `updated_at`.
- **Delete Credential:** Confirmation modal matching MVP specification (*"Delete this saved credential?"*).
- **Search & Filter:** Real-time query matching by website name, URL, and username/email, with 6 category filter tabs.

### 2. 👁️ Password Visibility & Copy
- **Hidden by default** across all vault cards, search results, and detail screens.
- **Show/Hide Toggle:** Instant eye toggle with monospace font formatting.
- **One-Click Copy:** Instant clipboard copy with visual "Copied" feedback.

### 3. 🎲 Cryptographic Password Generator (`/generator`)
- Built using cryptographically secure random number generator (`window.crypto.getRandomValues`), strictly avoiding `Math.random`.
- Configurable length slider (6 to 48 characters) and toggles for Uppercase, Lowercase, Numbers, and Symbols.
- Real-time password entropy & strength evaluation meter.
- **"Use Password" Integration:** Seamlessly passes generated passwords directly into the Add Credential form (`/vault/new`).

### 4. 🔑 Authentication & Access
- **Registration (`/signup`):** Full Name, Email, Password, and Password Confirmation validation.
- **Login (`/login`):** Email & Password authentication with error handling, plus Google OAuth CTA.
- **Email Verification (`/verify-email`):** Account verification feedback and resend flow.
- **Forgot Password (`/forgot-password`):** Email reset link submission flow.
- **Reset Password (`/reset-password`):** Master password update with validation requirements.
- **Secure Logout:** Ends session and redirects to `/login`.
- **Protected Pages:** Enforces route protection on all internal vault screens.

### 5. 🗄️ Database Schema & Architecture (`supabase/schema.sql`)
- **Profiles Table:** `id (uuid PK)`, `user_id (uuid FK -> auth.users)`, `full_name`, `email`, `created_at`, `updated_at`.
- **Credentials Table:** `id (uuid PK)`, `user_id (uuid FK -> auth.users)`, `website_name`, `website_url`, `category`, `username_email`, `encrypted_password`, `notes`, `created_at`, `updated_at`.
- **Password Generator Settings Table:** `id (uuid PK)`, `user_id (uuid FK -> auth.users)`, `password_length`, `uppercase_enabled`, `lowercase_enabled`, `numbers_enabled`, `symbols_enabled`, `created_at`, `updated_at`.
- **Row Level Security (RLS):** Policies enforcing `auth.uid() = user_id` for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on all user tables.

---

## 🛠️ The 16 MVP Screens

| Screen | Route | Description |
|---|---|---|
| 1. Landing / Home | `/` | Product overview, problem statement, target users, and CTA |
| 2. Sign Up | `/signup` | User account registration |
| 3. Login | `/login` | User authentication sign in |
| 4. Email Verification | `/verify-email` | Account verification screen |
| 5. Forgot Password | `/forgot-password` | Password recovery link request |
| 6. Reset Password | `/reset-password` | Master password reset screen |
| 7. Dashboard | `/dashboard` | Metrics, recent accounts, and quick actions |
| 8. Password Vault | `/vault` | Full vault with real-time search & 6 category filters |
| 9. Add New Credential | `/vault/new` | Credential creation form |
| 10. Credential Details | `/vault/[id]` | Full credential information & copy tools |
| 11. Edit Credential | `/vault/[id]/edit` | In-place credential edit form |
| 12. Password Generator | `/generator` | CSPRNG password generator |
| 13. Search Results | `/search` | Dedicated search results view |
| 14. Profile / Account Settings | `/profile` | Profile name and email management |
| 15. Security Settings | `/settings` | Master password change & session controls |
| 16. Logout / Session Handling | `/login` | Secure session termination & redirection |

---

## 🚫 Features Postponed from MVP (Per MVP Spec §5 & §8)
- **Browser Extension:** Postponed to Version 2.
- **Automatic Password Detection & Auto-Save:** Postponed to Version 2.
- **Autofill:** Postponed to Version 2.
- **AI Password Assistant:** Postponed to Version 2.
- **Subscription & Payment System:** Postponed to Version 2.
- **Advanced Security Reports:** Postponed to Version 2.

---

## 💻 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build & run production server
npm run build
npm run start
```
