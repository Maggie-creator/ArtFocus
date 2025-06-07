import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { DateTime } from "luxon";

const allTimeZones = Intl.supportedValuesOf("timeZone");

const TimeZoneConverter = ({ playClickSound }) => {
  const [convertFromZone, setConvertFromZone] = useState("");
  const [convertToZone, setConvertToZone] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [convertedOutput, setConvertedOutput] = useState("");

  const handleConvert = () => {
    if (!inputDate || !inputTime || !convertFromZone || !convertToZone) return;

    try {
      const dateTimeStr = `${inputDate}T${inputTime}`;

      const fromDateTime = DateTime.fromISO(dateTimeStr, {
        zone: convertFromZone,
      });
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

  return (
    <div className="card card-border bg-base-100 w-96">
         <h1 className="text-2xl font-semibold mb-4 text-center permanent-marker p-4">Time Zone Converter</h1>
      <div className="flex gap-2 mb-2 relative">
        <div className="relative w-1/2">
          <input
            type="date"
            className="input bg-white text-black w-full pr-10 rounded"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
          />
          <Calendar className="absolute right-2 top-2.5 w-5 h-5 text-gray-700 pointer-events-none" />
        </div>

        <div className="relative w-1/2">
          <input
            type="time"
            className="input bg-white text-black w-full pr-10 rounded"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                playClickSound();
                handleConvert();
              }
            }}
          />
          <Clock className="absolute right-2 top-2.5 w-5 h-5 text-gray-700 pointer-events-none" />
        </div>
      </div>

      <div className="flex gap-2 mb-2">
        <select
          className="select bg-base-300 text-white w-1/2 rounded"
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

        <select
          className="select bg-base-300 text-white w-1/2 rounded"
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

      <button
        className="btn btn-secondary shadow-lg shadow-secondary/50 w-full"
        onClick={() => {
          playClickSound();
          handleConvert();
        }}
      >
        Convert
      </button>

      {convertedOutput && (
        <div className="mt-3 flex flex-wrap gap-4 justify-center">
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
