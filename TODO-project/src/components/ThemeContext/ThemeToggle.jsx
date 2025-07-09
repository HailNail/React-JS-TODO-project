import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      className="nav-icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`} // Good for accessibility
    >
      {/* Conditionally render icons based on the 'theme' state from context */}
      {theme === "dark" ? (
        <MdOutlineLightMode size={24} />
      ) : (
        <MdOutlineDarkMode size={24} />
      )}
    </button>
  );
};

export default ThemeToggle;
