import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import { SquareX } from "lucide-react";

const YouTubePlayer = ({ onClose, isSoundOn }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [isValidYouTubeUrl, setIsValidYouTubeUrl] = useState(true);
  const [playerDimensions, setPlayerDimensions] = useState({ width: 0, height: 0 });

  const closeClickAudioRef = useRef(null);
  const containerRef = useRef(null);

  // Resize observer to adjust video size dynamically
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const height = (width * 9) / 16; // Maintain 16:9 aspect ratio
        setPlayerDimensions({ width, height });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
      setIsValidYouTubeUrl(true);
    } else {
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      setIsValidYouTubeUrl(youtubeRegex.test(newUrl));
    }
  };

  const handleClose = () => {
    if (isSoundOn && closeClickAudioRef.current) {
      closeClickAudioRef.current.currentTime = 0;
      closeClickAudioRef.current
        .play()
        .catch((error) =>
          console.error("Error playing YouTube close sound:", error)
        );
    }

    setIsClosing(true);
    setTimeout(onClose, 150);
  };

  return (
    <div
      className={`card card-border bg-base-100 w-96 shadow-xl shadow-neutral-950/50 text-base-content p-4 text-center transition-opacity duration-150 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      ref={containerRef}
    >
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

      {/* Video URL Input */}
      <label htmlFor="youtube-url-input" className="sr-only">YouTube Video URL</label>
      <input
        type="text"
        id="youtube-url-input"
        value={videoUrl}
        onChange={handleUrlChange}
        placeholder="Enter YouTube video URL"
        className="input input-bordered border-primary w-full p-4"
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

      {/* Validation */}
      {videoUrl && !isValidYouTubeUrl && (
        <p role="alert" className="text-red-500 text-sm mt-2">
          Please enter a valid YouTube URL.
        </p>
      )}

      {/* Spacer */}
      {videoUrl && isValidYouTubeUrl && <div className="my-4" />}

      {/* ReactPlayer */}
      {videoUrl && isValidYouTubeUrl && (
        <div className="rounded-lg overflow-hidden" style={{ width: "100%", height: playerDimensions.height }}>
          <ReactPlayer
            url={videoUrl}
            controls={true}
            width="100%"
            height="100%"
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
