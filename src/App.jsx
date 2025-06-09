import React from "react";
import Pomodoro from "./components/Pomodoro";
import TaskTracker from "./components/TaskTracker";
import BriefGenerator from "./components/BriefGenerator";
import Canvas from "./components/Canvas";
import KanbanBoard from "./components/KanbanBoard";
import Quote from "./components/Quote";
import ReferenceImages from "./components/ReferenceImages";
import Spotify from "./components/Spotify";
import TimeZoneConverter from "./components/TimeZoneConverter";
import WorldClock from "./components/WorldClock";
import YouTube from "./components/YouTube";
import StickyNotes from "./components/StickyNotes";

const App = () => {
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        Grid Layout with Working Components
      </h1>
<div class="flex flex-wrap justify-center gap-4 p-4">
          <Pomodoro />
          <TaskTracker />
          <StickyNotes />
</div>
<div class="flex flex-wrap justify-center w-300 gap-4 p-4">
  <Canvas />
</div>

      </div>
  );
};

export default App;
