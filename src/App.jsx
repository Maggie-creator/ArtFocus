import React, { useState } from "react";
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
import Calendar from "./components/Calendar"; // ✅ Import fixed

const App = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center permanent-marker p-4">
        Grid Layout with Working Components
      </h1>

      <div className="flex flex-wrap justify-center gap-4 p-4">
        <Pomodoro />
        <TaskTracker />
        <StickyNotes />
      </div>

      <div className="flex flex-wrap justify-center gap-4 p-4">
        <WorldClock />
        <TimeZoneConverter />
        <Quote />
      </div>
      <div class="flex flex-wrap justify-center gap-4 p-4">
        <ReferenceImages />
        <BriefGenerator />
        <YouTube />
      </div>
      <div class="flex justify-center w-300 gap-4 p-4">
        <Spotify />
        <KanbanBoard />
      </div>
    </div>
  );
};

export default App;
