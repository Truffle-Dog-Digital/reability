function setupScanButton() {
  const scanButton = document.getElementById("reabilityScanButton");
  if (scanButton) {
    scanButton.addEventListener("click", handleScanButtonClick);
  }
}

async function handleScanButtonClick() {
  console.log("REABILITY: Scan button clicked");
  let apiKey = await getLocalStorage("lemlist_api_key");
  if (!apiKey) {
    apiKey = prompt("Please enter your Lemlist API Key:");
    if (apiKey) {
      await setLocalStorage("lemlist_api_key", apiKey);
      console.log("REABILITY: API key saved.");
    }
  }

  if (apiKey) {
    console.log("REABILITY: API key available, processing contacts");
    processContacts(apiKey);
  }
}

async function processContacts(apiKey) {
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

  console.log("REABILITY: Found LinkedIn URLs", linkedinUrls);

  linkedinUrls.forEach((url) => {
    addContactToLemlist(apiKey, url);
  });
}

async function addContactToLemlist(apiKey, linkedinUrl) {
  const apiUrl = `https://api.lemlist.com/api/campaigns/cam_Dz9yzoMjNz7NLA26i/leads`;
  const body = { linkedinUrl: linkedinUrl };

  console.log("REABILITY: URL: ", apiUrl);
  console.log("REABILITY: Body: ", body);

  try {
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          action: "callLemList",
          method: "POST",
          url: apiUrl,
          body: body,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        }
      );
    });

    console.log("REABILITY: Response received", response);
    if (response) {
      if (response.error) {
        console.error("REABILITY: Error adding contact:", response.error);
      } else if (response.data) {
        console.log("REABILITY: Contact added:", response.data);
      } else {
        console.error("REABILITY: Unexpected response format", response);
      }
    } else {
      console.error("REABILITY: No response received");
    }
  } catch (error) {
    console.error("REABILITY: Error during request:", error.message);
  }
}

injectHTMLAndCSS(
  "lusha-contacts.html",
  "lusha-contacts.css",
  "#reabilityDrawerContent"
)
  .then(() => {
    setupScanButton();
  })
  .catch((error) => {
    console.error(
      "REABILITY: Error injecting Lusha Contacts HTML and CSS:",
      error
    );
  });
