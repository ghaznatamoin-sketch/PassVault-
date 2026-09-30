# PassVault — Secure Password Manager

A secure, intuitive, and user-friendly digital solution for managing login credentials, finding saved credentials when needed, generating strong passwords, and organizing accounts across websites and applications.

---

## 🎯 Phase 1 — Frontend MVP Overview

Phase 1 establishes the product foundation for **PassVault — Secure Password Manager**, directly addressing the core problem: users struggling to remember, securely store, and organize passwords across diverse services (work, social, shopping, education, finance).

### Target Audience
- 🎓 **Students:** Course portals, LMS logins, student emails
- 💼 **Employees & Professionals:** Work emails, corporate suites, dev tools
- 💻 **Freelancers:** Client dashboards, invoicing platforms, SaaS tools
- 🛍️ **Online Shoppers:** Retail accounts, shipping portals
- 🏢 **Small Business Owners:** Merchant services, banking, operations
- 🌐 **General Internet Users:** Replacing repeated passwords & unencrypted notes

---

## 🚀 Key Features Implemented in Phase 1

1. **Design System & UI Theme:**
   - Dark aesthetic: *Midnight Black* (`#070A10`), *Dark Charcoal* (`#111827`), *Electric Blue* (`#2563EB`) accent & glow
   - Typography: *Plus Jakarta Sans* font with monospace sensitive credential styling
   - Glassmorphism cards, modals, alerts, badges, toggles, and responsive navigation

2. **16 Complete Screens with Working Navigation:**
   - **Landing Page (`/`)**: Hero, Problem & Evidence, Target Audience, Features, How It Works
   - **Sign Up (`/signup`)**: Name, Email, Password, Confirm Password, Google OAuth CTA
   - **Login (`/login`)**: Email & Password authentication with error handling
   - **Email Verification (`/verify-email`)**: Verification notice, resend action, flow link
   - **Forgot Password (`/forgot-password`)**: Email recovery prompt & confirmation
   - **Reset Password (`/reset-password`)**: New password validation & confirmation
   - **Dashboard (`/dashboard`)**: Metric cards, category breakdown, quick search, recent accounts, security hygiene reminder
   - **Password Vault (`/vault`)**: Real-time search, 6 category tabs (*Social, Work, Shopping, Finance, Education, Other*), credentials list, show/hide, copy, delete modal
   - **Add New Credential (`/vault/new`)**: Validated creation form with direct generator integration
   - **Credential Details (`/vault/[id]`)**: Full account details, copy username/password, notes, timestamps
   - **Edit Credential (`/vault/[id]/edit`)**: In-place edit with persistence
   - **Password Generator (`/generator`)**: Cryptographically secure generator (`crypto.getRandomValues`), length slider (6–48), character set toggles, strength meter, "Use in Form"
   - **Search Results (`/search`)**: Real-time query matching across website name, URL, and username/email
   - **Profile Settings (`/profile`)**: Name, email, member metadata
   - **Security Settings (`/settings`)**: Master password update, session overview, secure logout
   - **Logout Flow**: Working session clearance with modal and redirection to `/login`

3. **User Feedback & State Handling:**
   - Exact error, loading, and empty state messages as defined in PRD §7.3:
     - *"Your vault is empty. Add your first account to get started."*
     - *"No credentials found for your search."*
     - *"No credentials found in this category."*
     - *"Credential saved successfully."*
     - *"Delete this saved credential?"*

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **Icons:** Lucide React
- **Cryptography:** Web Crypto API (`window.crypto.getRandomValues`) for CSPRNG

---

## 💻 Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```
