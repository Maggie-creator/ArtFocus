import React, { useState, useRef, useEffect } from "react";
import {
  ClipboardList,
  Loader,
  CheckCircle2,
  Flag,
  SquareX,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const statusOptions = [
  "Not started",
  "In Research",
  "On Track",
  "Delayed",
  "Completed",
];
const priorityOptions = ["Low", "Medium", "High"];

const KanbanBoard = ({ onClose, isSoundOn }) => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [selectedColumn, setSelectedColumn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "",
    status: "",
  });

  const clickSoundRef = useRef(null);
  const closeSoundRef = useRef(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem("kanbanTasks");
    if (storedTasks) {
      let parsedTasks = JSON.parse(storedTasks);
      if (parsedTasks && typeof parsedTasks === "object") {
        let idsAdded = false;
        Object.keys(parsedTasks).forEach((columnKey) => {
          if (Array.isArray(parsedTasks[columnKey])) {
            parsedTasks[columnKey].forEach((task) => {
              if (!task.hasOwnProperty("id") || task.id === undefined) {
                task.id = uuidv4();
                idsAdded = true;
              }
            });
          }
        });
        if (idsAdded) {
          localStorage.setItem("kanbanTasks", JSON.stringify(parsedTasks));
        }
      }
      setTasks(parsedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addOrUpdateTask = () => {
    if (!newTaskData.title.trim()) return;
    if (isSoundOn) new Audio("/sounds/click.mp3").play();

    setTasks((prev) => {
      const updatedColumn = [...prev[selectedColumn]];
      if (isEditing) {
        const taskIndexToUpdate = updatedColumn.findIndex(
          (task) => task.id === editingTaskId
        );
        if (taskIndexToUpdate !== -1) {
          updatedColumn[taskIndexToUpdate] = {
            ...updatedColumn[taskIndexToUpdate],
            ...newTaskData,
            id: editingTaskId,
          };
        }
      } else {
        const newTask = { ...newTaskData, id: uuidv4() };
        updatedColumn.push(newTask);
      }
      return {
        ...prev,
        [selectedColumn]: updatedColumn,
      };
    });

    setNewTaskData({
      title: "",
      description: "",
      deadline: "",
      priority: "",
      status: "",
    });
    setShowModal(false);
    setIsEditing(false);
    setEditingTaskId(null);
    setEditingColumn(null);
  };

  const deleteTask = (columnKey, taskId) => {
    if (isSoundOn) new Audio("/sounds/click.mp3").play();
    setTasks((prev) => ({
      ...prev,
      [columnKey]: prev[columnKey].filter((task) => task.id !== taskId),
    }));
  };

  const onDragStart = (e, task, fromColumnKey) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
    e.dataTransfer.setData("from", fromColumnKey);
  };

  const onDrop = (e, to) => {
    const task = JSON.parse(e.dataTransfer.getData("task"));
    const fromColumnKey = e.dataTransfer.getData("from");

    if (!task || fromColumnKey === to) return;

    setTasks((prev) => {
      const updatedFromTasks = prev[fromColumnKey].filter(
        (t) => t.id !== task.id
      );
      const taskToAdd = { ...task };

      return {
        ...prev,
        [fromColumnKey]: updatedFromTasks,
        [to]: [...prev[to], taskToAdd],
      };
    });

    if (isSoundOn) new Audio("/sounds/click.mp3").play();
  };

  const allowDrop = (e) => e.preventDefault();

  const openEditModal = (taskToEdit, columnKey) => {
    setSelectedColumn(columnKey);
    setNewTaskData(taskToEdit);
    setIsEditing(true);
    setEditingTaskId(taskToEdit.id);
    setEditingColumn(columnKey);
    setShowModal(true);
    if (isSoundOn) new Audio("/sounds/click.mp3").play();
  };

  const handleClose = () => {
    if (closeSoundRef.current) closeSoundRef.current.play();
    setTimeout(() => {
      onClose();
    }, 150);
  };

  const columns = [
    {
      key: "todo",
      label: "To Do",
      icon: <ClipboardList className="w-7 h-7 mr-2 text-primary" />,
      borderColor: "border-primary",
      textColor: "text-primary",
      buttonColor: "btn-primary",
    },
    {
      key: "inProgress",
      label: "In Progress",
      icon: <Loader className="w-7 h-7 mr-2 text-secondary" />,
      borderColor: "border-secondary",
      textColor: "text-secondary",
      buttonColor: "btn-secondary",
    },
    {
      key: "done",
      label: "Done",
      icon: <CheckCircle2 className="w-7 h-7 mr-2 text-success" />,
      borderColor: "border-success",
      textColor: "text-success",
      buttonColor: "btn-success",
    },
  ];

  return (
    <div className="relative flex flex-col items-center p-4 bg-base-100 border border-base-100 shadow-xl shadow-neutral-950/50 rounded-box mx-1 w-190">
      <audio
        ref={clickSoundRef}
        src="/sounds/mouse-click-sound.mp3"
        preload="auto"
      />
      <audio
        ref={closeSoundRef}
        src="/sounds/notebook-close-83836.mp3"
        preload="auto"
      />

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

      <h1 className="text-2xl font-bold text-white mb-4 permanent-marker">
        Kanban Board
      </h1>

      <div className="flex flex-wrap gap-4 w-full my-4">
        {columns.map(
          ({ key, label, icon, borderColor, textColor, buttonColor }) => (
            <div
              key={key}
              className={`card bg-base-300 text-neutral-content rounded-box border ${borderColor} p-5 shadow-lg min-h-[300px] flex-1 min-w-[238px]`}
              onDrop={(e) => onDrop(e, key)}
              onDragOver={allowDrop}
            >
              <div className="flex justify-between items-center mb-4">
                <div
                  className={`flex items-center gap-2 text-xl font-bold ${textColor}`}
                >
                  {icon}
                  {label}
                </div>
                <button
                  className={`btn btn-md ${buttonColor} btn-outline`}
                  onClick={() => {
                    setSelectedColumn(key);
                    setShowModal(true);
                    if (isSoundOn) new Audio("/sounds/click.mp3").play();
                  }}
                >
                  +
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {tasks[key].map((task) => (
                  <div
                    key={task.id}
                    className="relative bg-neutral text-white rounded p-2 shadow flex flex-col gap-2 cursor-pointer"
                    draggable
                    onDragStart={(e) => onDragStart(e, task, key)}
                    onClick={() => openEditModal(task, key)}
                  >
                    <div className="p-2 flex justify-between items-start">
                      <div className="flex gap-2">
                        {task.status && (
                          <div className="badge badge-outline badge-info">
                            {task.status}
                          </div>
                        )}
                        {task.priority && (
                          <div className="badge badge-outline badge-warning">
                            {task.priority}
                          </div>
                        )}
                      </div>
                      <div
                        className="tooltip tooltip-left tooltip-secondary"
                        data-tip="Delete task"
                      >
                        <button
                          className="text-red-500 hover:text-red-400 rounded-full w-6 h-6 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(key, task.id);
                          }}
                        >
                          <SquareX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="pt-2 pl-2 font-bold text-base truncate max-w-full">
                      {task.title.length > 100
                        ? task.title.slice(0, 100) + "..."
                        : task.title}
                    </div>
                    <div className="px-2 text-sm text-gray-100 truncate max-w-full">
                      {task.description.length > 100
                        ? task.description.slice(0, 100) + "..."
                        : task.description}
                    </div>
                    <div className="divider"></div>
                    {task.deadline && (
                      <div className="pb-2 pl-2 font-bold text-xs text-gray-100">
                        Deadline: {task.deadline}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {showModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box bg-neutral text-white rounded-2xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Task" : "New Task"}
            </h3>
            <input
              type="text"
              placeholder="Title"
              className="input input-bordered border-primary input-md w-full mb-3"
              value={newTaskData.title}
              onChange={(e) =>
                setNewTaskData({ ...newTaskData, title: e.target.value })
              }
            />
            <textarea
              className="textarea textarea-bordered border-primary w-full h-24 text-sm mb-3"
              placeholder="Description"
              value={newTaskData.description}
              onChange={(e) =>
                setNewTaskData({ ...newTaskData, description: e.target.value })
              }
            />
            <div className="mb-3 flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-500" />
              <input
                type="text"
                placeholder="Deadline (dd/mm/yyyy)"
                className="input input-sm input-bordered border-primary w-full"
                value={newTaskData.deadline}
                onChange={(e) =>
                  setNewTaskData({ ...newTaskData, deadline: e.target.value })
                }
              />
            </div>
            <div className="mb-4 flex gap-2">
              <div className="w-1/2">
                <label className="text-sm font-semibold mb-1 block">
                  Priority
                </label>
                <select
                  className="select select-bordered border-primary w-full"
                  value={newTaskData.priority}
                  onChange={(e) =>
                    setNewTaskData({
                      ...newTaskData,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="">Select priority</option>
                  {priorityOptions.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label className="text-sm font-semibold mb-1 block">
                  Status
                </label>
                <select
                  className="select select-bordered border-primary w-full"
                  value={newTaskData.status}
                  onChange={(e) =>
                    setNewTaskData({
                      ...newTaskData,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="">Select status</option>
                  {statusOptions.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  if (isSoundOn) new Audio("/sounds/click.mp3").play();
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={addOrUpdateTask}
              >
                {isEditing ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default KanbanBoard;
