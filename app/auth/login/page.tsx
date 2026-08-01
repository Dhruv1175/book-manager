"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Activity } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative selection:bg-mint-500/20"
      style={{ background: "hsl(220 13% 5%)" }}
    >
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "linear-gradient(hsl(220 13% 8% / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(220 13% 8% / 0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />
      <div
        className="fixed top-0 left-0 right-0 z-10 flex items-center px-8 h-16"
        style={{
          borderBottom: "1px solid hsl(var(--border-token))",
          background: "hsl(220 13% 5% / 0.85)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(var(--info-dim))", border: "1px solid hsl(var(--info) / 0.3)" }}
          >
            <Activity className="w-4 h-4" style={{ color: "hsl(var(--info))" }} />
          </div>
          <span
            className="text-sm font-bold tracking-tight transition-colors"
            style={{ color: "hsl(var(--foreground))" }}
          >
            WordMark
          </span>
        </Link>
      </div>
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden mt-12"
        style={{
          background: "hsl(var(--surface))",
          border: "1px solid hsl(var(--border-token))",
          boxShadow: "0 32px 80px hsl(220 14% 3% / 0.6)",
        }}
      >
        <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, hsl(var(--info)), transparent)" }} />

        <div className="p-8 md:p-10">
          <div className="mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "hsl(var(--info-dim))", border: "1px solid hsl(var(--info) / 0.3)" }}
            >
              <Activity className="w-5 h-5" style={{ color: "hsl(var(--info))" }} />
            </div>
            <h1
              className="text-2xl font-black tracking-tight mb-1"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: "hsl(var(--foreground-tertiary))" }}>
              Sign in to continue to your dashboard.
            </p>
          </div>
          {error && (
            <div
              className="rounded-xl px-4 py-3 mb-6 text-sm"
              style={{
                background: "hsl(var(--negative-dim))",
                border: "1px solid hsl(var(--negative) / 0.3)",
                color: "hsl(var(--negative))",
                fontFamily: "Geist Mono",
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label-xs block mb-1.5">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="field"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-xs">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] transition-colors"
                  style={{ color: "hsl(var(--info))" }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="field pr-10"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "hsl(var(--foreground-tertiary))" }}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-sm py-3 gap-2"
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
          <p
            className="mt-8 text-center text-xs"
            style={{ color: "hsl(var(--foreground-tertiary))" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold transition-colors"
              style={{ color: "hsl(var(--info))" }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
      <p
        className="mt-6 text-xs text-center"
        style={{ color: "hsl(var(--foreground-tertiary))" }}
      >
        By signing in you agree to our{" "}
        <span style={{ color: "hsl(var(--foreground-secondary))" }}>Terms of Service</span> and{" "}
        <span style={{ color: "hsl(var(--foreground-secondary))" }}>Privacy Policy</span>.
      </p>
    </div>
  );
}