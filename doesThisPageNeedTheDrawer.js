// Inject the HTML for the drawer
function injectDrawerHTML() {
  console.log("Injecting Drawer HTML");
  const drawerHTML = `
      <div id="myExtensionDrawer" class="myext-drawer-closed">
          <button id="myExtensionCloseButton" class="myext-close-btn">Close</button>
          <!-- Add more content for the drawer here -->
      </div>
  `;
  document.body.insertAdjacentHTML("beforeend", drawerHTML);
}

// Inject the CSS for the drawer
function injectDrawerStyles() {
  console.log("Injecting Drawer Styles");
  const styles = `
      <style>
          #myExtensionDrawer {
              height: 100%;
              position: fixed;
              z-index: 1000;
              top: 0;
              right: 0;
              background-color: white;
              overflow-x: hidden;
              transition: 0.5s;
              padding-top: 60px;
              border-left: 1px solid #ccc;
          }
          .myext-drawer-open {
              width: 250px; /* width when open */
          }
          .myext-drawer-closed {
              width: 0; /* width when closed */
          }
          #myExtensionCloseButton {
              position: absolute;
              top: 20px;
              right: 25px;
              font-size: 30px;
              border: none;
              background: none;
              cursor: pointer;
          }
      </style>
  `;
  document.head.insertAdjacentHTML("beforeend", styles);
}

// Setup drawer toggle behavior
function setupDrawerToggle() {
  console.log("Setting up Drawer Toggle");
  const closeButton = document.getElementById("myExtensionCloseButton");
  if (!closeButton) {
    console.error("Close button not found!");
    return;
  }
  closeButton.addEventListener("click", function () {
    const drawer = document.getElementById("myExtensionDrawer");
    console.log("REABILITY: Toggling drawer visibility");
    drawer.classList.toggle("myext-drawer-open");
    drawer.classList.toggle("myext-drawer-closed");
  });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("REABILITY: Received message:", message);
  if (message.action === "toggleDrawer") {
    const drawer = document.getElementById("myExtensionDrawer");
    console.log("REABILITY: Toggling drawer from message");
    drawer.classList.toggle("myext-drawer-open");
    drawer.classList.toggle("myext-drawer-closed");
  }
});

// Inject HTML and CSS into the webpage
injectDrawerHTML();
injectDrawerStyles();

// Setup the drawer toggle functionality
setupDrawerToggle();

// Check the current URL and automatically open the drawer if it matches
if (window.location.href.includes("linkedin.com/in/")) {
  console.log("REABILITY: URL check passed, opening drawer");
  const drawer = document.getElementById("myExtensionDrawer");
  drawer.classList.remove("myext-drawer-closed");
  drawer.classList.add("myext-drawer-open");
} else {
  console.log("REABILITY: URL does not match, keeping drawer closed");
}
