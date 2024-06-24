chrome.runtime.onInstalled.addListener(() => {
  console.log("REABILITY: Extension installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("REABILITY: Received message", request);
  if (request.action === "callLemList") {
    chrome.storage.local.get(["lemlist_api_key"], function (result) {
      const apiKey = result.lemlist_api_key;
      if (!apiKey) {
        console.log("REABILITY: API key not found in storage");
        sendResponse({ error: "API key not found in storage" });
        return;
      }

      console.log("REABILITY: API key found", apiKey);

      // Append the API key as a URL parameter named access_token
      const url = new URL(request.url);
      url.searchParams.append("access_token", apiKey);
      console.log("REABILITY: Fetch URL", url.toString());

      const options = {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request.body),
      };

      fetch(url.toString(), options)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log("REABILITY: Fetch successful", data);
          sendResponse({ data: data });
        })
        .catch((error) => {
          console.error("REABILITY: Fetch error", error);
          sendResponse({ error: error.message });
        });

      // Return true to indicate you will send a response asynchronously
      return true;
    });
  }
});
