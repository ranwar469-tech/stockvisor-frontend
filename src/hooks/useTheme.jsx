import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
      const stored = localStorage.getItem("theme");
      if (stored) return stored;
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return { theme, toggleTheme };
}
