console.log("REABILITY: main.js script loaded");

// Directly call injectDrawer function
injectDrawer();

// Function to inject the drawer HTML and CSS from main.html
function injectDrawer() {
  console.log("REABILITY: Injecting Drawer from main.html");

  const url = chrome.runtime.getURL("main.html");
  console.log("REABILITY: Fetching from URL:", url);

  fetch(url)
    .then((response) => {
      console.log("REABILITY: Fetch response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = data;

      // Append the drawer HTML and dialog to the body
      const drawerElement = tempDiv.querySelector("#myExtensionDrawer");
      const dialogElement = tempDiv.querySelector("#dialog");

      if (drawerElement) {
        document.body.appendChild(drawerElement);
        console.log("REABILITY: Drawer HTML injected into the body");
      } else {
        console.error("REABILITY: Drawer HTML not found in main.html");
      }

      if (dialogElement) {
        document.body.appendChild(dialogElement);
        console.log("REABILITY: Dialog HTML injected into the body");
      } else {
        console.error("REABILITY: Dialog HTML not found in main.html");
      }

      // Append the styles to the head
      const styleElement = tempDiv.querySelector("style");
      if (styleElement) {
        document.head.appendChild(styleElement);
        console.log("REABILITY: Drawer CSS injected into the head");
      } else {
        console.error("REABILITY: Drawer CSS not found in main.html");
      }

      // Set up the close button and scan button
      setupDrawerCloseButton();
      setupScanButton();
    })
    .catch((error) => {
      console.error("REABILITY: Error fetching main.html:", error);
    });
}

// Setup drawer close button behavior
function setupDrawerCloseButton() {
  console.log("REABILITY: Setting up Drawer Close Button");
  const closeButton = document.getElementById("myExtensionCloseButton");
  if (!closeButton) {
    console.error("REABILITY: Close button not found!");
    return;
  }
  closeButton.addEventListener("click", function () {
    const drawer = document.getElementById("myExtensionDrawer");
    console.log("REABILITY: Closing drawer");
    drawer.style.display = "none";
  });
}

// Setup scan button behavior
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
