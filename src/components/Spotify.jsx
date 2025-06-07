import React, { useState, useRef, useEffect } from "react";
import { SquareX } from "lucide-react";

const Spotify = ({ onClose }) => {
  const defaultPlaylistId = "37i9dQZF1DXcBWIGoYBM5M";
  const [inputUrl, setInputUrl] = useState("");
  const [playlistId, setPlaylistId] = useState(defaultPlaylistId);
  const [isClosing, setIsClosing] = useState(false);

  const closeSoundRef = useRef(null);
  const clickSoundRef = useRef(null);

  const handleUrlChange = (e) => {
    setInputUrl(e.target.value);
  };

  const handleLoadPlaylist = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
    }

    const match = inputUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    if (match) {
      setPlaylistId(match[1]);
    } else {
      alert("Please enter a valid Spotify playlist URL.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLoadPlaylist();
    }
  };

  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    if (closeSoundRef.current) {
      closeSoundRef.current.currentTime = 0;
      closeSoundRef.current.play();
    }
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 150);
  };

  if (!visible) return null;

  return (
    <div
      className={`card card-border bg-base-100 w-96 shadow-xl shadow-neutral-950/50 text-base-content p-4 text-center shadow-xl shadow-neutral-950/50
        ${isClosing ? "opacity-0" : "opacity-100"}
      `}
      style={{ willChange: "opacity" }}
    >
      {/* Close Button */}
      <div className="absolute top-0 right-0 m-2">
        <div className="tooltip tooltip-right tooltip-primary" data-tip="Close">
          <button
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={handleClose}
            aria-label="Close Spotify"
          >
            <SquareX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sounds */}
      <audio
        ref={closeSoundRef}
        src="/sounds/notebook-close-83836.mp3"
        preload="auto"
      />
      <audio
        ref={clickSoundRef}
        src="/sounds/mouse-click-sound.mp3"
        preload="auto"
      />

      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-4 permanent-marker text-center">
        Spotify
      </h1>

      {/* URL Input */}
      <div className="form-control text-center mb-4 pb-4 space-y-2">
        <p className="text-sm text-white mb-4">Paste your playlist here:</p>
        <input
          type="text"
          placeholder="https://open.spotify.com/playlist/..."
          value={inputUrl}
          onChange={handleUrlChange}
          onKeyDown={handleKeyDown}
          className="input input-bordered w-full bg-base-100 text-sm p-2"
        />
        <button
          onClick={handleLoadPlaylist}
          className="btn btn-primary shadow-lg shadow-primary/50 w-full text-sm"
        >
          Load Playlist
        </button>
      </div>

      {/* Spotify Embed */}
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}`}
        width="100%"
        height="380"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="rounded-box"
      ></iframe>
    </div>
  );
};

export default Spotify;
