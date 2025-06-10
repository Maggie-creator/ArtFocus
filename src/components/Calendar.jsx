import React, { useEffect, useRef } from "react";
import { SquareX } from "lucide-react";
import "cally"; // Import the calendar web component

const Calendar = ({ onClose }) => {
  const audioContextRef = useRef(null);
  const closeSoundBufferRef = useRef(null);

  useEffect(() => {
    import("cally");

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = ctx;

    fetch("/sounds/notebook-close-83836.mp3")
      .then((res) => res.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        closeSoundBufferRef.current = decoded;
      })
      .catch(console.error);

    return () => ctx.close();
  }, []);

  const playCloseSound = () => {
    if (audioContextRef.current && closeSoundBufferRef.current) {
      const src = audioContextRef.current.createBufferSource();
      src.buffer = closeSoundBufferRef.current;
      src.connect(audioContextRef.current.destination);
      src.start();
    }
  };

  return (
    <div className="card card-border bg-base-100 w-96 shadow-xl shadow-neutral-950/50 text-base-content p-4 items-center text-center">
      <div className="absolute top-0 right-0 m-2">
        <div className="tooltip tooltip-right tooltip-primary" data-tip="Close">
          <button
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => {
              playCloseSound();
              if (onClose) onClose(); // Optional: if close is provided
            }}
            title="Close Calendar"
          >
            <SquareX className="w-6 h-6" />
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-4 text-center permanent-marker p-4">
        Calendar
      </h1>

      <calendar-date className="cally bg-base-100 w-94">
        <svg
          aria-label="Previous"
          className="fill-current size-4"
          slot="previous"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>

        <svg
          aria-label="Next"
          className="fill-current size-4"
          slot="next"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>

        <calendar-month></calendar-month>
      </calendar-date>
    </div>
  );
};

export default Calendar;
