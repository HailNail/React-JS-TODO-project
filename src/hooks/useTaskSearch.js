import { useState, useEffect } from "react";
// Add loadSearchHistory to the import list
import {
  isTaskInList,
  loadFromStorage,
  saveSearchTerm,
  loadSearchHistory,
} from "../utils/storage";

export const useTaskSearch = (taskData, showFavoritesOnly) => {
  const [query, setQuery] = useState("");
  const [searchedTasks, setSearchedTasks] = useState([]);
  const [searchPerformedQuery, setSearchPerformedQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => loadSearchHistory()); // This line was causing the error

  useEffect(() => {
    if (hasSearched && searchPerformedQuery) {
      handleSearch(true);
    }
  }, [taskData, showFavoritesOnly, searchPerformedQuery, hasSearched]);

  const handleSearch = (isReRun = false) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!isReRun) {
      setSearchPerformedQuery(trimmedQuery);
    }

    if (!trimmedQuery) {
      setHasSearched(false);
      setSearchedTasks([]);
      return;
    }

    setHasSearched(true);

    const ghostList = (loadFromStorage("performedTasks") || [])
      .filter((task) => task && task.title)
      .map((task) => ({ ...task, isGhost: true }));

    const allSearchableTasks = [...taskData, ...ghostList];

    const result = allSearchableTasks.filter((task) => {
      if (showFavoritesOnly && !isTaskInList("favoriteTasks", task.id)) {
        return false;
      }

      const taskTitle = task.title.toLowerCase();
      if (task.isGhost) {
        const rawTitle = taskTitle.replace(/\s*\(completed!\)\s*$/i, "");
        return (
          rawTitle.includes(trimmedQuery) || taskTitle.includes(trimmedQuery)
        );
      }
      return taskTitle.includes(trimmedQuery);
    });

    setSearchedTasks(result);
    if (!isReRun) {
      saveSearchTerm(trimmedQuery);
      setSearchHistory(loadSearchHistory());
    }
  };

  return {
    query,
    setQuery,
    searchedTasks,
    setSearchedTasks,
    searchPerformedQuery,
    setSearchPerformedQuery,
    hasSearched,
    setHasSearched,
    searchHistory,
    handleSearch,
  };
};
