import React, { useState } from "react";
import Pomodoro from "./components/Pomodoro";
import TaskTracker from "./components/TaskTracker";
import BriefGenerator from "./components/BriefGenerator";
import Quote from "./components/Quote";
import ReferenceImages from "./components/ReferenceImages";
import TimeZoneConverter from "./components/TimeZoneConverter";
import WorldClock from "./components/WorldClock";
import YouTube from "./components/YouTube";
import StickyNotes from "./components/StickyNotes";
import Canvas from "./components/Canvas";
import Spotify from "./components/Spotify";

const App = () => {
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

      <div className="flex flex-wrap justify-center gap-4 p-4">
        <ReferenceImages />
        <BriefGenerator />
        <YouTube />
      </div>

      <div className="flex flex-wrap justify-center gap-4 p-4">
        {/* Spotify fixed width */}
        <div className="basis-[96px] max-w-full">
          <Spotify />
        </div>

        {/* KanbanBoard aligned with Spotify height and placed right */}
        <div className="basis-[790px] max-w-full">
          <Canvas />
        </div>
      </div>
    </div>
  );
};

export default App;
