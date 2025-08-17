// hooks/useUIState.js

// This is a custom hook that manages the UI state of a todo application.
// It provides functionality to toggle favorites, manage form visibility, and handle view modes.
// It also manages the state of the guide modal and collapsible sections.
// It returns the current UI state and setters for updating the state.
import { useState, useCallback } from "react";

export const useUIState = () => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isFormVisible, setFormVisible] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isTaskFormDirty, setIsTaskFormDirty] = useState(false);
  const [isDiscardConfirmVisible, setIsDiscardConfirmVisible] = useState(false);

  const toggleFavorites = useCallback(
    () => setShowFavoritesOnly((prev) => !prev),
    []
  );

  const toggleViewAndCollapse = useCallback(() => {
    setIsListView((prev) => {
      const newView = !prev;
      setIsCollapsed(newView);
      return newView;
    });
  }, []);

  return {
    uiState: {
      showFavoritesOnly,
      isFormVisible,
      isListView,
      isCollapsed,
      showGuide,
      taskToDelete,
      isConfirmDeleteVisible,
      isTaskFormDirty,
      isDiscardConfirmVisible,
    },
    uiSetters: {
      setShowFavoritesOnly,
      setFormVisible,
      toggleFavorites,
      toggleViewAndCollapse,
      setShowGuide,
      setTaskToDelete,
      setIsConfirmDeleteVisible,
      setIsTaskFormDirty,
      setIsDiscardConfirmVisible,
    },
  };
};
