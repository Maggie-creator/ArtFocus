// components/TaskTracker.jsx
import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

function TaskTracker() {
  const [taskInput, setTaskInput] = useState("");
  const [selectedTab, setSelectedTab] = useState("work");

  const [tasks, setTasks] = useState({
    work: [],
    personal: [],
    education: [],
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("taskTrackerData");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("taskTrackerData", JSON.stringify(tasks));
  }, [tasks]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setTaskInput("");
  };

  const addTask = () => {
    if (taskInput.trim()) {
      setTasks((prev) => ({
        ...prev,
        [selectedTab]: [
          ...prev[selectedTab],
          { id: Date.now(), text: taskInput, completed: false },
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

  const renderTabContent = (tabKey) => (
    <>
      <div className="flex mb-4">
        <input
          type="text"
          className="input input-bordered flex-1 mr-2"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter a task..."
        />
        <button onClick={addTask} className="btn btn-primary">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {tasks[tabKey].map((task) => (
          <li
            key={task.id}
            className={`flex justify-between items-center px-3 py-2 rounded ${
              task.completed
                ? "bg-success text-white"
                : "bg-neutral text-white"
            }`}
          >
            <span
              className={`cursor-pointer flex-1 ${
                task.completed ? "line-through" : ""
              }`}
              onClick={() => toggleTask(task.id)}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="checkbox mr-2 border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
              />
              {task.text}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="btn btn-sm btn-square btn-error ml-2"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
      {tasks[tabKey].length > 0 && (
        <button
          onClick={deleteAllTasks}
          className="btn btn-error btn-sm w-full mt-4"
        >
          Delete All
        </button>
      )}
    </>
  );

  return (
    <div className="card card-border bg-base-100 w-96 p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center permanent-marker">
        To-Do List
      </h1>

      <div className="tabs tabs-lift">
        {/* Work Tab */}
        <input
          type="radio"
          name="my_tabs_3"
          className={`tab ${selectedTab === "work" ? "tab-active border-primary" : ""}`}
          aria-label="Work"
          checked={selectedTab === "work"}
          onChange={() => handleTabChange("work")}
        />
        <div
          className={`tab-content bg-base-100 border p-6 ${
            selectedTab === "work" ? "border-primary" : "border-base-300"
          }`}
        >
          {selectedTab === "work" && renderTabContent("work")}
        </div>

        {/* Personal Tab */}
        <input
          type="radio"
          name="my_tabs_3"
          className={`tab ${selectedTab === "personal" ? "tab-active border-primary" : ""}`}
          aria-label="Personal"
          checked={selectedTab === "personal"}
          onChange={() => handleTabChange("personal")}
        />
        <div
          className={`tab-content bg-base-100 border p-6 ${
            selectedTab === "personal" ? "border-primary" : "border-base-300"
          }`}
        >
          {selectedTab === "personal" && renderTabContent("personal")}
        </div>

        {/* Education Tab */}
        <input
          type="radio"
          name="my_tabs_3"
          className={`tab ${selectedTab === "education" ? "tab-active border-primary" : ""}`}
          aria-label="Education"
          checked={selectedTab === "education"}
          onChange={() => handleTabChange("education")}
        />
        <div
          className={`tab-content bg-base-100 border p-6 ${
            selectedTab === "education" ? "border-primary" : "border-base-300"
          }`}
        >
          {selectedTab === "education" && renderTabContent("education")}
        </div>
      </div>
    </div>
  );
}

export default TaskTracker;
