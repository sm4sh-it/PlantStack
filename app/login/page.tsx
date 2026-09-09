"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ungültiges Passwort");
      }

      // Hard navigation to trigger full cookie recognition and reload state
      window.location.href = from;
    } catch (err: any) {
      setError(err.message || "Anmeldung fehlgeschlagen");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Brand Card */}
        <div className="bg-surface border border-border-hairline rounded-2xl shadow-xl p-8 sm:p-10 backdrop-blur-sm">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-brand-subtle rounded-2xl flex items-center justify-center p-3 shadow-inner">
              <Image
                src="/logo-green.svg"
                alt="PlantStack Logo"
                width={48}
                height={48}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              PlantStack
            </h1>
            <p className="text-sm text-text-secondary mt-1.5 flex items-center justify-center gap-1.5">
              <ShieldCheck size={16} className="text-brand" />
              <span>Geschützter Dschungel-Zugang</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-shake">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2"
              >
                Passwort / API-Secret
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoFocus
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Secret eingeben..."
                  className="w-full pl-10 pr-4 py-3 bg-surface-subtle border border-border-hairline rounded-xl text-foreground placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full py-3 px-4 bg-brand hover:bg-brand/90 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Dschungel entsperren</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-text-muted">
            <span>PlantStack • Self-Hosted Houseplant Management</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
