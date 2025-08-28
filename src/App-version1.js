import React, { useState, useEffect } from "react";

function App() {
  const [displayed, setDisplayed] = useState([]); // characters displayed so far
  const [flag, setFlag] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://example.com/page-with-hidden-url")
      .then((res) => res.text())
      .then((htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        // the requirements for getting the valid character of the url
        const chars = [];
        const elements = doc.querySelectorAll(
          'section[data-id^="92"] article[data-class$="45"] div[data-tag*="78"] b.ref'
        );
        elements.forEach((el) => {
          const val = el.getAttribute("value");
          if (val) chars.push(val);
        });
        // collect the code to fetch the page
        const hiddenUrl = chars.join("");
        console.log("Hidden URL:", hiddenUrl);

        return fetch(hiddenUrl);
      })
      .then((res) => res.text())
      .then((flagText) => {
        setFlag(flagText); // store flag
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && flag) {
      let i = 0;
      
      // typewriter effect to delay the characters
      const typeChar = () => {
        setDisplay((prev) => [...prev, flag[index]]);
        index++;
        if (index < flag.length) {
          setTimeout(typeChar, 500);
        }
      };

      typeChar();
    }
  }, [loading, flag]);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {displayed.map((char, idx) => (
        <li key={idx}>{char}</li>
      ))}
    </ul>
  );
}

export default App;
