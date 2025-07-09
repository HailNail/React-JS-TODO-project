// This module provides utility functions to manage task storage in localStorage.

const saveStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// - `loadFromStorage`: Loads data from localStorage, returning an empty array if no data exists.

export const loadFromStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// - `addTaskToList`: Adds a task to a list stored under a specified key, ensuring no duplicates and limiting the list to the latest 10 tasks.

export const addTaskToList = (key, task) => {
  const list = loadFromStorage(key);
  if (list.find((t) => t.id === task.id)) return list; // Prevent duplicates

  const updated = [task, ...list.slice(0, 9)]; // Keep only the latest 10 tasks
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

// - `removeTaskFromList`: Removes a task by ID from the list stored under a specified key.

export const removeTaskFromList = (key, taskId) => {
  const list = loadFromStorage(key);
  const updated = list.filter((task) => task.id !== taskId);
  saveStorage(key, updated);
  return updated;
};

// - `isTaskInList`: Checks if a task by ID exists in the list stored under a specified key.

export const isTaskInList = (key, taskId) => {
  const list = loadFromStorage(key);
  return list.some((task) => task.id === taskId);
};

export const cleanFavoriteTasks = (existingTasks) => {
  const allFavorites = loadFromStorage("favoriteTasks") || [];

  const cleaned = allFavorites.filter((favTask) =>
    existingTasks.some((task) => task.id === favTask.id)
  );

  localStorage.setItem("favoriteTasks", JSON.stringify(cleaned));
};

const SEARCH_HISTORY_KEY = "searchHistory";

// Get the history list
export function loadSearchHistory() {
  return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
}

// Add a new term to history
export function saveSearchTerm(term) {
  const history = loadSearchHistory();
  if (!history.includes(term)) {
    const updated = [term, ...history].slice(0, 5); // limit to 5 recent
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  }
}
