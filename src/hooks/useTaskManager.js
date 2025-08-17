// This is a custom hook for managing tasks in a todo application.
// It provides functionality to add, update, delete, mark tasks as done, and restore tasks.
// It also handles the state of the current task being edited and confirmation dialogs.

// hooks/useTaskManager.js
import { useState, useEffect } from "react";
import {
  addTaskToList,
  removeTaskFromList,
  cleanFavoriteTasks,
  isTaskInList,
} from "../utils/storage";

export const useTaskManager = (initialTasks = []) => {
  const [taskData, setTaskData] = useState(initialTasks);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(taskData));
  }, [taskData]);

  const handleAddOrUpdate = (task) => {
    const index = taskData.findIndex((item) => item.id === task.id);
    const updatedData =
      index === -1
        ? [task, ...taskData]
        : [...taskData.slice(0, index), task, ...taskData.slice(index + 1)];
    setTaskData(updatedData);
    setCurrentTask(null);
  };

  const handleDelete = (id) => {
    const isGhost = isTaskInList("performedTasks", id);
    const updated = taskData.filter((task) => task.id !== id);
    if (isGhost) {
      removeTaskFromList("performedTasks", id);
      setTaskData(updated);
      return;
    }
    setTaskData(updated);
    cleanFavoriteTasks(updated);
  };

  const handleMarkDone = (task) => {
    const updatedTasks = taskData.filter((t) => t.id !== task.id);
    setTaskData(updatedTasks);
    localStorage.setItem("data", JSON.stringify(updatedTasks));

    const completedTask = {
      ...task,
      title: `${task.title} (Completed!)`,
    };

    addTaskToList("performedTasks", completedTask);
    cleanFavoriteTasks(updatedTasks);
  };

  const handleRestore = (task) => {
    removeTaskFromList("performedTasks", task.id);
    const { isGhost, ...cleanTask } = task;
    const restoredTask = {
      ...cleanTask,
      completed: false,
      title: cleanTask.title.replace(/\s*\(Completed!\)\s*$/i, ""),
    };

    const nextTaskData = [
      ...taskData.filter((t) => t.id !== restoredTask.id),
      restoredTask,
    ];
    setTaskData(nextTaskData);
  };

  return {
    taskData,
    setTaskData,
    currentTask,
    setCurrentTask,
    handleAddOrUpdate,
    handleDelete,
    handleMarkDone,
    handleRestore,
  };
};
