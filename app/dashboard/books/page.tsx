"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import DarkModeToggle from "@/components/DarkModeToggle";
import UserProfileDropdown from "@/components/UserProfileDropDown";
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
  Filter,
} from "lucide-react";

export default function BooksPage() {
  const [books, setBooks] = useState<BookTypes[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

 
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesStatus =
        selectedStatus === "All" || book.status === selectedStatus;
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag =
        !selectedTag || (book.tags && book.tags.includes(selectedTag));

      return matchesStatus && matchesSearch && matchesTag;
    });
  }, [books, selectedStatus, searchQuery, selectedTag]);

 
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
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Reading":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Want to Read":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-main)]">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
        <div className="container mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
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

      <main className="flex-1 container mx-auto px-6 md:px-12 pt-28 pb-20 space-y-10">
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Library Books</h1>
              <p className="text-sm text-[var(--text-main)]/60 mt-1">
                Manage, filter, and track your personal reading catalog.
              </p>
            </div>
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
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-main)]/50">Reading</p>
                <p className="text-xl font-bold">{stats.reading}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-main)]/50">Completed</p>
                <p className="text-xl font-bold">{stats.completed}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-main)]/50">Want to Read</p>
                <p className="text-xl font-bold">{stats.wantToRead}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="space-y-4">
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
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-main)]/40 hover:text-[var(--text-main)]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
              <span className="flex items-center gap-1 text-[var(--text-main)]/50 font-medium mr-1">
                <TagIcon className="w-3.5 h-3.5" /> Tags:
              </span>
              {selectedTag && (
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-500 font-semibold flex items-center gap-1"
                >
                  Clear Tag Filter <X className="w-3 h-3" />
                </button>
              )}
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? null : tag)
                  }
                  className={`px-2.5 py-1 rounded-md border font-mono transition-all ${
                    selectedTag === tag
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-semibold"
                      : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-main)]/60 hover:text-[var(--text-main)]"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </section>
        <section>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-main)]/50 gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Fetching your library...</p>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="group relative flex gap-4 p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/50 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="relative w-28 h-40 shrink-0 rounded-lg overflow-hidden bg-[var(--bg)] border border-[var(--border)] shadow-inner">
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt={book.title}
                        fill
                        sizes="112px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-[var(--text-main)]/30">
                        <BookOpen className="w-8 h-8 mb-1" />
                        <span className="text-[10px] font-medium leading-tight line-clamp-3">
                          {book.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-0.5 min-w-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getStatusStyle(
                            book.status
                          )}`}
                        >
                          {book.status}
                        </span>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => openEditModal(book)}
                            title="Edit Book"
                            className="p-1 rounded hover:bg-[var(--bg)] text-[var(--text-main)]/60 hover:text-[var(--accent)] transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(book._id)}
                            disabled={deletingId === book._id}
                            title="Delete Book"
                            className="p-1 rounded hover:bg-[var(--bg)] text-[var(--text-main)]/60 hover:text-rose-500 transition-colors"
                          >
                            {deletingId === book._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-[var(--text-main)] line-clamp-2 leading-snug">
                          {book.title}
                        </h3>
                        <p className="text-xs text-[var(--text-main)]/60 line-clamp-1 mt-0.5">
                          by {book.author}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 mt-3 pt-2 border-t border-[var(--border)]/60">
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
                        Added: {new Date(book.createdAt).toLocaleDateString()}
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
            </div>
          )}
        </section>
      </main>
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="font-bold text-lg">Edit Book Details</h3>
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="p-1 rounded-lg text-[var(--text-main)]/50 hover:text-[var(--text-main)] hover:bg-[var(--bg)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/60 mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/60 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  required
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/60 mb-1">
                  Reading Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Status)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="Want to Read">Want to Read</option>
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/60 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={editTags}
                  placeholder="Fiction, Sci-Fi, Favorites"
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--bg)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] flex items-center gap-1.5"
                >
                  {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <footer className="py-8 bg-[var(--text-main)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="container mx-auto px-6 md:px-12 flex flex-col items-center gap-2">
          <div className="text-sm text-[var(--bg)]/60">
            &copy; {new Date().getFullYear()} WordMark. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}