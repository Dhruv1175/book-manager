"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import DarkModeToggle from "@/components/DarkModeToggle";
import UserProfileDropdown from "@/components/UserProfileDropDown";
import AddBookModal from "@/components/AddBookModal";
import { BookTypes, Status } from "@/types";
import {
  ArrowLeft,
  Search,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Library,
  Edit2,
  Trash2,
  Loader2,
  X,
  Plus,
  Tag as TagIcon,
} from "lucide-react";

const modalInputClass =
  "w-full px-3.5 py-2.5 text-sm rounded-lg bg-white text-slate-900 placeholder:text-slate-400 border border-black/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all";

export default function BooksPage() {
  const [books, setBooks] = useState<BookTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingBook, setEditingBook] = useState<BookTypes | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editStatus, setEditStatus] = useState<Status>("Want to Read");
  const [editTags, setEditTags] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        if (res.ok) {
          const data: BookTypes[] = await res.json();
          setBooks(data);
        }
      } catch (err) {
        console.error("Failed to load books:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const handleBookAdded = (newBook: BookTypes) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    books.forEach((b) => b.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [books]);

  const stats = useMemo(() => {
    return {
      total: books.length,
      reading: books.filter((b) => b.status === "Reading").length,
      completed: books.filter((b) => b.status === "Completed").length,
      wantToRead: books.filter((b) => b.status === "Want to Read").length,
    };
  }, [books]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesStatus =
        selectedStatus === "All" || book.status === selectedStatus;
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => book.tags?.includes(tag));

      return matchesStatus && matchesSearch && matchesTags;
    });
  }, [books, selectedStatus, searchQuery, selectedTags]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this book from your shelf?"))
      return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b._id !== id));
      } else {
        alert("Failed to delete book.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (book: BookTypes) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditStatus(book.status);
    setEditTags(book.tags ? book.tags.join(", ") : "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setIsUpdating(true);
    const updatedTagArray = editTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch(`/api/books/${editingBook._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          author: editAuthor,
          status: editStatus,
          tags: updatedTagArray,
        }),
      });

      if (res.ok) {
        const { book: updatedBook } = await res.json();
        setBooks((prev) =>
          prev.map((b) => (b._id === updatedBook._id ? updatedBook : b))
        );
        setEditingBook(null);
      } else {
        alert("Failed to update book.");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusStyle = (status: Status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Reading":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Want to Read":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-main)]">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-xs font-semibold hover:border-[var(--accent)] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              My Reading Shelf
            </span>
          </div>

          <div className="flex items-center gap-6">
            <DarkModeToggle />
            <UserProfileDropdown />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-10 pt-32 pb-24 flex flex-col gap-10">
        <section className="flex flex-col gap-6">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Library Books</h1>
              <p className="text-sm text-[var(--text-main)]/60 mt-1.5">
                Manage, filter, and track your personal reading catalog.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Book</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                <Library className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-main)]/50">Total Books</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-main)]/50">Reading</p>
                <p className="text-xl font-bold">{stats.reading}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-main)]/50">Completed</p>
                <p className="text-xl font-bold">{stats.completed}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-main)]/50">Want to Read</p>
                <p className="text-xl font-bold">{stats.wantToRead}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border)]">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {["All", "Reading", "Completed", "Want to Read"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                    selectedStatus === status
                      ? "bg-[var(--accent)] text-white shadow-sm"
                      : "text-[var(--text-main)]/60 hover:text-[var(--text-main)] hover:bg-[var(--bg)]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-main)]/40" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-[var(--bg)] text-[var(--text-main)] placeholder:text-slate-400 border border-black/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="flex items-start gap-2 flex-wrap text-xs">
              <span className="flex items-center gap-1.5 text-[var(--text-main)]/50 font-medium mr-1 h-7">
                <TagIcon className="w-3.5 h-3.5" /> Tags:
              </span>

              {allTags.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    aria-pressed={isActive}
                    className={`px-2.5 py-1 rounded-md border font-mono transition-all ${
                      isActive
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-semibold"
                        : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-main)]/60 hover:text-[var(--text-main)]"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}

              {selectedTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTags([])}
                  className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-600 font-semibold flex items-center gap-1"
                >
                  Clear {selectedTags.length} tag{selectedTags.length > 1 ? "s" : ""}
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </section>

        <section>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-[var(--text-main)]/50 gap-3">
              <Loader2 className="w-7 h-7 animate-spin" />
              <p className="text-sm font-medium">Fetching your library…</p>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[var(--accent)]/40 transition-all duration-300"
                >
                  <div className="relative w-full aspect-[3/4] bg-[var(--bg)] overflow-hidden">
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt={book.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[var(--text-main)]/25 gap-2">
                        <BookOpen className="w-10 h-10" />
                        <span className="text-xs font-semibold leading-tight line-clamp-3">
                          {book.title}
                        </span>
                      </div>
                    )}
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md ${getStatusStyle(
                        book.status
                      )}`}
                    >
                      {book.status}
                    </span>
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openEditModal(book)}
                        title="Edit book"
                        className="p-1.5 rounded-lg bg-[var(--bg-card)]/90 backdrop-blur-md text-[var(--text-main)]/70 hover:text-[var(--accent)] shadow-sm transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(book._id)}
                        disabled={deletingId === book._id}
                        title="Delete book"
                        className="p-1.5 rounded-lg bg-[var(--bg-card)]/90 backdrop-blur-md text-[var(--text-main)]/70 hover:text-rose-600 shadow-sm transition-colors"
                      >
                        {deletingId === book._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 gap-2.5 p-4">
                    <div>
                      <h3 className="font-bold text-[15px] text-[var(--text-main)] line-clamp-2 leading-snug group-hover:text-[var(--accent)] transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-[var(--text-main)]/60 line-clamp-1 mt-0.5">
                        by {book.author}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-col gap-2 pt-2 border-t border-[var(--border)]/60">
                      {book.tags && book.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {book.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg)] text-[var(--text-main)]/60 font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-[10px] text-[var(--text-main)]/40 font-mono">
                        Added {new Date(book.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]/50 space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-[var(--text-main)]/30" />
              <h3 className="font-bold text-base">No books found</h3>
              <p className="text-xs text-[var(--text-main)]/60 max-w-sm mx-auto">
                Try clearing search filters or add a new book to your shelf.
              </p>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all mt-2"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Book
              </button>
            </div>
          )}
        </section>
      </main>
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBookAdded={handleBookAdded}
      />
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <h3 className="font-bold text-lg">Edit book details</h3>
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="p-1.5 rounded-lg text-[var(--text-main)]/50 hover:text-[var(--text-main)] hover:bg-[var(--bg)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50 mb-2">
                  Book title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
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
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className={modalInputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50 mb-2">
                  Reading status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Status)}
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
                  value={editTags}
                  placeholder="Fiction, Sci-Fi, Favorites"
                  onChange={(e) => setEditTags(e.target.value)}
                  className={modalInputClass}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2.5 text-sm font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--bg)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md disabled:opacity-60 flex items-center gap-1.5 transition-all"
                >
                  {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="py-8 bg-[var(--text-main)]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col items-center gap-2">
          <div className="text-sm text-[var(--bg)]/60">
            &copy; {new Date().getFullYear()} WordMark. All rights reserved. Avatar Icons by <a href="https://www.flaticon.com/free-icons/avatar" title="avatar icons">Flat Icons</a>
          </div>
        </div>
      </footer>
    </div>
  );
}