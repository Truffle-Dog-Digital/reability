function injectHTMLandCSS(htmlFile, cssFile, targetElementId) {
  return new Promise((resolve, reject) => {
    const url = chrome.runtime.getURL(htmlFile);
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = data;

        // Append CSS if provided
        if (cssFile) {
          const cssURL = chrome.runtime.getURL(cssFile);
          const linkElement = document.createElement("link");
          linkElement.rel = "stylesheet";
          linkElement.href = cssURL;
          document.head.appendChild(linkElement);
        }

        // Append HTML to target element
        const targetElement = document.querySelector(targetElementId);
        if (targetElement) {
          while (tempDiv.firstChild) {
            targetElement.appendChild(tempDiv.firstChild);
          }
          resolve();
        } else {
          reject(`Target element with ID ${targetElementId} not found.`);
        }
      })
      .catch((error) => {
        reject(`Error fetching ${htmlFile}: ${error}`);
      });
  });
}
