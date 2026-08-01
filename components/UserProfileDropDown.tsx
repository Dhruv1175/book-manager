"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, LogOut, Loader2, Check } from "lucide-react";
import { publicUser, UserTypes } from "@/types";

const AVATAR_OPTIONS: { id: UserTypes["avatar"]; label: string; url: string }[] = [
  { id: "openBook", label: "Open Book", url: "/assets/book.png" },
  { id: "readingLamp", label: "Reading Lamp", url: "/assets/library.png" },
  { id: "owl", label: "Wise Owl", url: "/assets/owl.png" },
  { id: "bookMark", label: "Bookmark", url: "/assets/book-mark.png" },
];

export default function UserProfileDropdown() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<publicUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatarChange = async (newAvatar: UserTypes["avatar"]) => {
    if (!user || user.avatar === newAvatar || updatingAvatar) return;

    setUpdatingAvatar(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: newAvatar }),
      });

      if (res.ok) {
        setUser((prev) => (prev ? { ...prev, avatar: newAvatar } : null));
      }
    } catch (err) {
      console.error("Failed to update avatar:", err);
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const handleSignOut = async () => {
    setSignOutLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setSignOutLoading(false);
    }
  };

  const currentAvatarObj =
    AVATAR_OPTIONS.find((a) => a.id === user?.avatar) || AVATAR_OPTIONS[0];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[var(--bg-card)] transition-colors outline-none"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--bg-card)]">
          {loadingUser ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--text-main)]/40" />
            </div>
          ) : (
            <Image
              src={currentAvatarObj.url}
              alt={user?.name || "User avatar"}
              fill
              sizes="32px"
              className="object-cover"
            />
          )}
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-[var(--bg)] bg-emerald-500" />
        </div>

        <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate text-[var(--text-main)]">
          {user ? `Hi, ${user.name.split(" ")[0]}` : "User"}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[var(--text-main)]/50 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl z-50 overflow-hidden shadow-[0_16px_40px_-12px_rgba(0,0,0,0.2)] bg-[var(--bg-card)] border border-[var(--border)]">

          <div className="p-5 border-b border-[var(--border)]">
            <p className="text-sm font-bold text-[var(--text-main)] truncate">
              {user?.name || "Guest User"}
            </p>
            <p className="text-xs text-[var(--text-main)]/50 truncate mt-0.5">
              {user?.email || "No email available"}
            </p>
          </div>
          <div className="p-5 border-b border-[var(--border)]">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50 mb-3.5">
              Change avatar
              {updatingAvatar && <Loader2 className="w-3 h-3 animate-spin" />}
            </p>

            <div className="flex items-center justify-between gap-2">
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = user?.avatar === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleAvatarChange(opt.id)}
                    disabled={updatingAvatar}
                    title={opt.label}
                    className={`relative w-11 h-11 rounded-full border-2 overflow-hidden transition-all duration-150 outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-card)] disabled:opacity-50 ${
                      isSelected
                        ? "border-[var(--accent)] scale-105 shadow-sm"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={opt.url}
                      alt={opt.label}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                    {isSelected && (
                      <span className="absolute -bottom-0.5 -right-0.5 bg-[var(--accent)] text-white p-0.5 rounded-full ring-2 ring-[var(--bg-card)] z-10">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-2.5">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signOutLoading}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold rounded-lg text-rose-600 hover:bg-rose-500/10 disabled:opacity-60 transition-colors"
            >
              {signOutLoading ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                <LogOut className="w-4 h-4 shrink-0" />
              )}
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}