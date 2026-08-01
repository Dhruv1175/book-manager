"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Book as BookIcon, Feather, Clock, BookOpen, Loader2 } from "lucide-react";
import UserProfileDropdown from "@/components/UserProfileDropDown";
import { BookTypes } from "@/types";

async function fetchAuthorPhotoUrl(authorName: string): Promise<string | null> {
  try {
    const query = new URLSearchParams({ q: authorName, limit: "1" });
    const res = await fetch(`https://openlibrary.org/search/authors.json?${query}`);
    const data = await res.json();
    const authorKey = data.docs?.[0]?.key;
    return authorKey ? `https://covers.openlibrary.org/a/olid/${authorKey}-M.jpg` : null;
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const [books, setBooks] = useState<BookTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorPhotoUrl, setAuthorPhotoUrl] = useState<string | null>(null);

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

  const getSpotlightAuthor = () => {
    if (books.length === 0) return null;

    const authorCounts: Record<string, number> = {};
    books.forEach((book) => {
      if (book.author) {
        authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
      }
    });

    let topAuthor = "";
    let maxCount = 0;

    for (const [author, count] of Object.entries(authorCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topAuthor = author;
      }
    }

    return { name: topAuthor, count: maxCount };
  };

  const spotlightAuthor = getSpotlightAuthor();

  useEffect(() => {
    if (!spotlightAuthor?.name) return;

    let isMounted = true;
    fetchAuthorPhotoUrl(spotlightAuthor.name).then((url) => {
      if (isMounted) {
        setAuthorPhotoUrl(url);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [spotlightAuthor?.name]);

  const recentBooks = books.slice(0, 3);

  const getStatusBadge = (status: BookTypes["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Reading":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Want to Read":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-20 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl tracking-tight text-[var(--text-main)]">
            WordMark
          </Link>
          <div className="flex items-center gap-7">
            <Link
              href="/dashboard/books"
              className="flex items-center gap-2 text-sm font-medium text-[var(--text-main)]/70 hover:text-[var(--text-main)] transition-colors"
            >
              <BookIcon className="w-4 h-4" />
              <span>All Books</span>
            </Link>
            <div className="w-px h-6 bg-[var(--border)]" />
            <DarkModeToggle />
            <UserProfileDropdown />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-10 pt-32 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[var(--text-main)]/50 gap-3">
            <Loader2 className="w-7 h-7 animate-spin" />
            <p className="text-sm font-medium">Loading your reading shelf…</p>
          </div>
        ) : (
          <div className="flex flex-col gap-14">

            {spotlightAuthor && (
              <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 md:p-10 shadow-sm">

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[var(--accent)]/10 blur-3xl"
                />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-6">
                  <div className="relative w-24 h-24 shrink-0 rounded-full overflow-hidden border-2 border-[var(--bg)] ring-1 ring-[var(--border)] bg-[var(--bg)] shadow-md">
                    {authorPhotoUrl ? (
                      <Image
                        src={authorPhotoUrl}
                        alt={spotlightAuthor.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--text-main)]/30">
                        <Feather className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-3">
                      <Feather className="w-3.5 h-3.5" />
                      Spotlight Author
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)]">
                      {spotlightAuthor.name}
                    </h2>
                    <p className="text-sm text-[var(--text-main)]/60 mt-1.5">
                      You&apos;ve collected{" "}
                      <span className="font-semibold text-[var(--text-main)]">
                        {spotlightAuthor.count}
                      </span>{" "}
                      {spotlightAuthor.count === 1 ? "book" : "books"} by this author on your shelf.
                    </p>
                  </div>
                </div>
              </section>
            )}

            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-5">
                <div className="flex items-center gap-2.5 text-lg font-bold text-[var(--text-main)]">
                  <Clock className="w-5 h-5 text-[var(--accent)]" />
                  <h3>Recently Added</h3>
                </div>

                <Link
                  href="/dashboard/books"
                  className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  View all ({books.length}) →
                </Link>
              </div>

              {recentBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recentBooks.map((book) => (
                    <div
                      key={book._id}
                      className="group flex gap-4 p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/40 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="relative w-20 h-28 shrink-0 rounded-lg overflow-hidden bg-[var(--bg)] border border-[var(--border)]">
                        {book.coverUrl ? (
                          <Image
                            src={book.coverUrl}
                            alt={book.title}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-[var(--text-main)]/30">
                            <BookOpen className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-medium leading-tight line-clamp-2">
                              {book.title}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border whitespace-nowrap ${getStatusBadge(book.status)}`}>
                              {book.status}
                            </span>
                            <span className="text-[10px] text-[var(--text-main)]/40 font-mono shrink-0">
                              {new Date(book.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-[15px] text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                              {book.title}
                            </h4>
                            <p className="text-xs text-[var(--text-main)]/55 line-clamp-1 mt-0.5">
                              by {book.author}
                            </p>
                          </div>
                        </div>

                        {book.tags && book.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {book.tags.slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] px-2 py-0.5 rounded bg-[var(--bg)] text-[var(--text-main)]/55 font-mono"
                              >
                                #{tag}
                              </span>
                            ))}
                            {book.tags.length > 2 && (
                              <span className="text-[9px] text-[var(--text-main)]/40 font-mono self-center">
                                +{book.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]/50 space-y-4">
                  <BookOpen className="w-9 h-9 mx-auto text-[var(--text-main)]/35" />
                  <p className="text-sm text-[var(--text-main)]/60">
                    No books added to your shelf yet.
                  </p>
                  <Link
                    href="/dashboard/books/new"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md transition-all"
                  >
                    + Add your first book
                  </Link>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

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