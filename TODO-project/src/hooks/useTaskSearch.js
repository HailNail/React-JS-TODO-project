// hooks/useTaskSearch.js

// This is a custom hook for searching tasks in a todo application.
// It provides functionality to filter tasks based on a search query and manage search history.

import { useState } from "react";
import {
  isTaskInList,
  loadSearchHistory,
  saveSearchTerm,
} from "../utils/storage";

export const useTaskSearch = (taskData, showFavoritesOnly) => {
  const [query, setQuery] = useState("");
  const [searchedTasks, setSearchedTasks] = useState([]);
  const [searchPerformedQuery, setSearchPerformedQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => loadSearchHistory());

  const handleSearch = () => {
    const trimmedQuery = query.trim().toLowerCase();
    setSearchPerformedQuery(trimmedQuery);

    if (!trimmedQuery) {
      setHasSearched(false);
      setSearchedTasks([]);
      return;
    }

    setHasSearched(true);

    const result = taskData
      .filter((task) =>
        showFavoritesOnly ? isTaskInList("favoriteTasks", task.id) : true
      )
      .filter((task) => task.title.toLowerCase().includes(trimmedQuery));

    setSearchedTasks(result);
    saveSearchTerm(trimmedQuery);
    setSearchHistory(loadSearchHistory());
  };

  return {
    query,
    setQuery,
    searchPerformedQuery,
    searchedTasks,
    hasSearched,
    searchHistory,
    handleSearch,
  };
};
