// components/Pomodoro.jsx
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, SquareX } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
  const tickingSoundRef = useRef(null);
  const serviceBellRef = useRef(null);
  const mouseClickRef = useRef(null);
  const prevIsWorkTimeRef = useRef(isWorkTime);

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

  useEffect(() => {
    if (isRunning && tickingSoundRef.current) {
      tickingSoundRef.current.loop = true;
      tickingSoundRef.current.play().catch(() => {});
    } else if (tickingSoundRef.current) {
      tickingSoundRef.current.pause();
      tickingSoundRef.current.currentTime = 0;
    }
  }, [isRunning]);

  useEffect(() => {
    if (prevIsWorkTimeRef.current !== isWorkTime && !isWorkTime) {
      if (serviceBellRef.current) {
        serviceBellRef.current.play().catch(() => {});
      }
    }
    prevIsWorkTimeRef.current = isWorkTime;
  }, [isWorkTime]);

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

  const handlePlayPause = () => {
    if (mouseClickRef.current) {
      mouseClickRef.current.currentTime = 0;
      mouseClickRef.current.play().catch(() => {});
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    if (mouseClickRef.current) {
      mouseClickRef.current.currentTime = 0;
      mouseClickRef.current.play().catch(() => {});
    }
    setIsRunning(false);
    setSecondsLeft(workDuration * 60);
    setIsWorkTime(true);
  };

  if (!visible) return null;

  return (
    <div
      className={`z-[900] card card-border bg-base-100 w-96 p-4 relative transition-opacity duration-150 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Close Button */}
      <div className="absolute top-0 right-0 m-2 z-[1000]">
        <div className="tooltip tooltip-right tooltip-primary" data-tip="Close">
          <button
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={handleClose}
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
        ref={tickingSoundRef}
        src="/sounds/tickingclock.mp3"
        preload="auto"
      />
      <audio
        ref={serviceBellRef}
        src="/sounds/service-bell-ring-14610.mp3"
        preload="auto"
      />
      <audio
        ref={mouseClickRef}
        src="/sounds/mouse-click-sound.mp3"
        preload="auto"
      />

      <h1 className="text-2xl font-semibold mb-4 text-center permanent-marker p-4">
        {isWorkTime ? "Work Timer" : "Break Timer"}
      </h1>

      {/* Animations */}
      <div className="mb-2">
        <DotLottieReact
          src={
            isWorkTime
              ? "https://lottie.host/e278775a-4154-4d36-80ca-d1a89eca3fab/QQei6vzvj8.lottie"
              : "https://lottie.host/6abf5447-336a-4c8e-9515-9aacb9010ab6/yjZjgWV6ap.lottie"
          }
          loop
          autoplay
          style={{ width: "100%", maxHeight: "200px", margin: "0 auto" }}
        />
      </div>

      {/* Timer */}
      <div className="text-center text-5xl font-bold mb-2 text-primary">
        {formatTime(secondsLeft)}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={handlePlayPause} className="btn btn-primary">
          {isRunning ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
        <button onClick={handleReset} className="btn btn-secondary">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Duration Settings */}
      <div className="mt-4 space-y-2">
        <div>
          <label className="label">
            <span className="label-text mb-2">Work Duration (minutes)</span>
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
            <span className="label-text mb-2 mt-2">
              Break Duration (minutes)
            </span>
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
