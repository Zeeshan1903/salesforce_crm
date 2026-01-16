// background service worker
// popup dont have tab so we must query active tab

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "EXTRACT_CURRENT") return;

  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs) => {
      if (!tabs || !tabs.length) return;

      chrome.tabs.sendMessage(tabs[0].id, {
        type: "START_EXTRACTION"
      });
    }
  );
});
