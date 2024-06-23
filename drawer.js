function injectDrawer() {
  injectHTMLandCSS("drawer.html", "drawer.css", "body")
    .then(() => setupDrawerCloseButton())
    .catch((error) => console.error(error));
}

function setupDrawerCloseButton() {
  const closeButton = document.getElementById("reabilityDrawerCloseButton");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      const drawer = document.getElementById("reabilityDrawer");
      drawer.style.display = "none";
    });
  }
}

injectDrawer();
