// hooks/useUIState.js

// This is a custom hook that manages the UI state of a todo application.
// It provides functionality to toggle favorites, manage form visibility, and handle view modes.
// It also manages the state of the guide modal and collapsible sections.
// It returns the current UI state and setters for updating the state.
import { useState, useCallback } from "react";

export const useUIState = () => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isFormVisible, setFormVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isListView, setIsListView] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const toggleFavorites = useCallback(
    () => setShowFavoritesOnly((prev) => !prev),
    []
  );

  const toggleViewAndCollapse = useCallback(() => {
    setIsListView((prev) => {
      const newView = !prev;
      setIsCollapsed(newView); // Collapse when switching to list view
      return newView;
    });
  }, []);

  return {
    uiState: {
      showFavoritesOnly,
      isFormVisible,
      showConfirm,
      isListView,
      isCollapsed,
      showGuide,
    },
    uiSetters: {
      setShowFavoritesOnly,
      setFormVisible,
      setShowConfirm,
      toggleFavorites,
      toggleViewAndCollapse,
      setShowGuide,
    },
  };
};
