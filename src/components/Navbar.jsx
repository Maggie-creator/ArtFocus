import React from "react";
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

  return (
    <div className="navbar px-4 sticky top-0 z-[9999] backdrop-blur-sm">
      {/* Navbar Start */}
      <div className="navbar-start">
        <img
          src="/icons/Artfocus_logo2.png"
          alt="ArtFocus Logo"
          className="h-10 transition-transform hover:scale-105 hover:drop-shadow-lg"
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
                >
                  <Icon className="w-5 h-5" />
                </button>
              </div>
            );
          })}

          <div className="divider divider-horizontal"></div>

          {/* 🎨 Background Selector */}
          <div className="dropdown dropdown-start z-[9999]">
            <label
              tabIndex={0}
              className="btn btn-accent btn-outline tooltip tooltip-bottom tooltip-secondary flex justify-center items-center"
              data-tip="Change Background"
              aria-label="Change Background"
            >
              <span className="text-lg">🎨</span>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-60 z-[100] text-base-content"
            >
              <li>
                <button onClick={() => onBackgroundChange("background1")}>
                  <span className="italic">"Sketch of the Day"</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onBackgroundChange("lost_land_fairy_land")}
                >
                  <span className="italic">"Lost Land, Fairy Land"</span>
                </button>
              </li>
              <li>
                <button onClick={() => onBackgroundChange("different_worlds")}>
                  <span className="italic">"Different Worlds"</span>
                </button>
              </li>
              <li>
                <button onClick={() => onBackgroundChange("A_Floating_City")}>
                  <span className="italic">"A Floating City"</span>
                </button>
              </li>
              <li>
                <button onClick={() => onBackgroundChange("Quiet_Day")}>
                  <span className="italic">"Quiet Day"</span>
                </button>
              </li>
            </ul>
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
    </div>
  );
};

export default Navbar;
