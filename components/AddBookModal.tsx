"use client";

import React, { useState } from "react";
import { BookTypes, Status } from "@/types";
import { X, Loader2, Plus } from "lucide-react";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: (newBook: BookTypes) => void;
}

const modalInputClass =
  "w-full px-3.5 py-2.5 text-sm rounded-lg bg-white text-slate-900 placeholder:text-slate-400 border border-black/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all";

export default function AddBookModal({
  isOpen,
  onClose,
  onBookAdded,
}: AddBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<Status>("Want to Read");
  const [tags, setTags] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          status,
          tags: tagArray,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onBookAdded(data.book);
        setTitle("");
        setAuthor("");
        setStatus("Want to Read");
        setTags("");
        onClose();
      } else {
        setError(data.message || "Failed to create book.");
      }
    } catch (err) {
      console.error("Create book error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg">Add new book</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-main)]/50 hover:text-[var(--text-main)] hover:bg-[var(--bg)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg px-3.5 py-2.5 text-xs font-mono bg-rose-500/10 border border-rose-500/20 text-rose-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50 mb-2">
              Book title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. The Great Gatsby"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={modalInputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50 mb-2">
              Author
            </label>
            <input
              type="text"
              required
              placeholder="e.g. F. Scott Fitzgerald"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={modalInputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50 mb-2">
              Reading status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className={modalInputClass}
            >
              <option value="Want to Read">Want to Read</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              placeholder="e.g. Fiction, Classic, Must Read"
              onChange={(e) => setTags(e.target.value)}
              className={modalInputClass}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--bg)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md disabled:opacity-60 flex items-center gap-1.5 transition-all"
            >
              {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Add to Shelf
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}