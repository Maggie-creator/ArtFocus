import React, { useState, useRef } from "react";
import ReactPlayer from "react-player/youtube";
import { SquareX } from "lucide-react";

const YouTubePlayer = ({ onClose }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeClickAudioRef = useRef(null);

  const handleUrlChange = (event) => {
    setVideoUrl(event.target.value);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    if (closeClickAudioRef.current) {
      closeClickAudioRef.current.currentTime = 0;
      closeClickAudioRef.current.play();
    }
    setIsClosing(true);
    setTimeout(onClose, 150); // matches transition duration
  };

  return (
    <div
      className={`card card-border bg-base-100 w-96 shadow-xl shadow-neutral-950/50 text-base-content p-4 text-center transition-opacity duration-150 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Audio for close */}
      <audio ref={closeClickAudioRef} src="/sounds/notebook-close-83836.mp3" />

      {/* Close Icon */}
      <div className="absolute top-0 right-0 m-2">
        <div className="tooltip tooltip-right tooltip-primary" data-tip="Close">
          <button
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={handleClose}
          >
            <SquareX className="w-6 h-6" />
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white mb-4 permanent-marker">
        YouTube
      </h1>
      <p className="text-sm text-white mb-4">
        Get inspiration from your favourite videos!
      </p>

      {/* Video URL input */}
      <input
        type="text"
        value={videoUrl}
        onChange={handleUrlChange}
        placeholder="Enter YouTube video URL"
        className="w-full p-2 mb-4 bg-white text-black rounded my-4"
      />

      {/* React Player */}
      {videoUrl && (
        <div className="relative aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
          <ReactPlayer
            url={videoUrl}
            playing={isPlaying}
            controls={true}
            width="100%"
            height="100%"
            style={{ borderRadius: "12px", overflow: "hidden" }}
            config={{
              youtube: {
                playerVars: { modestbranding: 1 },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;
