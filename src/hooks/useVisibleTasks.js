// hooks/useVisibleTasks.js

// This is a custom hook that filters and manages the visibility of tasks in a todo application.
// It combines the main task list with ghost tasks (completed tasks) and applies search and favorite filters.

import { isTaskInList, loadFromStorage } from "../utils/storage";

export const useVisibleTasks = ({
  taskData,
  searchedTasks,
  hasSearched,

  showFavoritesOnly,
}) => {
  const ghostList = (loadFromStorage("performedTasks") || [])
    .filter((task) => task && task.title)
    .map((task) => ({ ...task, isGhost: true }));

  const combinedList = hasSearched
    ? searchedTasks
    : [...taskData, ...ghostList];

  const filteredList = showFavoritesOnly
    ? combinedList.filter((task) => isTaskInList("favoriteTasks", task.id))
    : combinedList;

  return {
    ghostList,
    filteredList,
  };
};
