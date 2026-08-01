"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

const inputClass =
  "w-full h-12 px-4 rounded-lg bg-white text-slate-900 text-sm placeholder:text-slate-400 border border-black/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset token is missing or invalid.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2500);
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold text-red-600">
          Invalid or expired reset session.
        </p>
        <Link href="/auth/login" className="text-sm text-[var(--accent)] underline">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      {success ? (
        <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
          <h2 className="text-base font-bold text-emerald-700">
            Password reset successfully!
          </h2>
          <p className="text-sm text-emerald-700/70">
            Redirecting to login page…
          </p>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-600">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="newPassword" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPass ? "text" : "password"}
                required
                minLength={8}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                tabIndex={-1}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff className="w-[17px] h-[17px]" /> : <Eye className="w-[17px] h-[17px]" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50">
              Confirm Password
            </label>
            <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPass ? "text" : "password"}
              required
              minLength={8}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
             <button
                type="button"
                onClick={() => setShowConfirmPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                tabIndex={-1}
                aria-label={showConfirmPass ? "Hide password" : "Show password"}
              >
                {showConfirmPass ? <EyeOff className="w-[17px] h-[17px]" /> : <Eye className="w-[17px] h-[17px]" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 transition-colors duration-150"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating…
              </>
            ) : (
              "Update password"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-10 h-16 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
        <div className="h-full flex items-center px-8">
          <Link href="/" className="text-base font-bold tracking-tight text-[var(--text-main)]">
            WordMark
          </Link>
        </div>
      </div>

      {/* Page body */}
      <div className="min-h-screen flex items-center justify-center px-6">

        {/* Card */}
        <div className="w-full max-w-sm rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.15)]">
          <div className="p-10">

            {/* Heading */}
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[var(--accent)]/10 border border-[var(--accent)]/25">
                <KeyRound className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] mb-1.5">
                Set new password
              </h1>
              <p className="text-sm text-[var(--text-main)]/60">
                Choose a strong password with at least 8 characters.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="text-center text-sm text-[var(--text-main)]/50">
                  Loading form…
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}