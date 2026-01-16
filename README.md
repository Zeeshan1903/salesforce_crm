# Salesforce CRM Data Extractor

A Chrome extension for extracting Salesforce CRM data directly from the UI using DOM scraping.  
This project does **not** use Salesforce APIs and works entirely on the client side.

---

## 👤 Author

- **Name:** Zeeshan  
- **College:** Indian Institute of Technology, Palakkad (IIT PKD)  
- **GitHub:** https://github.com/Zeeshan1903  

---

## 📖 Project Overview

Salesforce CRM Data Extractor is a Chrome extension developed to extract useful CRM data such as:

- Accounts  
- Leads  
- Contacts  
- Opportunities  
- Tasks  

The extension works by reading and scraping data directly from Salesforce Lightning pages using the DOM structure.

This approach avoids:
- Salesforce REST APIs
- Authentication tokens
- API rate limits

The extracted data is stored locally in the browser and can be viewed anytime using the extension popup.

---

## ⚙️ How It Works

1. **Content Script**
   - Runs on Salesforce Lightning pages
   - Detects the current object type from the URL
   - Extracts field values by reading the DOM
   - Shows a small status popup using Shadow DOM

2. **Background Service Worker**
   - Acts as a bridge between popup and content script
   - Sends extraction commands to the active tab

3. **Chrome Storage**
   - Stores extracted data using `chrome.storage.local`
   - Data persists even after browser reload

4. **Popup UI**
   - Allows user to trigger extraction
   - Displays stored CRM data in JSON format

---

## 🧠 Key Features

- DOM-based extraction (no APIs)
- Works on Salesforce Lightning UI
- Shadow DOM status indicator
- Persistent local storage
- Simple popup dashboard

---

## 🛠️ How to Install the Extension in Chrome

Follow these steps carefully:

1. Clone or download this repository:
2. Open Google Chrome and go to: `chrome://extensions`
3. Enable Developer mode (top-right corner)
4. Click Load unpacked
5. Select the project folder (the folder containing `manifest.json`)
6. The extension will now appear in your extensions list

## How to Use
1. Log in to Salesforce
2. Click the extension icon
3. Click Extract Current Object
4. A small black popup appears confirming extraction
5. Open the popup again to view extracted data


## 🚀 Future Improvements

1. Export data as CSV
2. Better popup UI (cards & tabs)
3. Support list view extraction
4. Error handling and logging improvements