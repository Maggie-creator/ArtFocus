import React, { useState, useRef } from "react"; // Removed unused useEffect
import { Calendar, Clock, SquareX } from "lucide-react";
import { DateTime } from "luxon";

const allTimeZones = Intl.supportedValuesOf("timeZone");

const TimeZoneConverter = ({ onClose, isSoundOn }) => { // Added isSoundOn to props
  const [convertFromZone, setConvertFromZone] = useState("");
  const [convertToZone, setConvertToZone] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [convertedOutput, setConvertedOutput] = useState("");

  const closeSoundRef = useRef(null);
  const clickSoundRef = useRef(null);

  const [isClosing, setIsClosing] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleConvert = () => {
    if (isSoundOn && clickSoundRef.current) { // Added isSoundOn check
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(error => console.error("Error playing TimeZoneConverter click sound:", error));
    }

    if (!inputDate || !inputTime || !convertFromZone || !convertToZone) {
      setConvertedOutput("Please, fill in all fields before converting.");
      return;
    }

    try {
      const dateTimeStr = `${inputDate}T${inputTime}`;

      const fromDateTime = DateTime.fromISO(dateTimeStr, {
        zone: convertFromZone,
      });

      if (!fromDateTime.isValid) {
        setConvertedOutput("Invalid date/time or time zone.");
        return;
      }

      const toDateTime = fromDateTime.setZone(convertToZone);

      setConvertedOutput(
        `From (${convertFromZone}): ${fromDateTime.toFormat(
          "cccc, dd LLL yyyy, hh:mm a"
        )}\n` +
          `To (${convertToZone}): ${toDateTime.toFormat(
            "cccc, dd LLL yyyy, hh:mm a"
          )}`
      );
    } catch {
      setConvertedOutput("Conversion failed. Check your input.");
    }
  };

  const handleClose = () => {
    if (isSoundOn && closeSoundRef.current) { // Added isSoundOn check
      closeSoundRef.current.currentTime = 0;
      closeSoundRef.current.play().catch(error => console.error("Error playing TimeZoneConverter close sound:", error));
    }
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 150);
  };

  if (!visible) return null;

  return (
    <div
      className={`card card-border bg-base-100 w-96 p-4 relative transition-opacity duration-150 z-[100]
        ${isClosing ? "opacity-0" : "opacity-100"}
      `}
      style={{ willChange: "opacity", transition: "opacity 150ms ease" }}
    >
      {/* Close Button */}
      <div className="absolute top-0 right-0 m-2 z-[1050]">
        <div
          className="tooltip tooltip-right tooltip-primary z-[1050] relative"
          data-tip="Close"
        >
          <button
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={handleClose}
            aria-label="Close Time Zone Converter"
          >
            <SquareX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sounds */}
      <audio
        ref={closeSoundRef}
        src="/sounds/notebook-close-83836.mp3"
        preload="auto"
      />
      <audio
        ref={clickSoundRef}
        src="/sounds/mouse-click-sound.mp3"
        preload="auto"
      />

      <h1 className="text-2xl font-semibold mb-4 text-center permanent-marker p-4">
        Time Zone Converter
      </h1>

      <div className="flex gap-2 mb-4 relative">
        <div className="relative w-1/2">
          <label htmlFor="input-date" className="sr-only">Date</label>
          <input
            type="date"
            id="input-date"
            className="input input-bordered border-primary w-full"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
          />
        </div>

        <div className="relative w-1/2">
          <label htmlFor="input-time" className="sr-only">Time</label>
          <input
            type="time"
            id="input-time"
            className="input input-bordered border-primary w-full"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleConvert();
              }
            }}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="w-1/2">
          <label htmlFor="from-zone" className="sr-only">From Time Zone</label>
          <select
            id="from-zone"
            className="select border-primary w-full rounded" // Changed w-1/2 to w-full as parent is w-1/2
            value={convertFromZone}
            onChange={(e) => setConvertFromZone(e.target.value)}
          >
            <option value="">From Time Zone</option>
            {allTimeZones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/2">
          <label htmlFor="to-zone" className="sr-only">To Time Zone</label>
          <select
            id="to-zone"
            className="select border-primary w-full rounded" // Changed w-1/2 to w-full
            value={convertToZone}
            onChange={(e) => setConvertToZone(e.target.value)}
          >
            <option value="">To Time Zone</option>
            {allTimeZones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="btn btn-primary shadow-lg shadow-secondary/50 w-full"
        onClick={handleConvert}
      >
        Convert
      </button>

      {convertedOutput && (
        <div role="status" className="mt-3 flex flex-wrap gap-4 justify-center">
          {convertedOutput.split("\n").map((line, index) => (
            <div
              key={index}
              className="bg-base-300 p-3 rounded text-sm text-white font-sans border border-base-100 w-full sm:w-auto"
            >
              <p>{line}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeZoneConverter;
