console.log("REABILITY: Starting drawer.js execution");

function waitForFunctionToBeDefined(functionName, timeout = 10000) {
  console.log(
    `REABILITY: Entering waitForFunctionToBeDefined for ${functionName} with timeout ${timeout}`
  );

  return new Promise((resolve, reject) => {
    const intervalTime = 100;
    let elapsedTime = 0;

    const interval = setInterval(() => {
      if (typeof window[functionName] === "function") {
        console.log(`REABILITY: ${functionName} is defined`);
        clearInterval(interval);
        resolve();
      } else if (elapsedTime >= timeout) {
        console.error(
          `REABILITY: Timeout: ${functionName} is not defined after ${timeout}ms`
        );
        clearInterval(interval);
        reject(
          new Error(
            `REABILITY: Timeout: ${functionName} is not defined after ${timeout}ms`
          )
        );
      }
      elapsedTime += intervalTime;
    }, intervalTime);
  });
}

function injectDrawer() {
  console.log("REABILITY: Entering injectDrawer");

  waitForFunctionToBeDefined("injectHTMLAndCSS")
    .then(() => {
      console.log("REABILITY: injectHTMLAndCSS is defined, injecting drawer");
      return injectHTMLAndCSS("drawer.html", "drawer.css", "body");
    })
    .then(() => {
      console.log(
        "REABILITY: Drawer HTML and CSS injected, setting up close button"
      );
      setupDrawerCloseButton();
    })
    .catch((error) => console.error("REABILITY: " + error.message));
}

function setupDrawerCloseButton() {
  console.log("REABILITY: Entering setupDrawerCloseButton");

  const closeButton = document.getElementById("reabilityDrawerCloseButton");
  if (closeButton) {
    console.log("REABILITY: Close button found, adding click event listener");
    closeButton.addEventListener("click", () => {
      console.log("REABILITY: Close button clicked");
      const drawer = document.getElementById("reabilityDrawer");
      if (drawer) {
        console.log("REABILITY: Drawer found, closing drawer");
        drawer.style.display = "none";
      } else {
        console.error("REABILITY: Drawer element not found");
      }
    });
  } else {
    console.error("REABILITY: Close button element not found");
  }

  console.log("REABILITY: Exiting setupDrawerCloseButton");
}

injectDrawer();

console.log("REABILITY: Exiting drawer.js execution");
