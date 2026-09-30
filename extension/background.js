// PassVault Service Worker (Background Script)
chrome.runtime.onInstalled.addListener(() => {
  console.log("PassVault Extension installed successfully.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "SAVE_CREDENTIAL") {
    console.log("Saving credential from content script:", message.data);
    // Store in chrome.storage.local
    chrome.storage.local.get({ credentials: [] }, (result) => {
      const creds = result.credentials;
      creds.push({
        id: "ext_" + Date.now(),
        ...message.data,
        saved_at: new Date().toISOString()
      });
      chrome.storage.local.set({ credentials: creds }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});
