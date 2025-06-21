import React, { useState, useRef } from "react";
import ReactPlayer from "react-player/youtube";
import { SquareX } from "lucide-react";

const YouTubePlayer = ({ onClose, isSoundOn }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [isValidYouTubeUrl, setIsValidYouTubeUrl] = useState(true);
  const closeClickAudioRef = useRef(null);

  const handleUrlChange = (event) => {
    const newUrl = event.target.value;

    if (isSoundOn) {
      new Audio("/sounds/click.mp3")
        .play()
        .catch((err) =>
          console.error("Error playing click sound on URL input:", err)
        );
    }

    setVideoUrl(newUrl);

    if (newUrl.trim() === "") {
      setIsValidYouTubeUrl(true); // Reset validation if input is empty
    } else {
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      setIsValidYouTubeUrl(youtubeRegex.test(newUrl));
    }
  };

  const handleClose = () => {
    // Removed the generic click.mp3 sound from here to avoid double sound.
    // The closeClickAudioRef (notebook-close-83836.mp3) is more specific.
    if (isSoundOn && closeClickAudioRef.current) {
      closeClickAudioRef.current.currentTime = 0;
      closeClickAudioRef.current
        .play()
        .catch((error) =>
          console.error("Error playing YouTube close sound:", error)
        );
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
            aria-label="Close YouTube player"
          >
            <SquareX className="w-6 h-6" />
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-4 text-center permanent-marker p-4">
        YouTube
      </h1>

      {/* Video URL input */}
      <label htmlFor="youtube-url-input" className="sr-only">YouTube Video URL</label>
      <input
        type="text"
        id="youtube-url-input"
        value={videoUrl}
        onChange={handleUrlChange}
        placeholder="Enter YouTube video URL"
        className="input input-bordered border-primary w-full"
        onFocus={() => {
          if (isSoundOn) {
            new Audio("/sounds/click.mp3")
              .play()
              .catch((err) =>
                console.error("Error playing click sound on focus:", err)
              );
          }
        }}
      />

      {/* Validation Message */}
      {videoUrl && !isValidYouTubeUrl && (
        <p role="alert" className="text-red-500 text-sm mt-2">
          Please enter a valid YouTube URL.
        </p>
      )}

      {/* React Player */}
      {videoUrl && isValidYouTubeUrl && (
        <div className="relative aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
          <ReactPlayer
            url={videoUrl}
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
