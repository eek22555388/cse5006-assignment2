"use client";

import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded bg-slate-600 text-white hover:bg-slate-500"
      aria-label="Toggle light and dark theme"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}