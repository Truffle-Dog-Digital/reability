console.log("REABILITY: main.js script loaded");

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("REABILITY: DOMContentLoaded event triggered");
  injectDrawer();
});

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

      // Open the drawer
      openDrawer();
    })
    .catch((error) =>
      console.error("REABILITY: Error fetching main.html:", error)
    );
}

// Function to open the drawer
function openDrawer() {
  console.log("REABILITY: Opening drawer");
  const drawer = document.getElementById("myExtensionDrawer");
  if (drawer) {
    drawer.classList.remove("myext-drawer-closed");
    drawer.classList.add("myext-drawer-open");
    console.log("REABILITY: Drawer opened successfully");
  } else {
    console.error("REABILITY: Drawer element not found");
  }
}

// Inject drawer HTML and CSS into the webpage on initial load
injectDrawer();
