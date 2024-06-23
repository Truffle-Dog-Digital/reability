function setupScanButton() {
  const scanButton = document.getElementById("reabilityScanButton");
  if (scanButton) {
    scanButton.addEventListener("click", handleScanButtonClick);
  }
}

function handleScanButtonClick() {
  checkLemlistApiKey()
    .then((apiKey) => {
      if (!apiKey) {
        apiKey = prompt("Please enter your Lemlist API Key:");
        chrome.storage.local.set({ lemlist_api_key: apiKey }, () => {
          console.log("API key saved.");
          processContacts(apiKey);
        });
      } else {
        processContacts(apiKey);
      }
    })
    .catch((error) =>
      console.error("Error retrieving Lemlist API key:", error)
    );
}

function checkLemlistApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["lemlist_api_key"], (result) => {
      resolve(result.lemlist_api_key);
    });
  });
}

function processContacts(apiKey) {
  const contacts = document.querySelectorAll(
    "[data-test-id^='contacts-table-contact-name-']"
  );
  const linkedinUrls = [];

  contacts.forEach((contact) => {
    const checkbox = contact.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      const linkedinUrl = contact.querySelector('a[href*="linkedin.com"]');
      if (linkedinUrl) {
        linkedinUrls.push(linkedinUrl.href);
      }
    }
  });

  linkedinUrls.forEach((url) => {
    addContactToLemlist(apiKey, url);
  });
}

function addContactToLemlist(apiKey, linkedinUrl) {
  const apiUrl = "https://api.lemlist.com/api/contacts";
  const data = {
    email: "",
    linkedinUrl: linkedinUrl,
    tags: ["LI Outreach"],
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => console.log("Contact added:", result))
    .catch((error) => console.error("Error adding contact:", error));
}

function injectLushaContacts() {
  injectHTMLandCSS(
    "lusha-contacts.html",
    "lusha-contacts.css",
    "#reabilityDrawerContent"
  )
    .then(() => setupScanButton())
    .catch((error) => console.error(error));
}

injectLushaContacts();
