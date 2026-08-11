"use client";

import { createContext, useContext, useState, useEffect } from "react";

// 1. Describe the shape of what we're sharing
type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
  layout: string;
  setLayout: (value: string) => void;
};

// 2. Create the context (empty container for now)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. The Provider: holds the state and shares it
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");
  const [layout, setLayout] = useState("grid");

  // On first load, read saved theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
    }
  }, []);
  useEffect(() => {
    const savedLayout = localStorage.getItem("layout");
    if (savedLayout) {
      setLayout(savedLayout);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("layout", layout);
  }, [layout]);

  // Whenever theme changes, apply it to <html> and save it
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, layout, setLayout }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. A helper so components can grab the theme easily
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}