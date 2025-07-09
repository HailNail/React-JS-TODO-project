import { createContext, useState, useEffect } from "react";

// This context provides theme management for the application
// It allows toggling between light and dark themes and persists the selected theme in localStorage.

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Function to get initial theme from localStorage or system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference if no theme is saved
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Update localStorage and data-theme attribute whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
