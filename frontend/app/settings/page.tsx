"use client";

import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const { theme, toggleTheme, layout, setLayout } = useTheme();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {/* Theme setting */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Appearance</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Current theme: {theme}
        </p>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded bg-slate-600 text-white hover:bg-slate-500"
        >
          Switch to {theme === "light" ? "dark" : "light"} mode
        </button>
      </section>

      {/* Layout setting */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Feeds layout</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Choose how posts appear on the Feeds page.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setLayout("grid")}
            className={`px-4 py-2 rounded border ${
              layout === "grid"
                ? "bg-blue-600 dark:bg-blue-500 text-white dark:text-slate-900 border-blue-600 dark:border-blue-500"
                : "border-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setLayout("list")}
            className={`px-4 py-2 rounded border ${
              layout === "list"
                ? "bg-blue-600 dark:bg-blue-500 text-white dark:text-slate-900 border-blue-600 dark:border-blue-500"
                : "border-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            List
          </button>
        </div>
      </section>

      {/* Hide/show help block */}
      <section>
        <button
          onClick={() => setShowHelp(!showHelp)}
          aria-expanded={showHelp}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {showHelp ? "▼ Hide help" : "▶ Show help"}
        </button>
        {showHelp && (
          <div className="mt-3 p-4 rounded bg-slate-100 dark:bg-slate-700 text-sm">
            <p className="mb-2">
              Your preferences are saved automatically in your browser, so they
              persist when you return.
            </p>
            <p>
              Theme controls light/dark mode. Feeds layout changes how posts are
              arranged on the Feeds page.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}