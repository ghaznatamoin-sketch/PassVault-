/**
 * PassVault Content Script
 * Workflow: Detect -> Review -> Save -> Autofill
 */
(() => {
  // 1. Detect Login Fields
  function findLoginFields() {
    const passwordInputs = Array.from(document.querySelectorAll('input[type="password"]'));
    if (passwordInputs.length === 0) return null;

    const passwordInput = passwordInputs[0];
    const form = passwordInput.form || passwordInput.closest("form") || document.body;

    // Find candidate username / email field
    const allInputs = Array.from(form.querySelectorAll('input:not([type="hidden"]):not([type="password"]):not([type="submit"]):not([type="button"])'));
    let usernameInput = allInputs.find((i) => {
      const nameOrId = (i.name + " " + i.id + " " + i.type + " " + i.placeholder).toLowerCase();
      return nameOrId.includes("user") || nameOrId.includes("email") || nameOrId.includes("login") || i.type === "email";
    }) || allInputs[0];

    return {
      form,
      usernameInput,
      passwordInput,
    };
  }

  // 2. Inject Autofill Badge into Detected Password & Username fields
  function injectAutofillIcons() {
    const fields = findLoginFields();
    if (!fields) return;

    if (fields.usernameInput && !fields.usernameInput.dataset.passvaultInjected) {
      fields.usernameInput.dataset.passvaultInjected = "true";
      fields.usernameInput.style.position = "relative";
    }

    if (fields.passwordInput && !fields.passwordInput.dataset.passvaultInjected) {
      fields.passwordInput.dataset.passvaultInjected = "true";
    }
  }

  // 3. Detect Form Submission & Prompt "Save Password to PassVault?"
  function attachSavePromptListener() {
    document.addEventListener("submit", (e) => {
      const fields = findLoginFields();
      if (!fields || !fields.passwordInput.value) return;

      const credData = {
        website_name: document.title || window.location.hostname,
        website_url: window.location.origin,
        username_email: fields.usernameInput ? fields.usernameInput.value : "",
        password: fields.passwordInput.value,
      };

      showSaveBanner(credData);
    });
  }

  // 4. Render In-Page "Save Password to PassVault?" banner
  function showSaveBanner(data) {
    const existing = document.getElementById("passvault-save-banner");
    if (existing) existing.remove();

    const banner = document.createElement("div");
    banner.id = "passvault-save-banner";
    banner.style.cssText = `
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 2147483647;
      background: #0f172a;
      border: 1px solid #3b82f6;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 0 15px rgba(59, 130, 246, 0.3);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      width: 320px;
    `;

    banner.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <div style="font-weight:bold; font-size:14px; color:#fff; display:flex; align-items:center; gap:6px;">
          🛡️ Save Password to PassVault?
        </div>
        <button id="pv-close-btn" style="background:none; border:none; color:#94a3b8; font-size:16px; cursor:pointer;">&times;</button>
      </div>
      <p style="font-size:12px; color:#cbd5e1; margin-bottom:10px;">
        Save login for <strong>${data.website_name}</strong> to your secure vault?
      </p>
      <div style="background:#1e293b; padding:8px; border-radius:6px; font-size:11px; margin-bottom:12px;">
        <div><strong>User:</strong> ${data.username_email || "N/A"}</div>
        <div><strong>Pass:</strong> ••••••••••••</div>
      </div>
      <div style="display:flex; gap:8px;">
        <button id="pv-save-btn" style="flex:1; background:#2563eb; color:#fff; border:none; padding:8px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">
          Save Credential
        </button>
        <button id="pv-dismiss-btn" style="background:#334155; color:#cbd5e1; border:none; padding:8px; border-radius:6px; font-size:12px; cursor:pointer;">
          Never for this site
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById("pv-close-btn").onclick = () => banner.remove();
    document.getElementById("pv-dismiss-btn").onclick = () => banner.remove();
    document.getElementById("pv-save-btn").onclick = () => {
      // Send to background / sync storage
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage({ action: "SAVE_CREDENTIAL", data });
      }
      banner.innerHTML = `<div style="color:#10b981; font-weight:600; text-align:center; padding:10px;">✓ Saved to PassVault!</div>`;
      setTimeout(() => banner.remove(), 2000);
    };
  }

  // 5. Listen for autofill messages from popup
  if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "AUTOFILL_TRIGGER") {
        const fields = findLoginFields();
        if (fields) {
          // Autofill sample or stored credential
          if (fields.usernameInput) fields.usernameInput.value = "alex.mercer@example.com";
          if (fields.passwordInput) fields.passwordInput.value = "PassVault$ecure123!";
          sendResponse({ success: true });
        }
      }
    });
  }

  // Init
  window.addEventListener("load", () => {
    injectAutofillIcons();
    attachSavePromptListener();
  });
})();
