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
  different_worlds: {
    image:
      "https://cdna.artstation.com/p/assets/images/images/040/035/348/large/hue-teo-environment-with-giant.jpg?1627654369",
    artist: "Hue Teo",
    link: "https://www.artstation.com/artwork/rA6DB5",
    name: "Different Worlds",
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

const defaultVisibility = {
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
};

const App = () => {
  const [backgroundKey, setBackgroundKey] = useState("background1");
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [bgLoaded, setBgLoaded] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true); // 🔊 Sound toggle state

  const toggleSound = () => setIsSoundOn((prev) => !prev); // 🔁 Toggle handler

  const navbarRef = useRef(null);
  const footerRef = useRef(null);

  const [componentVisibility, setComponentVisibility] = useState(() => {
    const saved = localStorage.getItem("componentVisibility");
    return saved ? JSON.parse(saved) : defaultVisibility;
  });

  useEffect(() => {
    localStorage.setItem(
      "componentVisibility",
      JSON.stringify(componentVisibility)
    );
  }, [componentVisibility]);

  const handleToggleComponentVisibility = (componentName) => {
    setComponentVisibility((prev) => ({
      ...prev,
      [componentName]: !prev[componentName],
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
    setBgLoaded(false);
    setBackgroundKey(key);
    localStorage.setItem("selectedBackground", key);
  };

  const currentBackground = backgrounds[backgroundKey];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Preload background */}
      <img
        src={currentBackground.image}
        alt="background preload"
        style={{ display: "none" }}
        onLoad={() => setBgLoaded(true)}
        onError={() => setBgLoaded(false)}
      />

      {/* Background Layers */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed transition-opacity duration-700"
        style={{
          backgroundImage: bgLoaded
            ? `url(${currentBackground.image})`
            : "none",
          backgroundColor: !bgLoaded ? "#1f1f1f" : undefined,
        }}
      />
      <div className="fixed inset-0 -z-9 bg-black bg-opacity-35 pointer-events-none" />

      {/* Navbar */}
      <div ref={navbarRef} className="fixed top-0 left-0 w-full z-[9999]">
        <Navbar
          onToggleComponent={handleToggleComponentVisibility}
          onBackgroundChange={handleBackgroundChange}
          backgrounds={backgrounds}
          componentVisibility={componentVisibility}
          isSoundOn={isSoundOn} // 🔊
          toggleSound={toggleSound} // 🔁
        />
      </div>

      {/* Main Content */}
      <div
        className="relative z-[9998] w-full overflow-x-hidden"
        style={{ paddingTop: navbarHeight, paddingBottom: footerHeight }}
      >
        <div className="flex flex-wrap justify-center gap-4 pt-10 pb-4">
          {componentVisibility.pomodoro && (
            <Pomodoro
              onClose={() => handleToggleComponentVisibility("pomodoro")}
              isSoundOn={isSoundOn} // 🔊 pass to Pomodoro
            />
          )}
          {componentVisibility.taskTracker && (
            <TaskTracker
              onClose={() => handleToggleComponentVisibility("taskTracker")}
              isSoundOn={isSoundOn}
            />
          )}
          {componentVisibility.stickyNotes && (
            <StickyNotes
              onClose={() => handleToggleComponentVisibility("stickyNotes")}
              isSoundOn={isSoundOn}
            />
          )}
        </div>

        <div className="flex justify-center p-4">
          <div className="lg:basis-[1188px] max-w-full w-full">
            {componentVisibility.kanban && (
              <KanbanBoard
                onClose={() => handleToggleComponentVisibility("kanban")}
                isSoundOn={isSoundOn}
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 p-4">
          {componentVisibility.worldClock && (
            <WorldClock
              onClose={() => handleToggleComponentVisibility("worldClock")}
              isSoundOn={isSoundOn}
            />
          )}
          {componentVisibility.timeZoneConverter && (
            <TimeZoneConverter
              onClose={() =>
                handleToggleComponentVisibility("timeZoneConverter")
              }
              isSoundOn={isSoundOn}
            />
          )}
          {componentVisibility.quote && (
            <Quote
              onClose={() => handleToggleComponentVisibility("quote")}
              isSoundOn={isSoundOn}
            />
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 p-4">
          {componentVisibility.referenceImages && (
            <ReferenceImages
              onClose={() => handleToggleComponentVisibility("referenceImages")}
              isSoundOn={isSoundOn}
            />
          )}
          {componentVisibility.briefGenerator && (
            <BriefGenerator
              onClose={() => handleToggleComponentVisibility("briefGenerator")}
              isSoundOn={isSoundOn}
            />
          )}
          {componentVisibility.youtube && (
            <YouTube
              onClose={() => handleToggleComponentVisibility("youtube")}
              isSoundOn={isSoundOn}
            />
          )}
        </div>

        <div className="flex justify-center p-4">
          <div className="lg:basis-[1188px] max-w-full w-full">
            {componentVisibility.canvas && (
              <Canvas
                onClose={() => handleToggleComponentVisibility("canvas")}
                isSoundOn={isSoundOn}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
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
