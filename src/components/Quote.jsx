import React, { useEffect, useState, useRef } from "react";
import { SquareX } from "lucide-react";

// 🛡️ Use AllOrigins to proxy the ZenQuotes API - Note: This method works for dev/testing. Use a server-side solution for production.
const QUOTES_API_URL =
  "https://api.allorigins.win/get?url=https://zenquotes.io/api/random/";

const Quote = ({ onClose }) => {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const audioContextRef = useRef(null);
  const closeBufferRef = useRef(null);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const response = await fetch(QUOTES_API_URL);
      const data = await response.json();

      const parsed = JSON.parse(data.contents);
      setQuote(`${parsed[0].q} — ${parsed[0].a}`);
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const playCloseSound = () => {
    if (audioContextRef.current && closeBufferRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = closeBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    }
  };

  const handleClose = () => {
    playCloseSound();
    if (onClose) onClose();
  };

  useEffect(() => {
    fetchQuote();

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    // Load close sound
    fetch("/sounds/notebook-close-83836.mp3")
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        closeBufferRef.current = audioBuffer;
      })
      .catch((err) => {
        console.error("Error loading close sound:", err);
      });

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="card bg-base-300 border border-base-100 shadow-xl shadow-neutral-950/50 image-full w-96">
      {/* Close Button with Tooltip */}
      <button
        className="tooltip tooltip-right tooltip-primary absolute top-2 right-2 cursor-pointer text-red-500 hover:text-red-700 z-10"
        data-tip="Close"
        onClick={handleClose}
      >
        <SquareX className="w-6 h-6" />
      </button>

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
