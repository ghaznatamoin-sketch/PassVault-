# PassVault Browser Extension (Manifest V3)

This directory contains the real Chrome, Microsoft Edge, Brave, and Firefox-compatible **PassVault Browser Extension**.

## Features Implemented in Phase 2
1. **Login Field Detection:** Automatically discovers `<input type="password">` and username/email fields on active web pages.
2. **"Save Password to PassVault?" Prompt:** Intercepts form submissions and offers a one-click prompt to review and save login credentials.
3. **Autofill Capabilities:** Injects and triggers automatic completion of saved credentials.
4. **Popup Utility:** One-click password generator, quick vault search, and quick access link to the web vault.

---

## How to Load and Test in Browser

### In Google Chrome / Brave / Microsoft Edge:
1. Open your browser and navigate to `chrome://extensions` (or `edge://extensions` in Edge / `brave://extensions` in Brave).
2. Enable **Developer Mode** using the toggle switch in the top-right corner.
3. Click **Load unpacked**.
4. Select the `extension/` directory inside this project folder:
   `c:\Users\H A Computer\Desktop\PassVault — Secure Password Manager\extension`
5. The PassVault extension icon will appear in your browser toolbar!

---

## Integration with PassVault Web Vault
- The extension communicates with local browser storage and syncs with PassVault web application sessions.
- In-app simulator available at [http://localhost:3000/extension](http://localhost:3000/extension).
