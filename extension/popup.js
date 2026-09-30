// PassVault Extension Popup Logic
document.addEventListener("DOMContentLoaded", async () => {
  const tabHostnameEl = document.getElementById("tab-hostname");
  const btnAutofill = document.getElementById("btn-autofill");
  const btnQuickGen = document.getElementById("btn-quick-gen");
  const btnAddAccount = document.getElementById("btn-add-account");

  // Query active tab
  if (typeof chrome !== "undefined" && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        try {
          const url = new URL(tabs[0].url);
          tabHostnameEl.textContent = url.hostname || "Active Website";
        } catch {
          tabHostnameEl.textContent = "Current Tab";
        }
      }
    });
  } else {
    tabHostnameEl.textContent = "passvault.local";
  }

  // Autofill button click
  btnAutofill.addEventListener("click", () => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "AUTOFILL_TRIGGER" });
        }
      });
    }
  });

  // Quick Generate
  btnQuickGen.addEventListener("click", () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    navigator.clipboard.writeText(pass);
    btnQuickGen.textContent = "✓ Copied to Clipboard!";
    setTimeout(() => {
      btnQuickGen.textContent = "🎲 Generate Password";
    }, 2000);
  });

  // Add Account link
  btnAddAccount.addEventListener("click", () => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.create({ url: "http://localhost:3000/vault/new" });
    } else {
      window.open("http://localhost:3000/vault/new", "_blank");
    }
  });
});
