function setupScanButton() {
  const scanButton = document.getElementById("reabilityScanButton");
  if (scanButton) {
    scanButton.addEventListener("click", handleScanButtonClick);
  }
}

function setupGrabButton() {
  const scanButton = document.getElementById("reabilityLushaListGrab");
  if (scanButton) {
    scanButton.addEventListener("click", handleLushaListGrabClick);
  }
}

// New function handleLushaListGrabClick
async function handleLushaListGrabClick() {
  console.log("REABILITY: Grab Contacts button clicked");
  const linkedinUrls = await getLushaContacts();
  const lineDelimitedUrls = linkedinUrls.join("\n");
  console.log(lineDelimitedUrls);
}

// New function to get API key
async function getApiKey() {
  let apiKey = await getLocalStorage("lemlist_api_key");
  if (!apiKey) {
    apiKey = prompt("Please enter your Lemlist API Key:");
    if (apiKey) {
      await setLocalStorage("lemlist_api_key", apiKey);
      console.log("REABILITY: API key saved.");
    }
  }
  return apiKey;
}

// Refactored handleScanButtonClick
async function handleScanButtonClick() {
  console.log("REABILITY: Scan button clicked");
  const apiKey = await getApiKey();
  if (apiKey) {
    console.log("REABILITY: API key available, processing contacts");
    const linkedinUrls = await getLushaContacts();
    await createLemlistContacts(linkedinUrls, apiKey);
  }
}

// Renamed function to get selected Lusha contacts
async function getLushaContacts() {
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
  return linkedinUrls;
}

// Function to create Lemlist contacts
async function createLemlistContacts(urls, apiKey) {
  try {
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          action: "callLemListBatch",
          method: "POST",
          url: `https://api.lemlist.com/api/campaigns/cam_Dz9yzoMjNz7NLA26i/leads`,
          api_key: apiKey,
          urls: urls,
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
    if (response && response.message) {
      console.log("REABILITY:", response.message);
    } else if (response && response.error) {
      console.error("REABILITY: Error adding contacts:", response.error);
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
