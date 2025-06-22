import React, { useState, useEffect, useRef } from "react"; // Combined and corrected import
import {
  TimerReset,
  Clock10,
  Earth,
  Palette,
  ListChecks,
  Kanban,
  Quote,
  Lightbulb,
  FileImage,
  MonitorPlay,
  NotebookPen,
  Volume2,
  VolumeX,
} from "lucide-react";

const Navbar = ({
  onToggleComponent,
  onBackgroundChange,
  backgrounds,
  componentVisibility,
  isSoundOn,
  toggleSound,
}) => {
  const [isBgDropdownOpen, setIsBgDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown container

  const tools = [
    [
      "Pomodoro Timer",
      TimerReset,
      () => onToggleComponent("pomodoro"),
      "pomodoro",
    ],
    [
      "To-Do List",
      ListChecks,
      () => onToggleComponent("taskTracker"),
      "taskTracker",
    ],
    [
      "Sticky Notes",
      NotebookPen,
      () => onToggleComponent("stickyNotes"),
      "stickyNotes",
    ],
    ["Kanban Board", Kanban, () => onToggleComponent("kanban"), "kanban"],
    ["World Clock", Earth, () => onToggleComponent("worldClock"), "worldClock"],
    [
      "Time Zone Converter",
      Clock10,
      () => onToggleComponent("timeZoneConverter"),
      "timeZoneConverter",
    ],
    ["Quote", Quote, () => onToggleComponent("quote"), "quote"],
    [
      "Reference Images",
      FileImage,
      () => onToggleComponent("referenceImages"),
      "referenceImages",
    ],
    [
      "Brief Generator",
      Lightbulb,
      () => onToggleComponent("briefGenerator"),
      "briefGenerator",
    ],
    ["Youtube", MonitorPlay, () => onToggleComponent("youtube"), "youtube"],
    [
      "Sumo Paint / Sumo 3D",
      Palette,
      () => onToggleComponent("canvas"),
      "canvas",
    ],
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsBgDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav
      className="navbar px-4 sticky top-0 z-[9999] backdrop-blur-sm"
      aria-label="Main navigation"
    >
      {/* Navbar Start */}
      <div className="navbar-start">
        <img
          src="/icons/ArtFocus_logo_writing.png"
          alt="ArtFocus Logo"
          className="h-12 transition-transform hover:scale-105 hover:drop-shadow-lg"
        />
      </div>

      {/* Navbar Center */}
      <div className="navbar justify-center lg:flex">
        <div className="flex flex-wrap gap-3 w-full">
          {tools.map(([tip, Icon, handler, keyName]) => {
            const isVisible = componentVisibility?.[keyName];
            return (
              <div
                key={keyName}
                className="sm:tooltip sm:tooltip-bottom sm:tooltip-secondary z-[9999]"
                data-tip={tip}
              >
                <button
                  onClick={handler}
                  className={`btn shadow-lg ${
                    isVisible
                      ? "btn-accent shadow-accent/50"
                      : "btn-neutral shadow-neutral/50"
                  }`}
                  aria-label={tip}
                  aria-pressed={isVisible}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </div>
            );
          })}

          <div className="divider divider-horizontal"></div>

          {/* 🎨 Background Selector */}
          <div className="dropdown dropdown-start z-[9999]" ref={dropdownRef}>
            <button
              onClick={() => setIsBgDropdownOpen(!isBgDropdownOpen)}
              className="btn btn-accent btn-outline tooltip tooltip-bottom tooltip-secondary flex justify-center items-center"
              data-tip="Change Background"
              aria-label="Change Background"
              aria-haspopup="true"
              aria-expanded={isBgDropdownOpen}
            >
              <span className="text-lg">🎨</span>
            </button>
            {isBgDropdownOpen && (
              <ul
                className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-60 z-[100] text-base-content"
                role="menu"
              >
                <li>
                  <button
                    onClick={() => {
                      onBackgroundChange("background1");
                      setIsBgDropdownOpen(false);
                    }}
                  >
                    <span className="italic">"Golden Forest"</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onBackgroundChange("lost_land_fairy_land");
                      setIsBgDropdownOpen(false);
                    }}
                  >
                    <span className="italic">"Lost Land, Fairy Land"</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onBackgroundChange("different_worlds");
                      setIsBgDropdownOpen(false);
                    }}
                  >
                    <span className="italic">"Different Worlds"</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onBackgroundChange("A_Floating_City");
                      setIsBgDropdownOpen(false);
                    }}
                  >
                    <span className="italic">"A Floating City"</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onBackgroundChange("Quiet_Day");
                      setIsBgDropdownOpen(false);
                    }}
                  >
                    <span className="italic">"Quiet Day"</span>
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* 🔊 Sound Toggle Button */}
          <div
            className="tooltip tooltip-bottom z-[9999]"
            data-tip={isSoundOn ? "Sound On" : "Sound Off"}
          >
            <button
              onClick={toggleSound}
              className={`btn ${
                isSoundOn ? "btn-accent" : "btn-error"
              } btn-outline shadow`}
              aria-label={isSoundOn ? "Turn sound off" : "Turn sound on"}
              aria-pressed={isSoundOn}
            >
              {isSoundOn ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
