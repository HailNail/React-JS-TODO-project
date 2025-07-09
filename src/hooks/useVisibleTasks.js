// hooks/useVisibleTasks.js

// This is a custom hook that filters and manages the visibility of tasks in a todo application.
// It combines the main task list with ghost tasks (completed tasks) and applies search and favorite filters.

import { isTaskInList, loadFromStorage } from "../utils/storage";

export const useVisibleTasks = ({
  taskData,
  searchedTasks,
  hasSearched,
  searchPerformedQuery,
  showFavoritesOnly,
}) => {
  const ghostList = (loadFromStorage("performedTasks") || [])
    .filter((task) => task && task.title)
    .map((task) => ({ ...task, isGhost: true }));
  const filteredGhosts = hasSearched // Only filter ghosts if a search has been initiated
    ? ghostList.filter((task) => {
        // Use searchPerformedQuery here for the actual filtering
        const currentSearchTerm = searchPerformedQuery.toLowerCase();
        const rawTitle = task.title
          .replace(/\s*\(Completed!\)\s*$/i, "")
          .toLowerCase();
        const completedIndicator = "(completed!)";

        return (
          rawTitle.includes(currentSearchTerm) ||
          completedIndicator.includes(currentSearchTerm)
        );
      })
    : ghostList; // If no search active, show all ghost tasks

  const baseList = hasSearched ? searchedTasks : taskData;
  const allVisibleTasks = [...baseList, ...filteredGhosts];

  const filteredList = showFavoritesOnly
    ? allVisibleTasks.filter((task) => isTaskInList("favoriteTasks", task.id))
    : allVisibleTasks;

  return {
    ghostList,
    filteredGhosts,
    allVisibleTasks,
    filteredList,
  };
};
