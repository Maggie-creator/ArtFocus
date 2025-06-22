import React, { useState, useEffect, useRef } from "react";
import { Trash2, SquareX } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

function TaskTracker({ onClose, isSoundOn }) {
  const [taskInput, setTaskInput] = useState("");
  const [selectedTab, setSelectedTab] = useState("work");
  const [tasks, setTasks] = useState({
    work: [],
    personal: [],
    education: [],
  });
  const [visible, setVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const closeSoundRef = useRef(null);
  const clickSoundRef = useRef(null);
  const tablistRef = useRef(null); // For keyboard navigation

  useEffect(() => {
    const storedTasks = localStorage.getItem("taskTrackerData");
    let tasksToLoad = { work: [], personal: [], education: [] };
    if (storedTasks) {
      tasksToLoad = JSON.parse(storedTasks);
    }

    let idsWereAdded = false;
    Object.keys(tasksToLoad).forEach((category) => {
      if (Array.isArray(tasksToLoad[category])) {
        tasksToLoad[category].forEach((task) => {
          if (
            !Object.prototype.hasOwnProperty.call(task, "id") ||
            task.id === undefined
          ) {
            // Fixed hasOwnProperty
            task.id = uuidv4();
            idsWereAdded = true;
          }
        });
      }
    });

    if (idsWereAdded) {
      localStorage.setItem("taskTrackerData", JSON.stringify(tasksToLoad));
    }
    setTasks(tasksToLoad);
  }, []);

  useEffect(() => {
    localStorage.setItem("taskTrackerData", JSON.stringify(tasks));
  }, [tasks]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setTaskInput("");
  };

  const addTask = () => {
    if (taskInput.trim()) {
      if (clickSoundRef.current && isSoundOn) {
        clickSoundRef.current.currentTime = 0;
        clickSoundRef.current
          .play()
          .catch((error) =>
            console.error("Error playing TaskTracker click sound:", error)
          );
      }
      setTasks((prev) => ({
        ...prev,
        [selectedTab]: [
          ...prev[selectedTab],
          { id: uuidv4(), text: taskInput, completed: false },
        ],
      }));
      setTaskInput("");
    }
  };

  const toggleTask = (id) => {
    setTasks((prev) => ({
      ...prev,
      [selectedTab]: prev[selectedTab].map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const deleteTask = (id) => {
    setTasks((prev) => ({
      ...prev,
      [selectedTab]: prev[selectedTab].filter((task) => task.id !== id),
    }));
  };

  const deleteAllTasks = () => {
    setTasks((prev) => ({
      ...prev,
      [selectedTab]: [],
    }));
  };

  const handleClose = () => {
    if (closeSoundRef.current && isSoundOn) {
      closeSoundRef.current.currentTime = 0;
      closeSoundRef.current
        .play()
        .catch((error) =>
          console.error("Error playing TaskTracker close sound:", error)
        );
    }
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 150);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const inputBorderClass = {
    work: "border-primary",
    personal: "border-secondary",
    education: "border-accent",
  }[selectedTab];

  const addButtonClass = {
    work: "btn-primary",
    personal: "btn-secondary",
    education: "btn-accent",
  }[selectedTab];

  const handleTabKeyDown = (e) => {
    const tabs = ["work", "personal", "education"];
    const currentIndex = tabs.indexOf(selectedTab);

    if (e.key === "ArrowRight") {
      const nextIndex = (currentIndex + 1) % tabs.length;
      handleTabChange(tabs[nextIndex]);
      // Focus the new tab
      setTimeout(() => tablistRef.current?.children[nextIndex]?.focus(), 0);
    } else if (e.key === "ArrowLeft") {
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      handleTabChange(tabs[prevIndex]);
      // Focus the new tab
      setTimeout(() => tablistRef.current?.children[prevIndex]?.focus(), 0);
    }
  };

  const renderTabContent = (tabKey) => (
    <>
      <div className="flex mb-4 pt-4">
        <input
          type="text"
          aria-label="New task description"
          className={`input input-bordered ${inputBorderClass} text-white flex-1 mr-2`}
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter a task..."
        />
        <button onClick={addTask} className={`btn ${addButtonClass}`}>
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {tasks[tabKey].map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center px-3 py-2 rounded bg-neutral text-white"
          >
            <input
              type="checkbox"
              id={`${task.id}-checkbox`}
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="checkbox mr-2 border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
            />
            <label
              htmlFor={`${task.id}-checkbox`}
              className={`cursor-pointer flex-1 ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.text}
            </label>
            <button
              onClick={() => deleteTask(task.id)}
              className="btn btn-sm btn-square btn-error ml-2"
              aria-label="Delete this task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
      {tasks[tabKey].length > 0 && (
        <button onClick={deleteAllTasks} className="btn btn-error w-full mt-4">
          Delete All
        </button>
      )}
    </>
  );

  if (!visible) return null;

  return (
    <div
      className={`relative z-[60] card card-border bg-base-100 w-96 p-4 shadow-xl shadow-neutral-950/50 text-base-content transition-opacity duration-150 ${
        isClosing ? "opacity-0" : "opacity-100"
      } pb-20`}
    >
      <div className="absolute top-0 right-0 m-2 z-[999]">
        <div
          className="tooltip tooltip-right tooltip-primary z-[999]"
          data-tip="Close"
        >
          <button
            className="cursor-pointer text-red-500 hover:text-red-700 z-[999]"
            onClick={handleClose}
            aria-label="Close Task Tracker"
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

      {/* Tabs */}
      <h1 className="text-2xl font-semibold mb-4 text-center permanent-marker p-4">
        To-Do List
      </h1>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Task categories"
        className="flex justify-center gap-2 mb-4 flex-wrap"
        ref={tablistRef}
        onKeyDown={handleTabKeyDown}
        tabIndex={0} // Make tablist focusable
      >
        {["work", "personal", "education"].map(
          (
            tab // Removed unused 'index'
          ) => (
            <button
              key={tab}
              role="tab"
              id={`tab-${tab}`}
              aria-controls={`tabpanel-${tab}`}
              aria-selected={selectedTab === tab}
              onClick={() => handleTabChange(tab)}
              className={`badge badge-soft cursor-pointer px-4 py-2 text-sm ${
                selectedTab === tab
                  ? `badge-${
                      tab === "work"
                        ? "primary"
                        : tab === "personal"
                        ? "secondary"
                        : "accent"
                    }`
                  : "bg-ghost"
              }`}
              tabIndex={selectedTab === tab ? 0 : -1} // Manage focus
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      <div
        role="tabpanel"
        id={`tabpanel-${selectedTab}`}
        aria-labelledby={`tab-${selectedTab}`}
      >
        {renderTabContent(selectedTab)}
      </div>
    </div>
  );
}

export default TaskTracker;
