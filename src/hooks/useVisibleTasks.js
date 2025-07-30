import { useMemo } from "react";
import { isTaskInList, loadFromStorage } from "../utils/storage";

export const useVisibleTasks = ({
  taskData, // This should be the direct taskData state from useTaskManager
  searchedTasks,
  hasSearched,
  showFavoritesOnly,
}) => {
  // Use useMemo to re-calculate ghostList only when taskData changes
  const ghostList = useMemo(() => {
    // We filter performedTasks to ensure they exist and have titles
    // and then mark them as ghost.
    return (loadFromStorage("performedTasks") || [])
      .filter((task) => task && task.title)
      .map((task) => ({ ...task, isGhost: true }));
  }, [taskData]); // Recalculate if taskData changes (implies performedTasks might have changed via markDone/restore)

  const combinedList = useMemo(() => {
    // Combine active tasks (from taskData) and ghost tasks (from ghostList)
    // First, get all active tasks (not in performedTasks list)
    const activeTasks = taskData.filter(
      (task) => !isTaskInList("performedTasks", task.id)
    );

    // Then combine active tasks with ghost tasks.
    // Ensure uniqueness if a task might appear in both lists by accident (though it shouldn't with correct logic)
    const allCombined = [...activeTasks, ...ghostList];

    // If there's a search, use searchedTasks. Otherwise, use the combined list.
    return hasSearched ? searchedTasks : allCombined;
  }, [taskData, ghostList, hasSearched, searchedTasks]); // Dependencies for combinedList

  const filteredList = useMemo(() => {
    let listToFilter = combinedList;

    // Apply favorite filter if needed
    if (showFavoritesOnly) {
      listToFilter = listToFilter.filter((task) =>
        isTaskInList("favoriteTasks", task.id)
      );
    }

    return listToFilter;
  }, [combinedList, showFavoritesOnly]); // Dependencies for filteredList

  return {
    ghostList, // This is just the list of performed tasks
    filteredList, // This is the list of tasks to be displayed in TaskList
  };
};
