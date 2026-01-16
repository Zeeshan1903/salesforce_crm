// storage helper
// code little ugly but understandable

function getEmptyData() {
  return {
    leads: [],
    contacts: [],
    accounts: [],
    opportunities: [],
    tasks: [],
    lastSync: Date.now()
  };
}

function mergeById(oldArr, newArr) {
  let map = {};
  oldArr.forEach(r => map[r.id] = r);
  newArr.forEach(r => map[r.id] = r);
  return Object.values(map);
}

export function saveRecords(type, records) {
  chrome.storage.local.get(["salesforce_data"], (res) => {
    let data = res.salesforce_data || getEmptyData();
    data[type] = mergeById(data[type], records);
    data.lastSync = Date.now();

    chrome.storage.local.set({ salesforce_data: data });
  });
}
