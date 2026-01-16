// popup logic
// simple and not optimized

const btn = document.getElementById("extractBtn");
const out = document.getElementById("output");

btn.onclick = () => {
  chrome.runtime.sendMessage({ type: "EXTRACT_CURRENT" });
};

function loadData() {
  chrome.storage.local.get(["salesforce_data"], (res) => {
    out.textContent = JSON.stringify(res.salesforce_data || {}, null, 2);
  });
}

loadData();

chrome.storage.onChanged.addListener(loadData);
