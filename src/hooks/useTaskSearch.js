import { useState, useEffect, useMemo } from "react";
import {
  isTaskInList,
  loadFromStorage,
  saveSearchTerm,
  loadSearchHistory,
} from "../utils/storage";

export const useTaskSearch = (taskData, showFavoritesOnly) => {
  const [query, setQuery] = useState("");
  const [searchedTasks, setSearchedTasks] = useState([]);
  const [lastSearch, setLastSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => loadSearchHistory());

  useEffect(() => {
    if (hasSearched && lastSearch) {
      performSearch(true);
    }
  }, [taskData, showFavoritesOnly, lastSearch, hasSearched]);

  const performSearch = (isReRun = false) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!isReRun) {
      setLastSearch(trimmedQuery);
    }

    if (!trimmedQuery) {
      setHasSearched(false);
      setSearchedTasks([]);
      return;
    }

    setHasSearched(true);

    // ghost tasks from local storage
    const ghostList = (loadFromStorage("performedTasks") || [])
      .filter((task) => task?.title)
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
    hasSearched,
    lastSearch,
    searchHistory,
    performSearch,
  };
};
