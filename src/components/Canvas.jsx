import React, { useEffect, useRef } from "react";
import { SquareX } from "lucide-react";

const Canvas = ({ onClose }) => {
  const sumoURL =
    "https://paint.sumo.app/?parameter=value&another_parameter=another_value";

  const clickSound = new Audio("/sounds/mouse-click-sound.mp3");

  // AudioContext and buffer for close sound
  const audioContextRef = useRef(null);
  const closeSoundBufferRef = useRef(null);

  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = ctx;

    fetch("/sounds/notebook-close-83836.mp3")
      .then((res) => res.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        closeSoundBufferRef.current = decoded;
      })
      .catch(console.error);

    return () => ctx.close();
  }, []);

  const playCloseSound = () => {
    if (audioContextRef.current && closeSoundBufferRef.current) {
      const src = audioContextRef.current.createBufferSource();
      src.buffer = closeSoundBufferRef.current;
      src.connect(audioContextRef.current.destination);
      src.start();
    }
  };

  // Open Sumo Paint in a new tab and play click sound
  const handleOpenFullscreen = () => {
    clickSound.play();
    window.open(sumoURL, "_blank");
  };

  return (
    <div className="relative flex flex-auto flex-col items-center text-center p-4 bg-base-100 border border-base-100 shadow-xl shadow-neutral-950/50 rounded-box mx-2">
      {/* Close button */}
      <div className="absolute top-0 right-0 m-2">
        <div className="tooltip tooltip-right tooltip-primary" data-tip="Close">
          <button
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => {
              playCloseSound();
              onClose();
            }}
          >
            <SquareX className="w-6 h-6" />
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white mb-4 permanent-marker">
        Sumo Paint
      </h1>
      <p className="text-sm text-white mb-4">Drawing tool and image editor.</p>

      <div className="w-full h-150 rounded overflow-hidden border border-base-300 my-4">
        <iframe
          src={sumoURL}
          title="Sumo Paint"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          allowFullScreen
        />
      </div>

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
