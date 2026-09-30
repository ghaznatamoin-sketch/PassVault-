# PassVault — Secure Password Manager

A secure, modern, and user-friendly password management web application built to store, find, generate, and manage website and application login credentials without needing to remember every password.

---

## 🎯 Phase 3 Status: COMPLETE

In Phase 3, we implemented and verified the complete **Product Requirements Document (PRD)** specifications, ensuring full compliance with the core user journey:
`Sign Up / Login → Save a Credential → Search for it → View / Copy it → Generate a strong password when needed → Autofill & Lock`

---

## 🚀 Key Modules & PRD Requirements

### 1. 🔐 Password Vault & Management (CRUD)
- **Add Credential (`/vault/new`):** Validated inputs for Website Name, Website URL, Category (*Social, Work, Shopping, Finance, Education, Other*), Username/Email, Password, and Optional Notes.
- **View Saved Credentials (`/vault`):** List and grid views with masked passwords by default, Show/Hide eye toggle, one-click Copy with "Copied" toast feedback.
- **Credential Details (`/vault/[id]`):** Dedicated view with full account information, username copy, password show/copy, notes, and created/updated timestamps.
- **Edit Credential (`/vault/[id]/edit`):** In-place updates refreshing `updated_at`.
- **Delete Credential:** Protected deletion flow with confirmation modal: *"Delete this saved credential?"*
- **Search & Filter:** Real-time query matching across website name, URL, and username/email, plus 6 category filter tabs with dynamic item counters.

### 2. 🎲 Cryptographic Password Generator (`/generator`)
- Generates cryptographically secure passwords using `window.crypto.getRandomValues`.
- Custom length slider (6 to 48 characters) and toggles for Uppercase, Lowercase, Numbers, and Symbols.
- Live password strength evaluation meter.
- **One-Click Action:** "Copy Password" and "Use in Credential Form" shortcuts.

### 3. 🛡️ Cryptographic Security & Form Validation
- **AES-GCM 256-bit Encryption Foundation (`lib/crypto.ts`):** Real Web Crypto API implementation utilizing PBKDF2 with 100,000 iterations for key derivation and random salts/IVs.
- **Validation Library (`lib/validation.ts`):** Standard email format, URL formatting, and required field validation.
- **Authentication Guard (`components/navigation/AppLayout.tsx`):** Enforces route protection (FR-1.9) redirecting unauthenticated sessions to `/login`.

### 4. 🧩 PassVault Browser Extension (Manifest V3)
- **Real Extension Codebase (`/extension`):** Manifest V3 package with `manifest.json`, `background.js` service worker, `content.js` field discovery script, `popup.html`, and `popup.js`.
- **Interactive Extension Hub & Simulator (`/extension`):** Live simulator demonstrating the full workflow:
  `Detect → Review → Save → Search → Autofill → Manage`

### 5. 💳 Subscription & Billing (`/subscription`)
- **30-Day Free Trial:** Full feature access initialized for all accounts with a live countdown banner.
- **Pro Plans:** Transparent pricing for Monthly Pro ($2.99/mo) and Annual Pro ($29.99/yr).
- **Interactive State Transitions:** Plan upgrade, downgrade, and cancellation management.

---

## 🛠️ Complete Application Routes (17 Routes)

| Route | Purpose |
|---|---|
| `/` | Landing Page with Problem, Target Users, Features & How It Works |
| `/dashboard` | Dashboard with stats, recent accounts, trial status, and quick lock |
| `/vault` | Vault with real-time search, 6 category tabs, copy, show/hide |
| `/vault/new` | Add new credential with generator shortcut |
| `/vault/[id]` | Credential details screen with timestamps and notes |
| `/vault/[id]/edit` | Edit credential with live persistence |
| `/generator` | Cryptographic generator with length slider and character set toggles |
| `/extension` | Browser Extension hub and interactive workflow simulator |
| `/subscription` | Subscription management, trial days countdown, and plan switcher |
| `/search` | Dedicated search results view |
| `/profile` | Profile name and email settings |
| `/settings` | Security settings, master password change, and auto-lock timeout |
| `/login` | Authentication sign in with Google OAuth CTA |
| `/signup` | User registration with master password confirmation |
| `/verify-email` | Account email verification screen |
| `/forgot-password` | Password recovery request screen |
| `/reset-password` | Master password reset screen |

---

## 💻 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build & start for production
npm run build
npm run start
```
