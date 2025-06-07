import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
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

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);
const rowHeight = 30;

function App() {
  const layouts = {
    lg: [
      { i: "pomodoro", x: 0, y: 0, w: 3, h: 10 },
      { i: "tasktracker", x: 3, y: 0, w: 3, h: 10 },
      { i: "brief", x: 6, y: 0, w: 3, h: 10 },
      { i: "canvas", x: 9, y: 0, w: 6, h: 15 },
      { i: "kanban", x: 0, y: 1, w: 6, h: 15 },
      { i: "quote", x: 6, y: 1, w: 3, h: 8 },
      { i: "reference", x: 9, y: 1, w: 3, h: 8 },
      { i: "spotify", x: 0, y: 2, w: 3, h: 8 },
      { i: "timezone", x: 3, y: 2, w: 3, h: 8 },
      { i: "worldclock", x: 6, y: 2, w: 3, h: 8 },
      { i: "youtube", x: 9, y: 2, w: 3, h: 8 },
    ],
  };

  const gridItemWrapper = (key, Component) => (
    <div key={key} className="h-full w-full">
      <div
        className="drag-handle"
        style={{
          height: "10px",
          width: "100%",
          cursor: "move",
          backgroundColor: "#374151",
          borderTopLeftRadius: "0.75rem",
          borderTopRightRadius: "0.75rem",
        }}
      ></div>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "0.5rem",
          boxSizing: "border-box",
          borderRadius: "0 0 0.75rem 0.75rem",
          backgroundColor: "var(--tw-bg-neutral, #1f2937)",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Component />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        Responsive Grid with Working Components
      </h1>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={rowHeight}
        isResizable={true}
        isDraggable={true}
        preventCollision={false}
        compactType={null}
        useCSSTransforms={true}
        draggableHandle=".drag-handle"
        autoSize={true}
        style={{ position: "relative", zIndex: 1 }}
      >
        {gridItemWrapper("pomodoro", Pomodoro)}
        {gridItemWrapper("tasktracker", TaskTracker)}
        {gridItemWrapper("brief", BriefGenerator)}
        {gridItemWrapper("canvas", Canvas)}
        {gridItemWrapper("kanban", KanbanBoard)}
        {gridItemWrapper("quote", Quote)}
        {gridItemWrapper("reference", ReferenceImages)}
        {gridItemWrapper("spotify", Spotify)}
        {gridItemWrapper("timezone", TimeZoneConverter)}
        {gridItemWrapper("worldclock", WorldClock)}
        {gridItemWrapper("youtube", YouTube)}
      </ResponsiveGridLayout>
    </div>
  );
}

export default App;
