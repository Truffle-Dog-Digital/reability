import React, { useState, useEffect, Suspense, lazy } from "react";
import ReactDOM from "react-dom";

const MyDrawer = lazy(() => import("./components/Drawer"));

const App = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleUrlChange = () => {
      console.log("URL changed:", window.location.href); // Debugging line
      if (
        window.location.href.includes("lusha.com/prospecting/contacts") ||
        window.location.href.includes("linkedin.com")
      ) {
        setOpen(true);
      }
    };

    window.addEventListener("load", handleUrlChange);
    return () => window.removeEventListener("load", handleUrlChange);
  }, []);

  const handleSend = () => {
    const selectedCheckboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    const ids = Array.from(selectedCheckboxes).map((cb) =>
      cb.getAttribute("data-linkedin-id")
    );
    pushToLemList(ids);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyDrawer
        open={open}
        onClose={() => setOpen(false)}
        onSend={handleSend}
      />
    </Suspense>
  );
};

const pushToLemList = (ids) => {
  const apiKey = process.env.LEMLIST_API_KEY;
  const url = "https://api.lemlist.com/api/contacts";

  ids.forEach((id) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ linkedin_id: id }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Success:", data))
      .catch((error) => console.error("Error:", error));
  });
};

ReactDOM.render(<App />, document.getElementById("root"));
