// This hook manages the search functionality, including search history and query handling.
// It provides methods to filter search history, handle keyboard navigation, and manage focus state.
// It also handles click events outside the search component to dismiss the search dropdown.

import { useState, useEffect, useRef } from "react";

export const useSearchUI = (history, query, setQuery, onSearch) => {
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);

  const filteredHistory = query
    ? history.filter((term) => term.toLowerCase().includes(query.toLowerCase()))
    : history;

  // outside click closes dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeDropdown = () => {
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
          onSearch?.();
        }
        closeDropdown();
        break;
      case "Escape":
        e.preventDefault();
        closeDropdown();
        e.target.blur();
        break;
    }
  };

  const handleHistoryClick = (term) => {
    setQuery(term);
    closeDropdown();
  };

  return {
    isFocused,
    setIsFocused,
    highlightIndex,
    filteredHistory,
    containerRef,
    handleKeyDown,
    handleHistoryClick,
    showHistory: isFocused && filteredHistory.length > 0,
  };
};
