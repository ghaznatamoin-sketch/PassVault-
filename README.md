# PassVault — Secure Password Manager

A complete, full-stack, and secure web application to safely store, search, generate, and manage website and application login credentials in one centralized vault.

---

## 📌 Problem

People manage dozens of login credentials across websites, work services, e-commerce, banking, education, and social platforms. Remembering every password leads to password reuse, weak passwords, mix-ups, forgotten accounts, or storing credentials in insecure places like unencrypted text notes.

---

## 💡 Solution

**PassVault** provides a unified, secure web vault where users can manage login credentials with end-to-end user isolation, server-side cryptographic protection (AES-256-GCM), real-time search, category organization, and cryptographically secure password generation.

---

## ✨ Implemented Features

* **🔐 User Authentication:** Email & password registration with client validation, login, password recovery, master password reset, and secure logout.
* **🌐 Google Sign-In:** Built-in OAuth sign-in flow powered by Supabase Authentication.
* **🗄️ Password Vault CRUD:** Full lifecycle management (Add, View Details, Edit, and Delete with confirmation modal) for login credentials.
* **🏷️ Category Organization:** 6 dedicated category tabs (*Social, Work, Shopping, Finance, Education, Other*) plus *All* filter.
* **🔍 Real-Time Search:** Multi-attribute fuzzy search querying website name, URL, username/email, and notes.
* **👁️ Masked Passwords & Show/Hide:** All passwords masked by default (`••••••••`) with one-click decrypted reveal.
* **📋 1-Click Clipboard Copy:** Instant clipboard copy with visual checkmark feedback and automatic timeout reset.
* **🎲 CSPRNG Password Generator:** Cryptographically secure random password generation (`window.crypto.getRandomValues`) with customizable length slider (6–48 chars), character toggles, real-time entropy evaluation, and direct insertion into credential forms.
* **🛡️ Protected User Data & RLS:** Strict PostgreSQL Row Level Security (RLS) policies enforcing `auth.uid() = user_id` across all database tables.
* **🔒 Reversible AES-256-GCM Encryption:** Passwords are encrypted on the server before database storage, ensuring zero plaintext passwords in PostgreSQL.
* **📱 Responsive Design:** Tailored layouts for Desktop, Tablet, and Mobile with Midnight Black (`#070A10`) and Electric Blue (`#2563EB`) design system.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions & Route Handlers) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict type-checking) |
| **Styling & Design System** | [Tailwind CSS](https://tailwindcss.com/) & Plus Jakarta Sans typography |
| **Backend & Database** | [Supabase](https://supabase.com/) & [PostgreSQL](https://www.postgresql.org/) |
| **Authentication** | Supabase Auth (Email/Password & OAuth) |
| **Security & Authorization** | PostgreSQL Row Level Security (RLS) & WebCrypto / Node.js AES-256-GCM |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |
| **Version Control** | [GitHub](https://github.com/) |

---

## 🗃️ Database Schema & Architecture

Implemented in `supabase/schema.sql`:

1. **`public.profiles`**: Stores user identity linked 1:1 with `auth.users(id)`.
2. **`public.credentials`**: Stores user credentials linked 1:N with `auth.users(id)` including `category` and `encrypted_password`.
3. **`public.password_generator_settings`**: Stores per-user generator preferences linked 1:1 with `auth.users(id)`.
4. **Row Level Security Policies:** Enabled on all 3 tables with strict `auth.uid() = user_id` isolation.

---

## ⚙️ Installation & Local Setup

### 1. Prerequisites
* Node.js 18+ installed
* Git installed

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/passvault.git
cd passvault
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the project root:

```env
# Public Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Server-only master encryption secret (Never expose to client or Git)
ENCRYPTION_KEY=your-32-byte-hex-or-base64-secret-key-here
```

### 5. Run the Application
```bash
# Run development server
npm run dev

# Or build and run production server
npm run build
npm run start
```

Access the application in your browser at `http://localhost:3000`.

---

## 📸 Screenshots

> Screenshots will be added after final testing.

---

## 🚀 Future Improvements (Post-MVP Roadmap)

The following capabilities are planned for upcoming releases:
* **Browser Extension:** Chrome & Firefox extension package for login autofill.
* **Automatic Password Detection & Auto-Save:** In-browser modal prompt when new accounts are created.
* **Autofill:** One-click credential autofill on supported web login forms.
* **Subscription & Payment System:** Tiered plans and billing management.
* **Advanced Security & Breach Reports:** HaveIBeenPwned API integration for breach alerts.
* **AI Password Assistant:** Intelligent password health recommendations.
