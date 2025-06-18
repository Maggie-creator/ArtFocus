import React, { useState, useEffect, useRef } from "react";
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

const backgrounds = {
  background1: {
    image:
      "https://cdna.artstation.com/p/assets/images/images/087/475/468/large/-0429.jpg?1745894356",
    artist: "秋刀鱼",
    link: "https://www.artstation.com/artwork/OvRX2v",
    name: "Sketch of the Day",
  },
  lost_land_fairy_land: {
    image:
      "https://cdnb.artstation.com/p/assets/images/images/087/437/457/large/qing-ying-20250427-093915.jpg?1745802113",
    artist: "qing ying",
    link: "https://www.artstation.com/artwork/L4bEVr",
    name: "Lost Land, Fairy Land",
  },
  lost_in_between: {
    image:
      "https://cdnb.artstation.com/p/assets/images/images/037/521/205/large/alena-aenami-lost-1k.jpg?1620609020",
    artist: "Alena Aenami",
    link: "https://www.artstation.com/artwork/J91ZxD",
    name: "Lost in Between",
  },
  A_Floating_City: {
    image:
      "https://cdnb.artstation.com/p/assets/images/images/051/015/853/large/elias-stern-a-floating-city.jpg?1656261682",
    artist: "Elias Stern",
    link: "https://www.artstation.com/artwork/b5ZdVm",
    name: "A Floating City",
  },
  Quiet_Day: {
    image:
      "https://cdnb.artstation.com/p/assets/images/images/014/591/729/4k/sergey-vasnev-fallen-ship.jpg?1544618232",
    artist: "Sergey Vasnev",
    link: "https://www.artstation.com/artwork/balnLG",
    name: "Quiet Day",
  },
};

const App = () => {
  const [backgroundKey, setBackgroundKey] = useState("background1");
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  const navbarRef = useRef(null);
  const footerRef = useRef(null);

  const [componentVisibility, setComponentVisibility] = useState({
    pomodoro: true,
    worldClock: true,
    timeZoneConverter: true,
    canvas: true,
    taskTracker: true,
    kanban: true,
    quote: true,
    briefGenerator: true,
    referenceImages: true,
    youtube: true,
    stickyNotes: true,
  });

  const handleToggleComponentVisibility = (componentName) => {
    setComponentVisibility(prev => ({
      ...prev,
      [componentName]: !prev[componentName]
    }));
  };

  useEffect(() => {
    const savedKey = localStorage.getItem("selectedBackground");
    if (savedKey && backgrounds[savedKey]) {
      setBackgroundKey(savedKey);
    }

    const updateHeights = () => {
      if (navbarRef.current) setNavbarHeight(navbarRef.current.offsetHeight);
      if (footerRef.current) setFooterHeight(footerRef.current.offsetHeight);
    };

    updateHeights();
    window.addEventListener("resize", updateHeights);
    return () => window.removeEventListener("resize", updateHeights);
  }, []);

  const handleBackgroundChange = (key) => {
    setBackgroundKey(key);
    localStorage.setItem("selectedBackground", key);
  };

  const currentBackground = backgrounds[backgroundKey];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${currentBackground.image})` }}
      />

      {/* Sticky Navbar */}
      <div ref={navbarRef} className="fixed top-0 left-0 w-full z-[9999]">
        <Navbar
          onToggleComponent={handleToggleComponentVisibility}
          onBackgroundChange={handleBackgroundChange}
          backgrounds={backgrounds}
        />
      </div>

      {/* Foreground Content */}
      <div
        className="relative z-[9998] w-full overflow-x-hidden"
        style={{ paddingTop: navbarHeight, paddingBottom: footerHeight }}
      >
        {/* Group 1 */}
        <div className="flex flex-wrap justify-center gap-4 pt-10 pb-4">
          {componentVisibility.pomodoro && <Pomodoro onClose={() => handleToggleComponentVisibility('pomodoro')} />}
          {componentVisibility.taskTracker && (
            <TaskTracker onClose={() => handleToggleComponentVisibility('taskTracker')} />
          )}
          {componentVisibility.stickyNotes && (
            <StickyNotes onClose={() => handleToggleComponentVisibility('stickyNotes')} />
          )}
        </div>

        {/* Kanban */}
        <div className="flex justify-center p-4">
          <div className="lg:basis-[1188px] max-w-full w-full">
            {componentVisibility.kanban && <KanbanBoard onClose={() => handleToggleComponentVisibility('kanban')} />}
          </div>
        </div>

        {/* Group 2 */}
        <div className="flex flex-wrap justify-center gap-4 p-4">
          {componentVisibility.worldClock && (
            <WorldClock onClose={() => handleToggleComponentVisibility('worldClock')} />
          )}
          {componentVisibility.timeZoneConverter && (
            <TimeZoneConverter
              onClose={() => handleToggleComponentVisibility('timeZoneConverter')}
            />
          )}
          {componentVisibility.quote && <Quote onClose={() => handleToggleComponentVisibility('quote')} />}
        </div>

        {/* Group 3 */}
        <div className="flex flex-wrap justify-center gap-4 p-4">
          {componentVisibility.referenceImages && (
            <ReferenceImages onClose={() => handleToggleComponentVisibility('referenceImages')} />
          )}
          {componentVisibility.briefGenerator && (
            <BriefGenerator onClose={() => handleToggleComponentVisibility('briefGenerator')} />
          )}
          {componentVisibility.youtube && <YouTube onClose={() => handleToggleComponentVisibility('youtube')} />}
        </div>

        {/* Canvas */}
        <div className="flex justify-center p-4">
          <div className="lg:basis-[1188px] max-w-full w-full">
            {componentVisibility.canvas && <Canvas onClose={() => handleToggleComponentVisibility('canvas')} />}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div ref={footerRef} className="fixed bottom-0 left-0 w-full z-[9999]">
        <Footer
          artist={currentBackground.artist}
          link={currentBackground.link}
        />
      </div>
    </div>
  );
};

export default App;
