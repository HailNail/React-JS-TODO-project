// Navbar.jsx
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

// This component represents the navigation bar of the application
// It includes a logo, a search bar, and buttons for toggling favorites, views, and help.
// It also allows users to switch between light and dark themes.

const Navbar = ({
  searchManager,
  uiState,
  onToggleFavorites,
  onToggleView,
  onShowHelp,
}) => {
  const { query, setQuery, handleSearch, searchHistory } = searchManager;

  const { showFavoritesOnly, isListView } = uiState;

  const [menuOpen, setMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setMenuOpen(false));
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img
          src={theme === "dark" ? logoTwo : logo}
          alt={`Logo - ${theme === "dark" ? "Dark" : "Light"} Mode`}
          className="nav-logo-image"
        />
      </div>

      <div className="nav-container">
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={() => {
            handleSearch();
            searchRef.current?.focusInput();
          }}
          history={searchHistory}
          ref={searchRef}
        />
      </div>
      <div
        ref={menuRef}
        className={`nav-icons ${menuOpen ? "open" : ""}`}
        id="nav-buttons"
      >
        <button className="nav-icon" onClick={onShowHelp}>
          <FiHelpCircle />
        </button>

        <button className="nav-icon" onClick={onToggleFavorites}>
          {showFavoritesOnly ? <IoMdStar /> : <IoMdStarOutline />}
        </button>

        <button
          className="nav-icon"
          onClick={onToggleView}
          title={`Switch to ${
            isListView ? "Grid View + Expanded" : "List View + Collapsed"
          }`}
        >
          {isListView ? <BsGrid3X3GapFill /> : <BsListUl />}
        </button>

        <ThemeToggle />
      </div>
      <button
        className="hamburger-menu-toggle nav-icon"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation"
      >
        <RxHamburgerMenu />
      </button>
    </nav>
  );
};

export default Navbar;
