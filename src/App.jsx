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
import KanbanBoard from "./components/KanbanBoard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  const [showPomodoro, setShowPomodoro] = useState(true);
  const [showCalendar, setShowCalendar] = useState(true);
  const [showWorldClock, setShowWorldClock] = useState(true);
  const [showCanvas, setShowCanvas] = useState(true);
  const [showTaskTracker, setShowTaskTracker] = useState(true);
  const [showKanban, setShowKanban] = useState(true);
  const [showQuote, setShowQuote] = useState(true);
  const [showBriefGenerator, setShowBriefGenerator] = useState(true);
  const [showReferenceImages, setShowReferenceImages] = useState(true);
  const [showYoutube, setShowYoutube] = useState(true);
  const [showStickyNotes, setShowStickyNotes] = useState(true);

  const [backgroundName, setBackgroundName] = useState("");
  const [backgroundArtist, setBackgroundArtist] = useState("");
  const [backgroundLink, setBackgroundLink] = useState("");

  const handleBackgroundChange = (bgName, artist, link) => {
    setBackgroundName(bgName);
    setBackgroundArtist(artist);
    setBackgroundLink(link);
    document.body.style.backgroundImage = `url(/backgrounds/${bgName}.jpg)`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.transition = "background-image 0.5s ease-in-out";
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 pb-20">
      <Navbar
        onTogglePomodoro={() => setShowPomodoro((prev) => !prev)}
        onToggleCalendar={() => setShowCalendar((prev) => !prev)}
        onToggleWorldClock={() => setShowWorldClock((prev) => !prev)}
        onToggleCanvas={() => setShowCanvas((prev) => !prev)}
        onToggleTaskTracker={() => setShowTaskTracker((prev) => !prev)}
        onToggleKanbanBoard={() => setShowKanban((prev) => !prev)}
        onToggleQuote={() => setShowQuote((prev) => !prev)}
        onToggleBriefGenerator={() => setShowBriefGenerator((prev) => !prev)}
        onToggleReferenceImages={() => setShowReferenceImages((prev) => !prev)}
        onToggleYoutube={() => setShowYoutube((prev) => !prev)}
        onToggleStickyNotes={() => setShowStickyNotes((prev) => !prev)}
        onBackgroundChange={handleBackgroundChange}
      />

      <div className="flex flex-wrap justify-center gap-4 p-4">
        {showPomodoro && <Pomodoro />}
        {showTaskTracker && <TaskTracker />}
        {showStickyNotes && <StickyNotes />}
      </div>

      <div className="flex justify-center p-4">
        <div className="lg:basis-[1188px] max-w-full sm:w-96">
          {showKanban && <KanbanBoard onClose={() => setShowKanban(false)} />}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 p-4">
        {showWorldClock && <WorldClock />}
        {showCalendar && <TimeZoneConverter />}
        {showQuote && <Quote />}
      </div>

      <div className="flex flex-wrap justify-center gap-4 p-4">
        {showReferenceImages && <ReferenceImages />}
        {showBriefGenerator && <BriefGenerator />}
        {showYoutube && <YouTube />}
      </div>

      <div className="flex justify-center p-4">
        <div className="lg:basis-[1188px] max-w-full sm:w-96">
          {showCanvas && <Canvas />}
        </div>
      </div>

      <Footer artist={backgroundArtist} link={backgroundLink} />
    </div>
  );
};

export default App;
