import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal, SquareX, Plus } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown"; // ✅ FIXED

const ColorOptions = {
  Green: "#b2ff9e",
  Blue: "#9cdbff",
  Purple: "#d6b3ff",
  Pink: "#eb84c4",
  Orange: "#ffd59c",
  Yellow: "#feff9c",
};

const StickyNote = ({ onClose }) => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("sticky_notes");
    return saved ? JSON.parse(saved) : [];
  });

  const closeClickAudioRef = useRef(null);

  useEffect(() => {
    if (notes.length === 0) {
      const defaultNote = {
        id: uuidv4(),
        text: "",
        color: ColorOptions.Yellow,
      };
      const updatedNotes = [defaultNote];
      setNotes(updatedNotes);
      localStorage.setItem("sticky_notes", JSON.stringify(updatedNotes));
    }
  }, []);

  const saveToStorage = (updatedNotes) => {
    setNotes(updatedNotes);
    localStorage.setItem("sticky_notes", JSON.stringify(updatedNotes));
  };

  const addNote = () => {
    const newNote = {
      id: uuidv4(),
      text: "",
      color: ColorOptions.Yellow,
    };
    const updatedNotes = [...notes, newNote];
    saveToStorage(updatedNotes);
  };

  const removeNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    saveToStorage(updatedNotes);
  };

  const editNote = (id, field, value) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, [field]: value } : note
    );
    saveToStorage(updatedNotes);
  };

  const handleClose = () => {
    if (closeClickAudioRef.current) {
      closeClickAudioRef.current.currentTime = 0;
      closeClickAudioRef.current.play();
    }
    setTimeout(onClose, 150);
  };

  return (
    <div className="relative p-4">
      <audio ref={closeClickAudioRef} src="/sounds/notebook-close-83836.mp3" />

      <div
        className="flex flex-col gap-4 rounded-box"
        style={{ background: "transparent" }}
      >
        {notes.map((note, index) => (
          <Sticky
            key={note.id}
            id={note.id}
            text={note.text}
            color={note.color}
            removeNote={removeNote}
            editNote={editNote}
            showAddButton={index === notes.length - 1}
            addNote={addNote}
            showCloseButton={index === 0}
            onClose={handleClose}
          />
        ))}
      </div>
    </div>
  );
};

const Sticky = ({
  id,
  text,
  color,
  removeNote,
  editNote,
  showAddButton,
  addNote,
  showCloseButton,
  onClose,
}) => {
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleSelector = (event) => {
    event.stopPropagation();
    setShowColorSelector(!showColorSelector);
  };

  const selectColor = (selectedColor) => {
    editNote(id, "color", selectedColor);
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
      className="card bg-primary text-primary-content w-96 shadow-xl shadow-neutral-950/50"
      style={{ backgroundColor: color, color: "black" }}
    >
      {showCloseButton && (
        <div className="absolute top-2 right-2 z-10">
          <div className="tooltip tooltip-right tooltip-primary" data-tip="Close">
            <button
              className="cursor-pointer text-red-500 hover:text-red-700"
              onClick={onClose}
            >
              <SquareX className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <div className="card-body font-playpen-sans">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="tooltip tooltip-secondary tooltip-top" data-tip="Delete note">
              <button
                className="cursor-pointer text-red-500 hover:text-red-700"
                onClick={() => removeNote(id)}
              >
                <SquareX className="w-5 h-5" />
              </button>
            </div>

            <div className="tooltip tooltip-secondary tooltip-top" data-tip="Change color">
              <MoreHorizontal className="cursor-pointer" onClick={handleToggleSelector} />
            </div>

            {showAddButton && (
              <div className="tooltip tooltip-secondary tooltip-top" data-tip="Add new note">
                <Plus className="cursor-pointer" onClick={addNote} />
              </div>
            )}
          </div>
        </div>

        {showColorSelector && displayColors()}

        {isEditing ? (
          <TextareaAutosize
            id={`note-${id}`}
            className="w-full bg-transparent resize-none focus:outline-none text-black playpen-sans mb-2"
            minRows={3}
            maxRows={6}
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
            <ReactMarkdown>{text || "*Click to edit note*"}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyNote;
