// components/SearchBar/SearchBar.js
import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useSearch } from "../../hooks/useSearch";
import "./Navbar.css";

// This component represents the search bar in the navigation bar
// It allows users to search for tasks, view search history, and trigger search actions.
// It also provides a way to focus the input field programmatically from the parent component.

const SearchBar = forwardRef(
  ({ query, setQuery, onSearch, history = [] }, ref) => {
    const inputRef = useRef(null);
    const buttonRef = useRef(null);

    const {
      isFocused,
      setIsFocused,
      highlightIndex,
      filteredHistory,
      containerRef,
      handleKeyDown,
      handleHistoryItemClick,
      showHistory,
    } = useSearch(history, query, setQuery, onSearch);

    // Expose a function to focus the input from the parent component
    useImperativeHandle(ref, () => ({
      focusInput: () => inputRef.current?.focus(),
    }));

    const triggerPulse = () => {
      if (buttonRef.current) {
        buttonRef.current.classList.remove("pulse");
        //offsetWidth is a trick to trigger a DOM reflow, allowing the animation to restart
        void buttonRef.current.offsetWidth;
        buttonRef.current.classList.add("pulse");
      }
    };

    const handleSearchClick = () => {
      onSearch();
      setIsFocused(false);
      triggerPulse();
    };

    return (
      <div className="search-bar-container">
        <div className="search-bar" id="search-bar" ref={containerRef}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isFocused) setIsFocused(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            placeholder="Search tasks..."
          />
          <button
            ref={buttonRef}
            className="search-button"
            onClick={handleSearchClick}
            aria-label="Search"
          >
            <IoSearchSharp />
          </button>
        </div>
        {showHistory && (
          <ul className="search-history">
            {filteredHistory.map((term, i) => (
              <li
                key={i}
                className={highlightIndex === i ? "highlighted" : ""}
                // Use onMouseDown to prevent the input from losing focus before the click is registered
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleHistoryItemClick(term);
                }}
              >
                {term}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

export default SearchBar;
