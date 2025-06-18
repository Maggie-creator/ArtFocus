import React, { useEffect, useState, useRef } from "react";
import { SquareX } from "lucide-react";

const QUOTES_API_URL =
  "https://api.allorigins.win/get?url=https://zenquotes.io/api/random/";

const Quote = ({ onClose }) => {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [visible, setVisible] = useState(true);
  const closeSoundRef = useRef(null);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const response = await fetch(QUOTES_API_URL);
      if (!response.ok) {
        // Log specific HTTP error status
        console.error(`Error fetching quote: HTTP status ${response.status}`, await response.text());
        setQuote("Failed to fetch quote. Please try again later."); // User-facing message
        return; // Exit after handling error
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Error parsing main JSON response for quote:", parseError);
        setQuote("Failed to process quote data. Please try again later.");
        return;
      }

      if (!data.contents) {
          console.error("Error fetching quote: 'contents' field missing in API response.", data);
          setQuote("Failed to process quote data (missing contents). Please try again later.");
          return;
      }

      let parsed;
      try {
        parsed = JSON.parse(data.contents);
      } catch (contentParseError) {
        console.error("Error parsing 'contents' JSON for quote:", contentParseError, "Raw contents:", data.contents);
        setQuote("Failed to process quote content. Please try again later.");
        return;
      }

      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].q && parsed[0].a) {
        setQuote(`${parsed[0].q} — ${parsed[0].a}`);
      } else {
        console.error("Error fetching quote: Parsed content is not in the expected format.", parsed);
        setQuote("Received quote data in an unexpected format. Please try again later.");
      }

    } catch (error) { // Catch network errors or other unexpected issues
      console.error("Network or unexpected error fetching quote:", error);
      setQuote("Something went wrong. Please try again later."); // Generic fallback
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (closeSoundRef.current) {
      closeSoundRef.current.currentTime = 0;
      closeSoundRef.current.play().catch(error => console.error("Error playing Quote close sound:", error));
    }
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 150);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`card bg-base-300 border border-base-100 shadow-xl shadow-neutral-950/50 image-full w-96 relative transition-opacity duration-150 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Close Button with Tooltip */}
      <button
        className="tooltip tooltip-right tooltip-primary absolute top-2 right-2 cursor-pointer text-red-500 hover:text-red-700 z-10"
        data-tip="Close"
        onClick={handleClose}
        aria-label="Close Quote"
      >
        <SquareX className="w-6 h-6" />
      </button>

      {/* Close Sound */}
      <audio
        ref={closeSoundRef}
        src="/sounds/notebook-close-83836.mp3"
        preload="auto"
      />

      <figure>
        <img
          src="https://cdnb.artstation.com/p/assets/images/images/052/313/339/4k/sebastian-luca-daily-037-2.jpg?1659477220"
          alt="Sebastian Luca"
        />
      </figure>

      <div className="card-body items-center justify-center text-center">
        {loading ? (
          <h2 className="text-xl">Loading...</h2>
        ) : (
          <h2 className="text-2xl carattere-regular">{quote}</h2>
        )}
      </div>
    </div>
  );
};

export default Quote;
