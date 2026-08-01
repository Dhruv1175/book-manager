"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound, Loader2 } from "lucide-react";

const inputClass =
  "w-full h-12 px-4 rounded-lg bg-white text-slate-900 text-sm placeholder:text-slate-400 border border-black/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/auth/reset-password?token=${data.resetToken}`);
      } else {
        setError(data.message || "Invalid OTP code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">

      <div className="fixed top-0 left-0 right-0 z-10 h-16 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
        <div className="h-full flex items-center px-8">
          <Link href="/" className="text-base font-bold tracking-tight text-[var(--text-main)]">
            WordMark
          </Link>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-6">

        <div className="w-full max-w-sm rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.15)]">
          <div className="p-10">

            <div className="mb-8 flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[var(--accent)]/10 border border-[var(--accent)]/25">
                <KeyRound className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] mb-1.5">
                Enter OTP code
              </h1>
              <p className="text-sm text-[var(--text-main)]/60">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-[var(--text-main)]">{email}</span>
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 mb-6 rounded-lg text-sm bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              {!emailParam && (
                <div>
                  <label htmlFor="email" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label htmlFor="otp" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50">
                  6-digit code
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`${inputClass} text-center font-mono text-lg tracking-[0.4em]`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 transition-colors duration-150"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Verify code
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}