import "./styles.css";
import React, { useState, useEffect, useRef, useMemo } from "react";

// const decodedUrl = atob("aHR0cHM6Ly90bnM0bHBnbXppaXlwbnh4emVsNXNzNW55dTBuZnRvbC5sYW1iZGEtdXJsLnVzLWVhc3QtMS5vbi5hd3MvcmFtcC1jaGFsbGVuZ2UtaW5zdHJ1Y3Rpb25zLw==");
const challengeUrl =
  "https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge";

const useTypewriter = (text = "", speed = 100) => {
  const [index, setIndex] = useState(0);

  // use memo to remember the index so all characters are shown properly
  const displayText = useMemo(() => text?.slice(0, index), [text, index]);

  useEffect(() => {
    // make sure the text is valid
    if (text && index >= text.length) return;

    // typewriter effect to delay the characters
    const timeout = setTimeout(() => setIndex((i) => i + 1), speed);
    return () => clearTimeout(timeout);
  }, [index, text, speed]);

  return displayText;
};

const useFetchFlag = (url) => {
  const hasFetched = useRef(false);
  const [flag, setFlag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch the website once
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch(url)
      .then((res) => res.text())
      .then((htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        const chars = [];
        // the requirements for getting the valid character of the url
        const elements = doc.querySelectorAll(
          'section[data-id^="92"] article[data-class$="45"] div[data-tag*="78"] b.ref'
        );
        // collect the code to fetch the page
        elements.forEach((element) => {
          const val = element.getAttribute("value");
          chars.push(val);
        });

        const hiddenUrl = chars.join("");
        console.log("Hidden URL: ", hiddenUrl);

        return fetch(hiddenUrl);
      })
      .then((res) => res.text())
      .then((data) => {
        console.log("Captured Flag: ", data);
        // set the flag from the hidden url
        setFlag(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching flag: ", err);
        setLoading(false);
      });
  }, [url]);

  return { flag, loading };
};

function App() {
  const { flag, loading } = useFetchFlag(challengeUrl);
  const displayFlag = useTypewriter(flag, 500);

  // loading message while rendering
  if (loading) return <div className="App">Loading...</div>;

  return (
    <ul>
      {displayFlag.split("").map((char, idx) => (
        <li key={idx}>{char}</li>
      ))}
    </ul>
  );
}

export default App;
