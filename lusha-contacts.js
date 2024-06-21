console.log("REABILITY: Lusha Contacts script loaded");

function injectLushaContacts() {
  const url = chrome.runtime.getURL("lusha-contacts.html");
  console.log(`REABILITY: Fetching Lusha Contacts HTML from ${url}`);

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = data;

      const styleElement = tempDiv.querySelector("style");

      if (tempDiv) {
        const drawerContent = document.querySelector(".drawer-content");
        if (drawerContent) {
          // Append all child nodes of tempDiv to drawerContent
          while (tempDiv.firstChild) {
            drawerContent.appendChild(tempDiv.firstChild);
          }
          console.log(
            "REABILITY: Lusha Contacts HTML injected into the drawer"
          );
        } else {
          console.error("REABILITY: Drawer content area not found.");
        }
      } else {
        console.error(
          "REABILITY: Lusha Contacts HTML not found in lusha-contacts.html"
        );
      }

      if (styleElement) {
        document.head.appendChild(styleElement);
        console.log("REABILITY: Lusha Contacts CSS injected into the head");
      } else {
        console.error(
          "REABILITY: Lusha Contacts CSS not found in lusha-contacts.html"
        );
      }

      setupScanButton();
    })
    .catch((error) => {
      console.error("REABILITY: Error fetching lusha-contacts.html:", error);
    });
}

function setupScanButton() {
  console.log("REABILITY: Setting up Scan Button");
  const scanButton = document.getElementById("scanButton");
  if (!scanButton) {
    console.error("REABILITY: Scan button not found!");
    return;
  }
  scanButton.addEventListener("click", function () {
    console.log("REABILITY: Scan button clicked");
    const dialog = document.getElementById("dialog");
    const urlList = document.getElementById("urlList");
    urlList.innerHTML = ""; // Clear previous results

    const contacts = document.querySelectorAll(
      "[data-test-id^='contacts-table-contact-name-']"
    );
    console.log(`REABILITY: Found ${contacts.length} contacts`);

    contacts.forEach((contact) => {
      const checkbox = contact.querySelector('input[type="checkbox"]');
      console.log(`REABILITY: Found checkbox: ${checkbox ? "yes" : "no"}`);
      if (checkbox && checkbox.checked) {
        console.log("REABILITY: Checkbox is checked");
        const linkedinUrl = contact.querySelector('a[href*="linkedin.com"]');
        console.log(
          `REABILITY: Found LinkedIn URL: ${
            linkedinUrl ? linkedinUrl.href : "no"
          }`
        );
        if (linkedinUrl) {
          const listItem = document.createElement("li");
          listItem.textContent = linkedinUrl.href;
          urlList.appendChild(listItem);
        }
      }
    });

    dialog.style.display = "block";
  });

  const dialogCloseButton = document.getElementById("dialogCloseButton");
  if (!dialogCloseButton) {
    console.error("REABILITY: Dialog close button not found!");
    return;
  }
  dialogCloseButton.addEventListener("click", function () {
    const dialog = document.getElementById("dialog");
    dialog.style.display = "none";
  });
}

// Wait for the drawer to be ready before injecting Lusha contacts
function waitForDrawer() {
  const drawerContent = document.querySelector(".drawer-content");
  if (drawerContent) {
    injectLushaContacts();
  } else {
    console.log("REABILITY: Waiting for drawer to be ready...");
    setTimeout(waitForDrawer, 100); // Retry after 100ms
  }
}

waitForDrawer();
