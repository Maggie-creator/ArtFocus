import React, { useEffect, useState, useRef } from "react";
import { SquareX } from "lucide-react";
import Fuse from "fuse.js";
import TimeZoneConverter from "./TimeZoneConverter";

const allTimeZones = Intl.supportedValuesOf("timeZone");

const fuse = new Fuse(allTimeZones, {
  includeScore: true,
  threshold: 0.4,
});

const WorldClock = ({ onClose }) => {
  const [timeZones, setTimeZones] = useState(() => {
    const stored = localStorage.getItem("worldClockCities");
    return stored ? JSON.parse(stored) : [];
  });

  const [times, setTimes] = useState({});
  const [newCity, setNewCity] = useState("");
  const [newZoneInput, setNewZoneInput] = useState("");
  const [zoneSuggestions, setZoneSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const clickSoundRef = useRef(null);

  useEffect(() => {
    clickSoundRef.current = new Audio("/sounds/notebook-close-83836.mp3");
  }, []);

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  const updateTimes = () => {
    const now = {};
    timeZones.forEach(({ city, zone }) => {
      try {
        const formatter = new Intl.DateTimeFormat([], {
          timeZone: zone,
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        now[city] = formatter.format(new Date());
      } catch {
        now[city] = "Invalid timezone";
      }
    });
    setTimes(now);
  };

  useEffect(() => {
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [timeZones]);

  useEffect(() => {
    localStorage.setItem("worldClockCities", JSON.stringify(timeZones));
  }, [timeZones]);

  const handleZoneInputChange = (e) => {
    const val = e.target.value;
    setNewZoneInput(val);
    if (val.trim()) {
      const results = fuse
        .search(val)
        .slice(0, 8)
        .map((r) => r.item);
      setZoneSuggestions(results);
    } else {
      setZoneSuggestions([]);
    }
  };

  const handleZoneKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveSuggestion((prev) =>
        Math.min(prev + 1, zoneSuggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setActiveSuggestion((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (zoneSuggestions[activeSuggestion]) {
        setNewZoneInput(zoneSuggestions[activeSuggestion]);
        setZoneSuggestions([]);
      } else {
        playClickSound();
        addCity();
      }
    }
  };

  const handleCityKeyDown = (e) => {
    if (e.key === "Enter") {
      playClickSound();
      addCity();
    }
  };

  const handleZoneSuggestionClick = (suggestion) => {
    setNewZoneInput(suggestion);
    setZoneSuggestions([]);
  };

  const addCity = () => {
    if (!newCity.trim() || !newZoneInput.trim()) return;
    setTimeZones((prev) => [
      ...prev,
      { city: newCity.trim(), zone: newZoneInput },
    ]);
    setNewCity("");
    setNewZoneInput("");
    setZoneSuggestions([]);
    setActiveSuggestion(0);
  };

  const removeCity = (cityToRemove) => {
    playClickSound();
    setTimeZones((prev) => prev.filter(({ city }) => city !== cityToRemove));
  };

  return (
    <div className="card card-border bg-base-100 w-96 shadow-xl shadow-neutral-950/50 text-base-content p-4 text-center relative">
      {/* Close Button */}
      <div className="absolute top-0 right-0 m-2">
        <div className="tooltip tooltip-right tooltip-primary" data-tip="Close">
          <button
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => {
              playClickSound();
              onClose();
            }}
          >
            <SquareX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-4 text-center permanent-marker p-4">
        World Clock
      </h1>

      {/* City Input */}
      <div className=" gap 2 mb-4">
        <input
          type="text"
          className="input input-border border-primary w-full bg-base-100 text-white p-4"
          placeholder="City"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          onKeyDown={handleCityKeyDown}
        />
      </div>

      {/* Time Zone Input */}
      <div className="mb-4 relative">
        <input
          type="text"
          className="input input-border border-primary w-full bg-base-10 text-white"
          placeholder="Time Zone"
          value={newZoneInput}
          onChange={handleZoneInputChange}
          onKeyDown={handleZoneKeyDown}
        />
        {zoneSuggestions.length > 0 && (
          <ul className="absolute z-10 bg-gray-900 text-white w-full mt-1 rounded shadow max-h-40 overflow-y-auto text-left border border-base-300">
            {zoneSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                className={`px-2 py-1 cursor-pointer ${
                  index === activeSuggestion
                    ? "bg-primary text-white"
                    : "hover:bg-gray-700"
                }`}
                onMouseDown={() => handleZoneSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Button */}
      <button
        className="btn btn-primary shadow-lg shadow-primary/50 mb-4"
        onClick={() => {
          playClickSound();
          addCity();
        }}
      >
        Add
      </button>

      {/* Clock Cards */}
      <div className="flex flex-col gap-4 font-sans">
        {timeZones.map(({ city }) => (
          <div key={city} className="relative flex justify-center">
            <div className="card bg-base-300 p-4 w-full items-center justify-center rounded-xl shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-2 text-primary">
                {city}
              </h3>
              <div className="text-base font-sans text-white">
                {times[city] || "--:--:--"}
              </div>
            </div>
            <div className="absolute top-1 right-1">
              <div
                className="tooltip tooltip-left tooltip-error"
                data-tip="Remove City"
              >
                <button
                  className="text-red-500 hover:text-red-700 p-1"
                  onClick={() => removeCity(city)}
                >
                  <SquareX className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldClock;
