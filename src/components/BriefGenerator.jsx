import React, { useState, useRef, useEffect } from "react";
import { ClipboardCopy, Mail, FileText, SquareX } from "lucide-react";

const getRandomElement = (arr) =>
  arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : "Unknown";

function BriefGenerator({ onClose }) {
  const [brief, setBrief] = useState(null);
  const [viewMode, setViewMode] = useState("email");
  const [copied, setCopied] = useState(false);

  const [themes, setThemes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [colorSchemes, setColorSchemes] = useState([]);
  const [types, setTypes] = useState([]);

  const [error, setError] = useState(null);

  const audioContextRef = useRef(null);
  const closeSoundRef = useRef(null);
  const clickSoundRef = useRef(null);

  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = ctx;

    // Load close sound
    fetch("/sounds/notebook-close-83836.mp3")
      .then((res) => res.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        closeSoundRef.current = decoded;
      })
      .catch(console.error);

    // Load mouse click sound
    fetch("/sounds/mouse-click-sound.mp3")
      .then((res) => res.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        clickSoundRef.current = decoded;
      })
      .catch(console.error);

    return () => ctx.close();
  }, []);

  const playCloseSound = () => {
    if (audioContextRef.current && closeSoundRef.current) {
      const src = audioContextRef.current.createBufferSource();
      src.buffer = closeSoundRef.current;
      src.connect(audioContextRef.current.destination);
      src.start();
    }
  };

  const playMouseClickSound = () => {
    if (audioContextRef.current && clickSoundRef.current) {
      const src = audioContextRef.current.createBufferSource();
      src.buffer = clickSoundRef.current;
      src.connect(audioContextRef.current.destination);
      src.start();
    }
  };

  useEffect(() => {
    fetch(
      "https://api.sheety.co/0337e63773886d0c15210cef555f9929/artfocus/briefGenerator"
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json) => {
        console.log("Fetched JSON:", json);

        const data = json.briefGenerator || json.sheet1 || []; // check multiple possibilities

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No usable data found in response");
        }

        const unique = (arr) => [
          ...new Set(arr.filter((val) => val && val.trim() !== "")),
        ];

        setThemes(unique(data.map((item) => item.themes)));
        setGenres(unique(data.map((item) => item.genres)));
        setCharacters(unique(data.map((item) => item.characters)));
        setEnvironments(unique(data.map((item) => item.environments)));
        setColorSchemes(unique(data.map((item) => item.colorSchemes)));
        setTypes(unique(data.map((item) => item.types)));
      })
      .catch((err) => {
        console.error("Failed to fetch brief data:", err);
        setError("Failed to fetch brief data. Check console for details.");
      });
  }, []);

  const generateBrief = () => {
    playMouseClickSound();
    const newBrief = {
      theme: getRandomElement(themes),
      genre: getRandomElement(genres),
      character: getRandomElement(characters),
      environment: getRandomElement(environments),
      colorScheme: getRandomElement(colorSchemes),
      type: getRandomElement(types),
    };

    const dateStr = new Date().toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const header = {
      from: "curiousclient@example.com",
      to: "artist@studio.com",
      subject: `Request: ${newBrief.type}`,
      date: dateStr,
    };
    const body = `Hi there,\n\nI hope this message finds you well! I'm looking to commission a ${newBrief.type.toLowerCase()} for an upcoming project. The theme should be ${newBrief.theme.toLowerCase()}, blending elements of ${newBrief.genre.toLowerCase()} with a strong presence of a ${newBrief.character.toLowerCase()} character.\n\nThe setting should take place in a ${newBrief.environment.toLowerCase()} environment, and I'd like the overall color scheme to feel very ${newBrief.colorScheme.toLowerCase()}.\n\nLet me know if you need any more details!\n\nBest,\nA Curious Client`;

    setBrief({ ...newBrief, header, body });
    setViewMode("email");
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!brief) return;
    const fullText = `From: ${brief.header.from}\nTo: ${brief.header.to}\nSubject: ${brief.header.subject}\nDate: ${brief.header.date}\n\n${brief.body}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const exportTXT = () => {
    if (!brief) return;
    const content = `From: ${brief.header.from}\nTo: ${brief.header.to}\nSubject: ${brief.header.subject}\nDate: ${brief.header.date}\n\n${brief.body}`;
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "creative-brief.txt";
    link.click();
  };

  return (
    <div className="card card-border bg-base-100 w-96 shadow-xl shadow-neutral-950/50 text-base-content p-4">
      {/* Close icon */}
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

      <h1 className="text-2xl font-bold text-white text-center mb-4 permanent-marker">
        Brief Generator
      </h1>
      <p className="text-sm text-white text-center mb-4">
        Challenge yourself with a new project!
      </p>
      {error && (
        <p className="text-red-400 text-xs text-center mb-2">{error}</p>
      )}
      <button
        onClick={generateBrief}
        className="btn btn-primary shadow-lg shadow-primary/50 mb-4"
      >
        Generate Brief
      </button>

      {brief && (
        <div className="bg-white rounded-md shadow overflow-hidden text-sm text-gray-800 relative">
          {viewMode === "email" ? (
            <>
              <div className="flex items-start px-4 py-5 border-b">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="Client"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">{brief.header.from}</div>
                  <div className="text-xs text-gray-500">
                    to <span className="text-gray-700">{brief.header.to}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{brief.header.date}</div>
              </div>
              <div className="px-4 py-2 border-b">
                <h2 className="text-base font-semibold">
                  {brief.header.subject}
                </h2>
              </div>
              <div className="px-4 py-4 whitespace-pre-wrap leading-relaxed">
                {brief.body}
              </div>
            </>
          ) : (
            <div className="bg-base-300 text-white p-4">
              <div className="mb-2">
                <span className="badge badge-primary">Theme:</span>{" "}
                {brief.theme}
              </div>
              <div className="mb-2">
                <span className="badge badge-primary">Genre:</span>{" "}
                {brief.genre}
              </div>
              <div className="mb-2">
                <span className="badge badge-primary">Character:</span>{" "}
                {brief.character}
              </div>
              <div className="mb-2">
                <span className="badge badge-primary">Environment:</span>{" "}
                {brief.environment}
              </div>
              <div className="mb-2">
                <span className="badge badge-primary">Color Scheme:</span>{" "}
                {brief.colorScheme}
              </div>
              <div className="mb-2">
                <span className="badge badge-primary">Type:</span> {brief.type}
              </div>
            </div>
          )}

          <div
            className={`flex justify-between items-center px-4 py-2 ${
              viewMode === "email"
                ? "bg-white border-t border-gray-200"
                : "bg-base-300"
            }`}
          >
            <div className="space-x-2">
              <button
                onClick={copyToClipboard}
                className={`btn btn-xs ${
                  viewMode === "email"
                    ? "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
                    : "btn-outline btn-primary"
                }`}
              >
                <ClipboardCopy className="w-4 h-4 mr-1 inline" />
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={exportTXT}
                className={`btn btn-xs ${
                  viewMode === "email"
                    ? "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
                    : "btn-outline btn-primary"
                }`}
              >
                <FileText className="w-4 h-4 mr-1 inline" />
                .txt
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setViewMode(viewMode === "email" ? "summary" : "email")
                }
                className={`btn btn-xs ${
                  viewMode === "email"
                    ? "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
                    : "btn-outline btn-primary"
                }`}
              >
                <Mail className="w-4 h-4 mr-1 inline" />
                {viewMode === "email" ? "Summary" : "Email"}
              </button>
              <button
                onClick={() => {
                  playCloseSound();
                  setBrief(null);
                }}
                className={`btn btn-xs ${
                  viewMode === "email"
                    ? "bg-white border border-gray-300 text-red-500 hover:bg-gray-50"
                    : "btn-outline btn-error"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BriefGenerator;
