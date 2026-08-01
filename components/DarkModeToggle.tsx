"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(stored ? stored === "dark" : sys);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode, mounted]);
  if (!mounted) return <div className="w-11 h-6" />;

  return (
    <button
      onClick={() => setDarkMode((d) => !d)}
      aria-label="Toggle dark mode"
      aria-pressed={darkMode}
      className={`relative flex-shrink-0 w-11 h-6 rounded-full border transition-colors duration-200 ${
        darkMode
          ? "bg-[var(--accent)] border-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
          : "bg-[var(--bg-card)] border-[var(--border)]"
      }`}
    >
      <span
        className={`absolute top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-white transition-all duration-200 ease-[cubic-bezier(0.34,1.2,0.64,1)] ${
          darkMode ? "left-[22px]" : "left-0.5"
        }`}
      >
        {darkMode ? (
          <Moon className="w-3 h-3 text-[var(--accent)]" />
        ) : (
          <Sun className="w-3 h-3 text-[var(--text-main)]/50" />
        )}
      </span>
    </button>
  );
};

export default DarkModeToggle;