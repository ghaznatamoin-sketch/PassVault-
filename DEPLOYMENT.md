# PassVault — Production Deployment Guide

This guide details the complete process for deploying PassVault to **Vercel** with a **Supabase PostgreSQL** backend and **GitHub** CI/CD.

---

## 1. Prerequisites
- [GitHub Account](https://github.com)
- [Vercel Account](https://vercel.com)
- [Supabase Account & Project](https://supabase.com)

---

## 2. Supabase Cloud Database Setup

1. Create a new project in the [Supabase Dashboard](https://app.supabase.com).
2. Open the **SQL Editor** tab in your Supabase dashboard.
3. Copy and run the complete database schema from [`supabase/schema.sql`](./supabase/schema.sql).
4. Verify that the following 3 tables were created under the `public` schema:
   - `profiles`
   - `credentials`
   - `password_generator_settings`
5. Verify that **Row Level Security (RLS)** is enabled on all tables with `auth.uid() = user_id` policies.
6. (Optional) Under **Authentication -> Providers**, configure **Google OAuth** if you wish to enable third-party Google sign-in.

---

## 3. GitHub Repository Setup

1. Create a new repository on GitHub: `passvault`.
2. Link and push your local repository:
```bash
git remote add origin https://github.com/<your-username>/passvault.git
git branch -M main
git push -u origin main
```
3. Ensure `.env` and `.env.local` files are NOT pushed (verified by `.gitignore`).

---

## 4. Vercel Production Deployment

1. Go to [Vercel Dashboard](https://vercel.com/new) and click **"Add New Project"**.
2. Import the `passvault` GitHub repository.
3. Configure the **Build & Development Settings**:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. Configure **Environment Variables** in Vercel:
   | Variable Name | Value Description | Scope |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://<your-project-ref>.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Project Anon/Public Key | Production, Preview, Development |
   | `ENCRYPTION_KEY` | 32-byte secret string for server AES-256-GCM | Production, Preview, Development (Server Only) |
5. Click **"Deploy"**.
6. Vercel will build and deploy the application, generating a live public URL (e.g. `https://passvault-app.vercel.app`).

---

## 5. Post-Deployment Verification Checklist

- [ ] Open the live production URL in desktop browser.
- [ ] Open the live production URL on mobile device.
- [ ] Register a new test account via `/signup`.
- [ ] Log in with the test account via `/login`.
- [ ] Create a new credential in `/vault/new` and save.
- [ ] Verify that password is encrypted (AES-256-GCM) and masked (`••••••••`).
- [ ] Test show/hide and 1-click clipboard copy.
- [ ] Test search and category filtering in `/vault` and `/search`.
- [ ] Test password generator in `/generator`.
- [ ] Log out and verify redirection to `/login` with protected routes guarded.
