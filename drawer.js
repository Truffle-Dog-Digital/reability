console.log("REABILITY: drawer.js script loaded");

function injectDrawer() {
  console.log("REABILITY: Injecting Drawer from drawer.html");

  return new Promise((resolve, reject) => {
    const url = chrome.runtime.getURL("drawer.html");
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

        const drawerElement = tempDiv.querySelector("#myExtensionDrawer");

        if (drawerElement) {
          document.body.appendChild(drawerElement);
          console.log("REABILITY: Drawer HTML injected into the body");
        } else {
          console.error("REABILITY: Drawer HTML not found in drawer.html");
          reject("Drawer HTML not found");
        }

        const styleElement = tempDiv.querySelector("style");
        if (styleElement) {
          document.head.appendChild(styleElement);
          console.log("REABILITY: Drawer CSS injected into the head");
        } else {
          console.error("REABILITY: Drawer CSS not found in drawer.html");
          reject("Drawer CSS not found");
        }

        setupDrawerCloseButton();

        resolve();
      })
      .catch((error) => {
        console.error("REABILITY: Error fetching drawer.html:", error);
        reject(error);
      });
  });
}

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

// Immediately invoke the function to inject the drawer
injectDrawer();
