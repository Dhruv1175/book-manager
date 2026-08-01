"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserTypes } from "@/types";
import { AvatarSelector } from "@/components/AvatarSelector";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";

const SignupPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<UserTypes["avatar"]>("openBook");

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const strength = Object.values(checks).filter(Boolean).length;
  const strengthLabel =
    strength === 0 ? "" : strength === 1 ? "Weak" : strength === 2 ? "Fair" : "Strong";
  const strengthClass =
    strength === 1 ? "bg-red-500" : strength === 2 ? "bg-amber-500" : strength === 3 ? "bg-emerald-500" : "";
  const strengthTextClass =
    strength === 1 ? "text-red-500" : strength === 2 ? "text-amber-500" : strength === 3 ? "text-emerald-500" : "";

  const inputClass =
    "w-full py-4 px-4 rounded-xl bg-white text-slate-900 text-[15px] leading-normal placeholder:text-slate-400 border border-black/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, avatar }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard");
      } else {
        setError(data.message || "An error occurred during signup.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="fixed top-0 left-0 right-0 z-10 h-20 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
        <div className="h-full flex items-center px-8 md:px-12">
          <Link href="/" className="text-lg font-bold tracking-tight text-[var(--text-main)]">
            WordMark
          </Link>
        </div>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-32">

        <div className="w-full max-w-2xl rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.18)]">
          <div className="px-10 py-14 sm:px-16 sm:py-16">

            <div className="mb-14 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-main)] mb-3">
                Create your account
              </h1>
              <p className="text-base text-[var(--text-main)]/60">
                Start tracking what you read, in under a minute.
              </p>
            </div>

            {error && (
              <div className="flex items-center px-4 py-3.5 mb-8 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-10">

              <div className="flex flex-col items-center text-center">
                <label className="block mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-main)]/45">
                  Choose Avatar
                </label>
                <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} />
              </div>
              <div>
                <label htmlFor="name" className="block mb-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--text-main)]/45">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Alex Johnson"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--text-main)]/45">
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
                <label htmlFor="password" className="block mb-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--text-main)]/45">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                    tabIndex={-1}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>

                {password.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map((s) => (
                        <div
                          key={s}
                          className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                            s <= strength ? strengthClass : "bg-[var(--border)]"
                          }`}
                        />
                      ))}
                      {strengthLabel && (
                        <span className={`text-xs font-semibold ml-1 shrink-0 ${strengthTextClass}`}>
                          {strengthLabel}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                      {[
                        { key: "length", label: "8+ characters" },
                        { key: "upper", label: "Uppercase letter" },
                        { key: "number", label: "Number" },
                      ].map(({ key, label }) => (
                        <div
                          key={key}
                          className={`flex items-center gap-1.5 text-xs ${
                            checks[key as keyof typeof checks] ? "text-emerald-600" : "text-[var(--text-main)]/35"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[15px] font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-md hover:shadow-lg disabled:opacity-60 transition-all duration-150"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <p className="mt-10 text-center text-sm text-[var(--text-main)]/60">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-[var(--accent)] hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-10 max-w-md text-xs text-center leading-relaxed text-[var(--text-main)]/45">
          By creating an account you agree to our{" "}
          <span className="text-[var(--text-main)]/70 hover:text-[var(--text-main)] cursor-pointer underline underline-offset-2">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-[var(--text-main)]/70 hover:text-[var(--text-main)] cursor-pointer underline underline-offset-2">
            Privacy Policy
          </span>.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;