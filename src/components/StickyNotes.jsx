import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal, SquareX, Plus } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";

const ColorOptions = {
  Green: "#b2ff9e",
  Blue: "#9cdbff",
  Purple: "#d6b3ff",
  Pink: "#eb84c4",
  Orange: "#ffd59c",
  Yellow: "#feff9c",
};

function StickyNotes({ onClose }) {
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("sticky_notes")) || []
  );
  const [activeTab, setActiveTab] = useState(0);
  const [editingTab, setEditingTab] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [visible, setVisible] = useState(true);
  const closeSoundRef = useRef(null);

  useEffect(() => {
    if (!notes.length) {
      const defaultNote = {
        id: uuidv4(),
        name: "Note 1",
        text: "",
        color: ColorOptions.Yellow,
      };
      setNotes([defaultNote]);
      setActiveTab(0);
      localStorage.setItem("sticky_notes", JSON.stringify([defaultNote]));
    }
  }, []);

  const saveToStorage = (updated) => {
    setNotes(updated);
    localStorage.setItem("sticky_notes", JSON.stringify(updated));
  };

  const addNote = () => {
    const newName = `Note ${notes.length + 1}`;
    const newNote = {
      id: uuidv4(),
      name: newName,
      text: "",
      color: ColorOptions.Yellow,
    };
    const updated = [...notes, newNote];
    saveToStorage(updated);
    setActiveTab(updated.length - 1);
  };

  const removeNote = (id) => {
    const idx = notes.findIndex((n) => n.id === id);
    const updated = notes.filter((n) => n.id !== id);

    if (!updated.length) {
      const defaultNote = {
        id: uuidv4(),
        name: "Note 1",
        text: "",
        color: ColorOptions.Yellow,
      };
      saveToStorage([defaultNote]);
      setActiveTab(0);
      return;
    }

    saveToStorage(updated);
    if (activeTab >= updated.length) setActiveTab(updated.length - 1);
    else if (idx === activeTab) setActiveTab(Math.max(0, activeTab - 1));
  };

  const editNoteField = (id, field, value) => {
    saveToStorage(
      notes.map((n) => (n.id === id ? { ...n, [field]: value } : n))
    );
  };

  const handleTabRename = (idx, newName) => {
    editNoteField(notes[idx].id, "name", newName || `Note ${idx + 1}`);
    setEditingTab(null);
  };

  const handleClose = () => {
    closeSoundRef.current?.play().catch(error => console.error("Error playing close sound in StickyNotes:", error));
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 150);
  };

  if (!visible) return null;
  const current = notes[activeTab];

  return (
    <div
      className={`card card-border bg-base-100 w-96 p-4 relative transition-opacity duration-150 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <audio
        ref={closeSoundRef}
        src="/sounds/notebook-close-83836.mp3"
        preload="auto"
      />

      <div className="absolute top-2 right-2 z-10">
        <div className="tooltip tooltip-right tooltip-primary" data-tip="Close">
          <button
            onClick={handleClose}
            aria-label="Close StickyNotes"
            className="text-red-500 hover:text-red-700"
          >
            <SquareX className="w-6 h-6" />
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-4 text-center permanent-marker p-4">
        Sticky Notes
      </h1>

      {/* Badges as tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {notes.map((note, idx) => (
          <div key={note.id}>
            {editingTab === idx ? (
              <input
                className="input input-sm input-bordered"
                defaultValue={note.name}
                autoFocus
                onBlur={(e) => handleTabRename(idx, e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleTabRename(idx, e.target.value)
                }
              />
            ) : (
              <div
                className={`badge cursor-pointer ${
                  activeTab === idx ? "" : "badge-ghost"
                }`}
                style={{ backgroundColor: note.color, color: "black" }}
                onClick={() => setActiveTab(idx)}
                onDoubleClick={() => setEditingTab(idx)}
              >
                {note.name}
              </div>
            )}
          </div>
        ))}

        {/* Plus badge */}
        <div
          className="badge badge-outline badge-secondary cursor-pointer"
          style={{
            height: "1.75rem",
            padding: "0 0.45rem",
            display: "flex",
            alignItems: "center",
          }}
          onClick={addNote}
          aria-label="Add new note"
        >
          <Plus className="w-4 h-3" />
        </div>
      </div>

      {current && (
        <Sticky
          key={current.id}
          id={current.id}
          text={current.text}
          color={current.color}
          removeNote={removeNote}
          editNote={editNoteField}
        />
      )}
    </div>
  );
}

function Sticky({ id, text, color, removeNote, editNote }) {
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleSelector = (e) => {
    e.stopPropagation();
    setShowColorSelector((v) => !v);
  };
  const selectColor = (c) => {
    editNote(id, "color", c);
    setShowColorSelector(false);
  };
  const displayColors = () => (
    <div className="mb-1 flex flex-wrap gap-1 p-1">
      {Object.values(ColorOptions).map((c) => (
        <div
          key={c}
          className="h-6 w-6 rounded cursor-pointer border border-base-100 shadow-lg shadow-neutral-950/50"
          style={{ backgroundColor: c }}
          onClick={() => selectColor(c)}
        />
      ))}
    </div>
  );

  return (
    <div
      className="card bg-primary text-primary-content shadow-xl shadow-neutral-950/50 w-full h-full transition-opacity duration-150"
      style={{ backgroundColor: color, color: "black", minHeight: "20rem" }}
    >
      <div className="card-body font-playpen-sans p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="tooltip tooltip-right tooltip-secondary" data-tip="Delete note">
              <button onClick={() => removeNote(id)} aria-label="Delete note">
                <SquareX className="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
            <div className="tooltip tooltip-right tooltip-secondary" data-tip="Change note's color">
              <MoreHorizontal
                className="cursor-pointer"
                onClick={handleToggleSelector}
                aria-label="Change color"
              />
            </div>
          </div>
        </div>
        {showColorSelector && displayColors()}
        {isEditing ? (
          <TextareaAutosize
            className="w-full h-full bg-transparent resize-none focus:outline-none text-black playpen-sans mb-2"
            minRows={3}
            maxRows={8}
            placeholder="Add a note"
            value={text}
            onChange={(e) => editNote(id, "text", e.target.value)}
            autoFocus
          />
        ) : (
          <div
            className="cursor-text text-black mb-2 playpen-sans"
            onClick={() => setIsEditing(true)}
          >
            <ReactMarkdown>{text || "*Click to write your note*"}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default StickyNotes;
