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

      // Append the drawer HTML to the body
      const drawerElement = tempDiv.querySelector("#myExtensionDrawer");
      if (drawerElement) {
        document.body.appendChild(drawerElement);
        console.log("REABILITY: Drawer HTML injected into the body");
      } else {
        console.error("REABILITY: Drawer HTML not found in main.html");
      }

      // Append the styles to the head
      const styleElement = tempDiv.querySelector("style");
      if (styleElement) {
        document.head.appendChild(styleElement);
        console.log("REABILITY: Drawer CSS injected into the head");
      } else {
        console.error("REABILITY: Drawer CSS not found in main.html");
      }

      // Set up the close button
      setupDrawerCloseButton();
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
