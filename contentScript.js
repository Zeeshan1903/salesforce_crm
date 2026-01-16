

console.log("CONTENT SCRIPT LOADED");

// ------------------- STATUS POPUP (shadow dom) -------------------

function showStatus(text) {
  let host = document.createElement("div");
  let shadow = host.attachShadow({ mode: "open" });

  shadow.innerHTML = `
    <style>
      .box {
        position: fixed;
        bottom: 15px;
        right: 15px;
        background: black;
        color: white;
        padding: 8px 10px;
        font-size: 12px;
        z-index: 999999;
        border-radius: 4px;
      }
    </style>
    <div class="box">${text}</div>
  `;

  document.body.appendChild(host);

  setTimeout(() => host.remove(), 2500);
}

// ------------------- OBJECT DETECTION -------------------

function detectObjectType() {
  let url = window.location.href.toLowerCase();

  if (url.includes("/lightning/r/lead/")) return "leads";
  if (url.includes("/lightning/r/contact/")) return "contacts";
  if (url.includes("/lightning/r/account/")) return "accounts";
  if (url.includes("/lightning/r/opportunity/")) return "opportunities";
  if (url.includes("/lightning/r/task/")) return "tasks";

  return null;
}

// ------------------- STORAGE -------------------

function saveRecords(type, records) {
  chrome.storage.local.get(["salesforce_data"], (res) => {
    let data = res.salesforce_data || {
      leads: [],
      contacts: [],
      accounts: [],
      opportunities: [],
      tasks: [],
      lastSync: Date.now()
    };

    let map = {};
    data[type].forEach(r => map[r.id] = r);
    records.forEach(r => map[r.id] = r);

    data[type] = Object.values(map);
    data.lastSync = Date.now();

    chrome.storage.local.set({ salesforce_data: data });
  });
}

// ------------------- EXTRACTION -------------------

function extractBasicRecord(type) {
  let title = document.querySelector("h1")?.innerText || "No title";

  return [{
    id: "id_" + Math.random().toString(36).slice(2),
    name: title,
    type: type,
    extractedAt: new Date().toISOString()
  }];
}

// ------------------- MESSAGE LISTENER -------------------

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "START_EXTRACTION") return;

  let objType = detectObjectType();

  if (!objType) {
    showStatus("Not on record page");
    return;
  }

  showStatus("Extracting " + objType);

  let records = extractBasicRecord(objType);
  saveRecords(objType, records);

  showStatus("Done extracting " + objType);
});
