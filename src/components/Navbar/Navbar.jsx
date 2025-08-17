// Navbar.jsx

// This component represents the navigation bar of the application
// It includes a logo, a search bar, and buttons for toggling favorites, views, and help.
// It also allows users to switch between light and dark themes.

import "./Navbar.css";
import { useRef, useContext, useState } from "react";
import { BsGrid3X3GapFill, BsListUl } from "react-icons/bs";
import { IoMdStarOutline, IoMdStar } from "react-icons/io";
import { FiHelpCircle } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import SearchBar from "./SearchBar";
import ThemeToggle from "../ThemeContext/ThemeToggle";
import { useClickOutside } from "../../hooks/useClickOutside";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import logo from "../../assets/logo.png";
import logoTwo from "../../assets/logoTwo.png";

const Navbar = ({
  searchManager,
  uiState,
  onToggleFavorites,
  onToggleView,
  onShowHelp,
}) => {
  const { query, setQuery, performSearch, searchHistory } = searchManager;
  const { showFavoritesOnly, isListView } = uiState;

  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useClickOutside(menuRef, () => setMenuOpen(false));

  // Config for nav buttons
  const navButtons = [
    {
      key: "help",
      label: "Help",
      icon: <FiHelpCircle />,
      onClick: onShowHelp,
    },
    {
      key: "favorites",
      label: "Toggle favorites",
      icon: showFavoritesOnly ? <IoMdStar /> : <IoMdStarOutline />,
      onClick: onToggleFavorites,
    },
    {
      key: "view",
      label: `Switch to ${
        isListView ? "Grid View + Expanded" : "List View + Collapsed"
      }`,
      icon: isListView ? <BsGrid3X3GapFill /> : <BsListUl />,
      onClick: onToggleView,
    },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      {/* Logo */}
      <div className="nav-logo">
        <img
          src={theme === "dark" ? logoTwo : logo}
          alt="App Logo"
          className="nav-logo-image"
        />
      </div>

      {/* Search */}
      <div className="nav-container">
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={() => {
            performSearch();
            searchRef.current?.focusInput();
          }}
          history={searchHistory}
          ref={searchRef}
        />
      </div>

      {/* Action buttons */}
      <div
        ref={menuRef}
        className={`nav-icons ${menuOpen ? "open" : ""}`}
        id="nav-buttons"
        role="menubar"
      >
        {navButtons.map(({ key, label, icon, onClick }) => (
          <button
            key={key}
            className="nav-icon"
            onClick={onClick}
            title={label}
            aria-label={label}
            role="menuitem"
          >
            {icon}
          </button>
        ))}
        <ThemeToggle />
      </div>

      {/* Mobile menu toggle */}
      <button
        className="hamburger-menu-toggle nav-icon"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="nav-buttons"
      >
        <RxHamburgerMenu />
      </button>
    </nav>
  );
};

export default Navbar;
