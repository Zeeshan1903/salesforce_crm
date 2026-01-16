console.log("CONTENT SCRIPT LOADED");

// =================== SHADOW DOM STATUS ===================

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

// =================== OBJECT DETECTION ===================

function detectObjectType() {
  let url = location.href.toLowerCase();

  if (url.includes("/lightning/r/lead/")) return "leads";
  if (url.includes("/lightning/r/contact/")) return "contacts";
  if (url.includes("/lightning/r/account/")) return "accounts";
  if (url.includes("/lightning/r/opportunity/")) return "opportunities";
  if (url.includes("/lightning/r/task/")) return "tasks";

  return null;
}

// =================== STORAGE ===================

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

// =================== FIELD BY LABEL (KEY PART) ===================

function getFieldValue(labelText) {
  let spans = [...document.querySelectorAll("span")];
  let label = spans.find(s => s.innerText.trim() === labelText);
  if (!label) return null;

  let container = label.closest("records-record-layout-item");
  if (!container) return null;

  let valueEl = container.querySelector(
    "lightning-formatted-text, lightning-formatted-number, a"
  );

  return valueEl ? valueEl.innerText.trim() : null;
}

// =================== EXTRACTION PER OBJECT ===================

function extractAccount() {
  return [{
    id: location.href,
    name: getFieldValue("Account Name"),
    website: getFieldValue("Website"),
    phone: getFieldValue("Phone"),
    industry: getFieldValue("Industry"),
    type: getFieldValue("Type"),
    owner: getFieldValue("Account Owner"),
    revenue: getFieldValue("Annual Revenue")
  }];
}

function extractLead() {
  return [{
    id: location.href,
    name: getFieldValue("Name"),
    company: getFieldValue("Company"),
    email: getFieldValue("Email"),
    phone: getFieldValue("Phone"),
    source: getFieldValue("Lead Source"),
    status: getFieldValue("Lead Status"),
    owner: getFieldValue("Lead Owner")
  }];
}

function extractOpportunity() {
  return [{
    id: location.href,
    name: getFieldValue("Opportunity Name"),
    amount: getFieldValue("Amount"),
    stage: getFieldValue("Stage"),
    probability: getFieldValue("Probability (%)"),
    closeDate: getFieldValue("Close Date"),
    forecast: getFieldValue("Forecast Category"),
    owner: getFieldValue("Opportunity Owner"),
    account: getFieldValue("Account Name")
  }];
}

function extractTask() {
  return [{
    id: location.href,
    subject: getFieldValue("Subject"),
    due: getFieldValue("Due Date"),
    status: getFieldValue("Status"),
    priority: getFieldValue("Priority"),
    relatedTo: getFieldValue("Related To"),
    assignee: getFieldValue("Assigned To")
  }];
}

// =================== MESSAGE LISTENER ===================

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "START_EXTRACTION") return;

  let objType = detectObjectType();
  if (!objType) {
    showStatus("Not on record page");
    return;
  }

  showStatus("Extracting " + objType);

  let records = [];
  if (objType === "accounts") records = extractAccount();
  if (objType === "leads") records = extractLead();
  if (objType === "opportunities") records = extractOpportunity();
  if (objType === "tasks") records = extractTask();

  if (!records.length) {
    showStatus("Nothing extracted");
    return;
  }

  saveRecords(objType, records);
  showStatus("Done extracting " + objType);
});
