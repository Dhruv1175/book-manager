"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const inputClass =
    "w-full h-12 px-4 rounded-lg bg-white text-slate-900 text-sm placeholder:text-slate-400 border border-black/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = async () => {
    if (!email) {
      setError("Please enter your email address first to reset your password.");
      return;
    }

    setForgotLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to send OTP code.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
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

            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] mb-1.5">
                Welcome back
              </h1>
              <p className="text-sm text-[var(--text-main)]/60">
                Sign in to continue to your dashboard.
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 mb-6 rounded-lg text-sm bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">

              <div>
                <label htmlFor="email" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]/50">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    disabled={forgotLoading}
                    className="text-xs font-medium text-[var(--accent)] hover:underline flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {forgotLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 transition-colors duration-150"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--text-main)]/60">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="font-semibold text-[var(--accent)] hover:underline transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}