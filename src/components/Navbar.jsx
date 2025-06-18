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
} from "lucide-react";

const Navbar = ({
  onToggleComponent,
  onBackgroundChange,
}) => {
  const tools = [
    ["Pomodoro Timer", TimerReset, () => onToggleComponent('pomodoro'), 'pomodoro'],
    ["To-Do List", ListChecks, () => onToggleComponent('taskTracker'), 'taskTracker'],
    ["Sticky Notes", NotebookPen, () => onToggleComponent('stickyNotes'), 'stickyNotes'],
    ["Kanban Board", Kanban, () => onToggleComponent('kanban'), 'kanban'],
    ["World Clock", Earth, () => onToggleComponent('worldClock'), 'worldClock'],
    ["Time Zone Converter", Clock10, () => onToggleComponent('timeZoneConverter'), 'timeZoneConverter'],
    ["Quote", Quote, () => onToggleComponent('quote'), 'quote'],
    ["Reference Images", FileImage, () => onToggleComponent('referenceImages'), 'referenceImages'],
    ["Brief Generator", Lightbulb, () => onToggleComponent('briefGenerator'), 'briefGenerator'],
    ["Youtube", MonitorPlay, () => onToggleComponent('youtube'), 'youtube'],
    ["Sumo Paint / Sumo 3D", Palette, () => onToggleComponent('canvas'), 'canvas'],
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

      {/* Navbar Center (Only on Large Screens) */}
      <div className="navbar justify-center lg:flex">
        <div className="flex flex-wrap gap-3 w-full">
          {tools.map(([tip, Icon, handler, keyName]) => (
            <div
              key={keyName} // Use keyName for React key
              className="sm:tooltip sm:tooltip-bottom sm:tooltip-secondary z-[9999]"
              data-tip={tip}
            >
              <button
                onClick={handler}
                className="btn btn-accent shadow-lg shadow-accent/50"
                aria-label={tip} // Add aria-label
              >
                <Icon className="w-5 h-5" />
              </button>
            </div>
          ))}

          <div className="divider divider-horizontal"></div>

          {/* Background Selector */}
          <div className="dropdown dropdown-start z-[9999]">
            <label
              tabIndex={0}
              className="btn btn-accent btn-outline tooltip tooltip-bottom tooltip-secondary flex justify-center items-center"
              data-tip="Change Background"
              aria-label="Change Background" // Add aria-label
            >
              <span className="text-lg">🎨</span>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-1 shadow bg-base-300 rounded-box w-60 z-[100] text-base-content"
              style={{
                width: "auto",
                maxWidth: "calc(100vw - 2rem)", // Keeps dropdown within viewport with margin
              }}
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
