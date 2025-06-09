// components/Pomodoro.jsx
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, SquareX } from "lucide-react";

function Pomodoro({ onClose }) {
  const [isRunning, setIsRunning] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(workDuration * 60);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [visible, setVisible] = useState(true);

  const timerRef = useRef(null);
  const closeSoundRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(workDuration * 60);
  }, [workDuration]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            new Audio("/bell.mp3").play();
            const nextSession = isWorkTime ? breakDuration : workDuration;
            setIsWorkTime(!isWorkTime);
            setSecondsLeft(nextSession * 60);
            setIsRunning(true);
            return nextSession * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isWorkTime, breakDuration, workDuration]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

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
      className={`card card-border bg-base-100 w-96 p-4 relative transition-opacity duration-150 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Close Button */}
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

      {/* Close Sound */}
      <audio
        ref={closeSoundRef}
        src="/sounds/notebook-close-83836.mp3"
        preload="auto"
      />

      <h1 className="text-2xl font-semibold mb-4 text-center permanent-marker">
        {isWorkTime ? "Work Timer" : "Break Timer"}
      </h1>

      <div className="text-center text-5xl font-bold mb-4 text-primary">
        {formatTime(secondsLeft)}
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="btn btn-primary"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setSecondsLeft(workDuration * 60);
            setIsWorkTime(true);
          }}
          className="btn btn-secondary"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <label className="label">
            <span className="label-text">Work Duration (minutes)</span>
          </label>
          <input
            type="number"
            className="input input-bordered border-primary w-full"
            value={workDuration}
            onChange={(e) => setWorkDuration(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Break Duration (minutes)</span>
          </label>
          <input
            type="number"
            className="input input-bordered border-primary w-full"
            value={breakDuration}
            onChange={(e) => setBreakDuration(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
