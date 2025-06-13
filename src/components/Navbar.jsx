import React from "react";
import {
  TimerReset,
  Clock10,
  Palette,
  ListChecks,
  Kanban,
  Quote,
  Lightbulb,
  FileImage,
  MonitorPlay,
  NotebookPen,
} from "lucide-react";

const Navbar = ({
  onToggleBriefGenerator,
  onTogglePomodoro,
  onToggleWorldClock,
  onToggleCanvas,
  onToggleTaskTracker,
  onToggleKanbanBoard,
  onToggleQuote,
  onToggleReferenceImages,
  onToggleYoutube,
  onToggleStickyNotes,
  onBackgroundChange,
}) => {
  const tools = [
    ["Pomodoro Timer", TimerReset, onTogglePomodoro],
    ["World Clock", Clock10, onToggleWorldClock],
    ["Sumo Paint", Palette, onToggleCanvas],
    ["Task Tracker", ListChecks, onToggleTaskTracker],
    ["Kanban Board", Kanban, onToggleKanbanBoard],
    ["Quote", Quote, onToggleQuote],
    ["Brief Generator", Lightbulb, onToggleBriefGenerator],
    ["Reference Images", FileImage, onToggleReferenceImages],
    ["Youtube", MonitorPlay, onToggleYoutube],
    ["Sticky Notes", NotebookPen, onToggleStickyNotes],
  ];

  return (
    <div className="navbar px-4 sticky top-0 z-[100] backdrop-blur-sm">
      {/* Navbar Start */}
      <div className="navbar-start">
        <img
          src="/icons/Artfocus_logo2.png"
          alt="ArtFocus Logo"
          className="h-10 transition-transform hover:scale-105 hover:drop-shadow-lg"
        />
      </div>

      {/* Navbar Center (Only on Large Screens) */}
      <div className="navbar justify-center lg:flex">
        <div className="flex flex-wrap gap-3 w-full">
          {tools.map(([tip, Icon, handler]) => (
            <div
              key={tip}
              className="tooltip tooltip-bottom tooltip-secondary z-[100]"
              data-tip={tip}
            >
              <button
                onClick={handler}
                className="btn btn-accent shadow-lg shadow-accent/50"
              >
                <Icon className="w-5 h-5" />
              </button>
            </div>
          ))}

          <div className="divider divider-horizontal"></div>

          {/* Background Selector */}
          <div className="dropdown dropdown-start z-[100]">
            <label
              tabIndex={0}
              className="btn btn-accent btn-outline tooltip tooltip-bottom tooltip-secondary"
              data-tip="Change Background"
            >
              🎨
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-64 z-[100] text-base-content"
            >
              <li>
                <button onClick={() => onBackgroundChange("background1")}>
                  <span className="italic">"Sketch of the Day"</span>
                </button>
              </li>
              <li>
                <button onClick={() => onBackgroundChange("lost_land_fairy_land")}>
                  <span className="italic">"Lost Land, Fairy Land"</span>
                </button>
              </li>
              <li>
                <button onClick={() => onBackgroundChange("lost_in_between")}>
                  <span className="italic">"Lost in Between"</span>
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
        </div>
      </div>
    </div>
  );
};

export default Navbar;
