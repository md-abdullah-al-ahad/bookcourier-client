import { createContext, useContext, useEffect, useState } from "react";

// Create Theme Context
const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = "bookcourier-theme";

/**
 * Theme Provider Component
 * Manages theme state and provides theme toggle functionality
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const [theme, setTheme] = useState(savedTheme || "light");

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    // Update state
    setTheme(newTheme);

    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    // Update data-theme attribute
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * Custom hook to use Theme Context
 * @returns {object} Theme context value
 * @throws {Error} If used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
