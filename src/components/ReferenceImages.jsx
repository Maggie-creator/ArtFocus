import React, { useState, useRef, useEffect } from "react";
import { SquareX } from "lucide-react";

const ReferenceImages = ({ onClose }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const imageResizeRef = useRef(null);

  const audioContextRef = useRef(null);
  const clickBufferRef = useRef(null);
  const closeBufferRef = useRef(null);

  const [visible, setVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageData = files.map((file) => ({
      url: URL.createObjectURL(file),
      width: 96,
      height: 96,
    }));

    setImages((prevImages) => [...prevImages, ...imageData]);
  };

  const handleMouseDown = (e, corner, index) => {
    e.preventDefault();
    imageResizeRef.current = { corner, index };
  };

  const handleMouseMove = (e) => {
    if (imageResizeRef.current !== null) {
      const { corner, index } = imageResizeRef.current;
      const imageEl = document.getElementById(`image-wrapper-${index}`);
      const rect = imageEl.getBoundingClientRect();
      let newWidth = rect.width;
      let newHeight = rect.height;

      if (["top-left", "bottom-left"].includes(corner)) {
        newWidth = rect.right - e.clientX;
      } else if (["top-right", "bottom-right"].includes(corner)) {
        newWidth = e.clientX - rect.left;
      }

      if (["top-left", "top-right"].includes(corner)) {
        newHeight = rect.bottom - e.clientY;
      } else if (["bottom-left", "bottom-right"].includes(corner)) {
        newHeight = e.clientY - rect.top;
      }

      setImages((prev) =>
        prev.map((img, i) =>
          i === index
            ? {
                ...img,
                width: Math.max(48, newWidth),
                height: Math.max(48, newHeight),
              }
            : img
        )
      );
    }
  };

  const handleMouseUp = () => {
    imageResizeRef.current = null;
  };

  const playClickSound = () => {
    if (audioContextRef.current && clickBufferRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = clickBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    }
  };

  const playCloseSound = () => {
    if (audioContextRef.current && closeBufferRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = closeBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    }
  };

  const handleClose = () => {
    playCloseSound();
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 150);
  };

  useEffect(() => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    // Load click sound
    fetch("/sounds/mouse-click-sound.mp3")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        clickBufferRef.current = audioBuffer;
      })
      .catch((error) => {
        console.error("Error loading click sound:", error);
      });

    // Load close sound
    fetch("/sounds/notebook-close-83836.mp3")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        closeBufferRef.current = audioBuffer;
      })
      .catch((error) => {
        console.error("Error loading close sound:", error);
      });

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        className={`card card-border bg-base-100 w-96 shadow-xl shadow-neutral-950/50 text-base-content p-4 text-center ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        style={{
          width: 384,
          height: "auto",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Close button */}
        <div className="absolute top-0 right-0 m-2">
          <div
            className="tooltip tooltip-right tooltip-primary"
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

        <h1 className="text-2xl font-semibold mb-4 text-center permanent-marker p-4">
          Reference Images
        </h1>

        <input
          type="file"
          accept="image/*"
          multiple
          className="file-input file-input-bordered w-full mb-2 bg-primary text-white"
          onMouseDown={playClickSound}
          onChange={handleImageUpload}
        />

        {/* Image Grid */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {images.map((image, index) => (
            <div
              key={index}
              id={`image-wrapper-${index}`}
              className="relative group bg-base-200 rounded-lg overflow-hidden"
              style={{
                width: image.width,
                height: image.height,
                flex: "0 0 auto",
                position: "relative",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <img
                src={image.url}
                alt={`Uploaded ${index}`}
                className="w-full h-full object-cover rounded-lg cursor-pointer"
                onClick={() => window.open(image.url, "_blank")}
              />
              <button
                className="absolute top-1 right-1 text-red-500 hover:text-red-400 rounded-full w-4 h-4 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setImages((prev) => prev.filter((_, i) => i !== index));
                }}
              >
                <SquareX className="w-4 h-4" />
              </button>

              {/* Resize Handles */}
              {[
                {
                  corner: "top-left",
                  style: "top-0 left-0 cursor-nwse-resize",
                },
                {
                  corner: "top-right",
                  style: "top-0 right-0 cursor-nesw-resize",
                },
                {
                  corner: "bottom-left",
                  style: "bottom-0 left-0 cursor-nesw-resize",
                },
                {
                  corner: "bottom-right",
                  style: "bottom-0 right-0 cursor-nwse-resize",
                },
              ].map(({ corner, style }, i) => (
                <div
                  key={i}
                  className={`absolute ${style} w-3 h-3 bg-transparent z-20`}
                  onMouseDown={(e) => handleMouseDown(e, corner, index)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full View"
              className="max-h-[90vh] max-w-[90vw] rounded-lg"
            />
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-400 rounded-full w-6 h-6 flex items-center justify-center"
              onClick={() => setSelectedImage(null)}
            >
              <SquareX className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReferenceImages;
