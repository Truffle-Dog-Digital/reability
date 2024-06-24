function injectDrawer() {
  injectHTMLAndCSS("drawer.html", "drawer.css", "body")
    .then(() => {
      setupDrawerCloseButton();
    })
    .catch((error) => console.error(error));
}

function setupDrawerCloseButton() {
  const closeButton = document.getElementById("reabilityDrawerCloseButton");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      const drawer = document.getElementById("reabilityDrawer");
      if (drawer) {
        drawer.style.display = "none";
      }
    });
  }
}

injectDrawer();
