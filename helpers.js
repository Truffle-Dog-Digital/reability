function injectHTMLAndCSS(htmlPath, cssPath, injectInto) {
  return new Promise((resolve, reject) => {
    // Fetch and inject CSS
    fetch(chrome.runtime.getURL(cssPath))
      .then((response) => response.text())
      .then((css) => {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
      })
      .catch((error) => reject(error));

    // Fetch and inject HTML
    fetch(chrome.runtime.getURL(htmlPath))
      .then((response) => response.text())
      .then((html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        if (injectInto) {
          const injectTarget = document.querySelector(injectInto);
          while (tempDiv.firstChild) {
            injectTarget.appendChild(tempDiv.firstChild);
          }
        } else {
          while (tempDiv.firstChild) {
            document.body.appendChild(tempDiv.firstChild);
          }
        }
        resolve();
      })
      .catch((error) => reject(error));
  });
}
