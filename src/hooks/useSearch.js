// This hook manages the search functionality, including search history and query handling.
// It provides methods to filter search history, handle keyboard navigation, and manage focus state.
// It also handles click events outside the search component to dismiss the search dropdown.

import { useState, useEffect, useRef } from "react";

export const useSearch = (history, query, setQuery, onSearch = () => {}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);

  const filteredHistory = query
    ? history.filter((term) => term.toLowerCase().includes(query.toLowerCase()))
    : history;

  // Dismiss search dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeSearch = () => {
    setIsFocused(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev + 1 >= filteredHistory.length ? 0 : prev + 1
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev <= 0 ? filteredHistory.length - 1 : prev - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < filteredHistory.length) {
          setQuery(filteredHistory[highlightIndex]);
        } else {
          onSearch?.(); // safe guard
        }
        closeSearch();
        break;

      case "Escape":
        e.preventDefault();
        closeSearch();
        e.target.blur();
        break;

      default:
        break;
    }
  };

  const handleHistoryItemClick = (term) => {
    setQuery(term);
    closeSearch();
  };

  const showHistory = isFocused && filteredHistory.length > 0;

  return {
    isFocused,
    setIsFocused,
    highlightIndex,
    filteredHistory,
    containerRef,
    handleKeyDown,
    handleHistoryItemClick,
    showHistory,
  };
};
