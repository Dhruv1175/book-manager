"use client"

import Link from "next/link";
import React, { useEffect } from "react";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Home() {
  const [darkMode, setDarkMode] = React.useState(false);
  const books = [
    { height: 88, width: 24, color: "#0369a1", rotate: 0 },
    { height: 96, width: 30, color: "#b45309", rotate: -2 },
    { height: 68, width: 20, color: "#334155", rotate: 0 },
    { height: 100, width: 26, color: "#4338ca", rotate: 0 },
    { height: 76, width: 22, color: "#78716c", rotate: 0 },
    { height: 92, width: 28, color: "#d97706", rotate: 2 },
    { height: 60, width: 18, color: "#be123c", rotate: 0 },
    { height: 98, width: 24, color: "#0f766e", rotate: 0 },
    { height: 70, width: 20, color: "#57534e", rotate: -1 },
    { height: 84, width: 26, color: "#92400e", rotate: 0 },
    { height: 60, width: 18, color: "#047857", rotate: 0 },
    { height: 94, width: 24, color: "#3730a3", rotate: 1 },
  ];
 useEffect(() => {
    const stored = localStorage.getItem("theme");
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(stored ? stored === "dark" : sys);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
        <div className="container mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
          <div className="font-bold text-xl tracking-tight text-[var(--text-main)]">
            WordMark
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/auth/signup"
              className="text-sm font-medium text-[var(--text-main)]/70 hover:text-[var(--text-main)] transition-colors"
            >
              Sign Up
            </Link>
            <Link
            href="/auth/login"
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-[var(--text-main)] hover:text-[var(--accent)] transition-colors duration-150"
            >
            Login
          </Link>
           <DarkModeToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center container mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center w-full">
          <div className="flex flex-col items-start gap-7 max-w-xl">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-[var(--bg-card)]  text-[var(--accent)]">
              Your reading, remembered
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-[var(--text-main)]">
              A shelf that remembers
              <br />
              what you've read
            </h1>

            <p className="text-lg opacity-70 leading-relaxed">
              Track your reading, revisit highlights, and build a living
              digital library that grows with every page you turn.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
               <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-[var(--text-main)] hover:text-[var(--accent)]  transition-colors duration-150 active:scale-[0.98]"
                >
                Start Your Shelf
                <span className="transition-transform duration-150 group-hover:translate-x-1">
                →
                </span>
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end w-full">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-10 pb-0 overflow-hidden shadow-sm">
              <div
                aria-hidden="true"
                className="select-none pointer-events-none flex items-end justify-center gap-[6px] h-64"
              >
                {books.map((book, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0"
                    style={{
                      height: `${book.height}%`,
                      width: `${book.width}px`,
                      transform: `rotate(${book.rotate}deg)`,
                      transformOrigin: "bottom center",
                    }}
                  >
                    <div
                      className="absolute left-[2px] right-[2px] top-0 h-1.5 rounded-t-[2px] bg-[#F7F2E4]"
                    />
                    <div
                      className="absolute left-0 right-0 top-1.5 bottom-0 rounded-t-[2px] shadow-[inset_2px_0_0_rgba(255,255,255,0.15),inset_-2px_0_0_rgba(0,0,0,0.2)]"
                      style={{ background: book.color }}
                    >
                      <div className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[55%] h-0.5 rounded-full bg-white/45" />
                      <div className="absolute left-1/2 top-[26%] -translate-x-1/2 w-[35%] h-0.5 rounded-full bg-white/30" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-5 rounded-b-sm bg-gradient-to-b from-[#9c7b52] to-[#6b5335] shadow-[0_6px_14px_rgba(0,0,0,0.3)]" />
            </div>
          </div>

        </div>
      </main>

      <footer className="py-10 bg-[var(--text-main)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="container mx-auto px-6 md:px-12 flex flex-col items-center gap-2">
          <div className="text-sm text-[var(--bg)]/60">
            &copy; {new Date().getFullYear()} WordMark. All rights reserved. Avatar Icons by <a href="https://www.flaticon.com/free-icons/avatar" title="avatar icons">Flat Icons</a>
          </div>
        </div>
      </footer>
    </div>
  );
}