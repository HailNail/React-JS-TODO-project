// components/SearchBar/SearchBar.js

// This component represents the search bar in the navigation bar
// It allows users to search for tasks, view search history, and trigger search actions.
// It also provides a way to focus the input field programmatically from the parent component.

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useSearchUI } from "../../hooks/useSearchUI";
import "./Navbar.css";

const SearchBar = forwardRef(
  ({ query, setQuery, onSearch, history = [] }, ref) => {
    const inputRef = useRef(null);
    const buttonRef = useRef(null);
    const highlightedRef = useRef(null);

    const {
      isFocused,
      setIsFocused,
      highlightIndex,
      filteredHistory,
      containerRef,
      handleKeyDown,
      handleHistoryClick,
      showHistory,
    } = useSearchUI(history, query, setQuery, onSearch);

    useImperativeHandle(ref, () => ({
      focusInput: () => inputRef.current?.focus(),
    }));

    useEffect(() => {
      if (highlightedRef.current) {
        highlightedRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, [highlightIndex]);

    const triggerPulse = () => {
      if (buttonRef.current) {
        buttonRef.current.classList.remove("pulse");
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
        <div className="search-bar" ref={containerRef}>
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
          >
            <IoSearchSharp />
          </button>
        </div>
        {showHistory && (
          <ul className="search-history">
            {filteredHistory.map((term, i) => (
              <li
                key={i}
                ref={highlightIndex === i ? highlightedRef : null}
                className={highlightIndex === i ? "highlighted" : ""}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleHistoryClick(term);
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
