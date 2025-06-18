import React, { useEffect, useRef, useState } from "react";
import { SquareX } from "lucide-react";

const Canvas = ({ onClose }) => {
  const SUMO_PAINT_URL = "https://paint.sumo.app/";
  const SUMO_3D_URL = "https://3d.sumo.app/?lang=en";

  const clickSoundRef = useRef(null);
  const closeSoundRef = useRef(null);

  const [isClosing, setIsClosing] = useState(false);
  const [visible, setVisible] = useState(true);
  const [selectedTool, setSelectedTool] = useState("Sumo Paint");

  const softwareMap = {
    "Sumo Paint": SUMO_PAINT_URL,
    "Sumo 3D": SUMO_3D_URL,
  };

  useEffect(() => {
    clickSoundRef.current = new Audio("/sounds/mouse-click-sound.mp3");
    closeSoundRef.current = new Audio("/sounds/notebook-close-83836.mp3");
  }, []);

  const handleClose = () => {
    if (closeSoundRef.current) {
      closeSoundRef.current.currentTime = 0;
      closeSoundRef.current.play().catch(error => console.error("Error playing Canvas close sound:", error));
    }
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 150);
  };

  const handleOpenFullscreen = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(error => console.error("Error playing Canvas click sound:", error));
    }
    window.open(softwareMap[selectedTool], "_blank");
  };

  const handleToolChange = (e) => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(error => console.error("Error playing Canvas click sound:", error));
    }
    setSelectedTool(e.target.value);
  };

  if (!visible) return null;

  return (
    <div
      className={`relative flex flex-auto flex-col items-center text-center p-4 bg-base-100 border border-base-100 shadow-xl shadow-neutral-950/50 rounded-box mx-1 w-500
        ${isClosing ? "opacity-0" : "opacity-100"}`}
      style={{ willChange: "opacity", transition: "opacity 150ms ease" }}
    >
      {/* Close button */}
      <div className="absolute top-0 right-0 m-2 z-[1050]">
        <div
          className="tooltip tooltip-right tooltip-primary z-[1050] relative"
          data-tip="Close"
        >
          <button
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={handleClose}
          >
            <SquareX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Software title */}
      <h1 className="text-2xl font-semibold mb-2 text-center permanent-marker p-4">
        {selectedTool}
      </h1>

      {/* Tool selection dropdown */}
      <select
        className="select select-secondary w-full max-w-xs mb-4" // Added mb-4 for spacing
        value={selectedTool}
        onChange={handleToolChange}
      >
        <option>Sumo Paint</option>
        <option>Sumo 3D</option>
      </select>

      {/* Iframe preview */}
      <div
        className="w-full rounded overflow-hidden border border-base-300 my-4"
        style={{ height: "700px" }}
      >
        <iframe
          src={softwareMap[selectedTool]}
          title={selectedTool}
          width="100%"
          height="100%"
          style={{ border: "none" }}
          allowFullScreen
        />
      </div>

      {/* Fullscreen button */}
      <div className="card-actions justify-end mt-4 w-full">
        <button
          className="btn btn-primary w-full px-6 py-3 shadow-lg shadow-primary/50"
          onClick={handleOpenFullscreen}
        >
          Open Fullscreen
        </button>
      </div>
    </div>
  );
};

export default Canvas;
