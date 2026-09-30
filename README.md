# PassVault — Secure Password Manager

A secure, modern, and user-friendly digital solution for managing login credentials, generating strong passwords, autofilling logins via browser extension, and protecting account access with session lock security.

---

## 🎯 Phase 2 Status: COMPLETE

Phase 2 builds upon the approved PassVault foundation, implementing:
1. **Session Lock & Automatic Inactivity Logout**
2. **PassVault Browser Extension Package & Interactive Simulator**
3. **Subscription & Billing Model (30-Day Free Trial & Pro Plans)**
4. **Enhanced Navigation & Vault Controls**

---

## 🚀 Key Features Implemented in Phase 2

### 1. 🛡️ Session Security & Auto-Lock
- **Instant Vault Lock:** Immediate manual lock button in Sidebar, Topbar, and Settings.
- **Inactivity Auto-Lock:** Configurable timeout (1 min, 5 mins, 15 mins, 30 mins, 1 hour, or Never). Activity listener tracks mouse/keyboard/scroll events.
- **Lock Screen Overlay:** Secure modal requiring Master Password verification to unlock vault access or safely sign out.

### 2. 🧩 PassVault Browser Extension (Manifest V3)
- **Real Extension Codebase:** Located in `extension/` directory with `manifest.json`, `background.js` service worker, `content.js` content script, `popup.html`, and `popup.js`.
- **Login Field Detection:** Automatically detects `<input type="password">` and username/email fields on web pages.
- **"Save Password to PassVault?" Prompt:** Intercepts form submissions and offers a one-click banner to review and save login credentials.
- **Autofill Badges:** Provides one-click credential population into login fields.
- **In-App Extension Hub & Interactive Simulator (`/extension`):** Interactive live simulation of the full workflow:
  `Detect → Review → Save → Search → Autofill → Manage`

### 3. 💳 Subscription & Plan Management (`/subscription`)
- **30-Day Free Trial:** Full feature access initialized for all new accounts with a live trial countdown.
- **Transparent Plans:**
  - Free Trial: $0 / 30 days
  - Monthly Pro: $2.99 / month
  - Annual Pro: $29.99 / year (Save 16%, 2 Months Free)
- **Interactive Plan Switching:** Real state transitions with upgrade/downgrade confirmation and cancellation handling.
- *Notice:* Payment processor integration (Stripe / PayPal) is staged for production deployment; subscription tiers and status states are fully active locally.

---

## 🛠️ Complete Application Routes (17 Routes)

| Route | Description |
|---|---|
| `/` | Landing Page with Hero, Problem, Features, and Target Users |
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

## 💻 Local Development & Extension Testing

1. **Start the Web App:**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

2. **Load the Browser Extension in Chrome / Edge / Brave:**
   - Go to `chrome://extensions`
   - Enable **Developer Mode**
   - Click **Load unpacked**
   - Select the `extension/` folder in this repository.
