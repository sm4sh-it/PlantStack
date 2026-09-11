"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Settings, TrendingUp, Ghost, Sprout, Plus } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const handleCreatePlant = () => {
    if (pathname === "/") {
      window.dispatchEvent(new CustomEvent("open-plant-form"));
    } else {
      router.push("/?action=new");
    }
  };

  if (pathname === "/login") {
    return null;
  }

  return (
    <>
      {/* ================= DESKTOP TOPBAR (md and up) ================= */}
      <header className="hidden md:block bg-surface/98 backdrop-blur-2xl sticky top-0 z-50 transition-colors shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group" title="PlantStack">
            <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image
                src="/logo-green.svg"
                alt="PlantStack Logo"
                width={32}
                height={32}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-brand transition-colors">
                PlantStack
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation Dock (5-Punkte Icon Dock — 100% konsistent mit Mobile) */}
          <nav aria-label="Hauptnavigation" className="flex items-center gap-1.5 p-1 bg-surface-subtle/80 border border-border-hairline rounded-2xl shadow-xs">
            {/* 1. Dashboard (Sprout) */}
            <Link
              href="/"
              title="Dashboard & Pflanzensammlung"
              aria-label="Dashboard & Pflanzensammlung"
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                pathname === "/"
                  ? "bg-surface text-brand font-semibold shadow-xs"
                  : "text-text-secondary hover:text-foreground hover:bg-surface/60"
              }`}
            >
              <Sprout size={19} />
            </Link>

            {/* 2. Statistik (TrendingUp) */}
            <Link
              href="/statistics"
              title="Statistiken & Abzeichen"
              aria-label="Statistiken & Abzeichen"
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                pathname === "/statistics"
                  ? "bg-surface text-brand font-semibold shadow-xs"
                  : "text-text-secondary hover:text-foreground hover:bg-surface/60"
              }`}
            >
              <TrendingUp size={19} />
            </Link>

            {/* 3. Pflanze hinzufügen (+) */}
            <button
              onClick={handleCreatePlant}
              title="Neue Pflanze hinzufügen"
              aria-label="Neue Pflanze hinzufügen"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand hover:bg-brand-hover text-white shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={19} strokeWidth={2.5} />
            </button>

            {/* 4. Archiv (Ghost) */}
            <Link
              href="/archive"
              title="Archiv / Verlorene Pflanzen"
              aria-label="Archiv / Verlorene Pflanzen"
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                pathname === "/archive"
                  ? "bg-surface text-brand font-semibold shadow-xs"
                  : "text-text-secondary hover:text-foreground hover:bg-surface/60"
              }`}
            >
              <Ghost size={19} />
            </Link>

            {/* 5. Settings (Settings) */}
            <Link
              href="/settings"
              title="Einstellungen"
              aria-label="Einstellungen"
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                pathname === "/settings"
                  ? "bg-surface text-brand font-semibold shadow-xs"
                  : "text-text-secondary hover:text-foreground hover:bg-surface/60"
              }`}
            >
              <Settings size={19} />
            </Link>
          </nav>

          {/* Desktop Right Utilities (Theme Toggle) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-text-secondary hover:text-foreground hover:bg-surface-subtle transition-all cursor-pointer"
              aria-label="Theme umschalten"
              title={theme === "light" ? "Dunkelmodus aktivieren" : "Hellmodus aktivieren"}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE HEADER (< md) ================= */}
      <header className="flex md:hidden bg-surface/98 backdrop-blur-2xl sticky top-0 z-40 px-4 h-14 items-center justify-between transition-colors shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
        <Link href="/" className="flex items-center gap-2" title="PlantStack">
          <div className="w-7 h-7 flex items-center justify-center">
            <Image
              src="/logo-green.svg"
              alt="PlantStack Logo"
              width={28}
              height={28}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            PlantStack
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-foreground hover:bg-surface-subtle transition-all cursor-pointer"
          aria-label="Theme umschalten"
          title={theme === "light" ? "Dunkelmodus aktivieren" : "Hellmodus aktivieren"}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>

      {/* ================= MOBILE BOTTOM NAVIGATION (< md) ================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/98 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.4)] pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 transition-colors"
      >
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">
          {/* 1. Dashboard (Sprout) */}
          <Link
            href="/"
            title="Dashboard & Dschungel"
            aria-label="Dashboard & Dschungel"
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${
              pathname === "/"
                ? "bg-brand-subtle dark:bg-brand/15 text-brand font-bold shadow-2xs"
                : "text-text-secondary hover:text-foreground hover:bg-surface-subtle/70"
            }`}
          >
            <Sprout size={22} />
          </Link>

          {/* 2. Statistik (TrendingUp) */}
          <Link
            href="/statistics"
            title="Statistiken & Abzeichen"
            aria-label="Statistiken & Abzeichen"
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${
              pathname === "/statistics"
                ? "bg-brand-subtle dark:bg-brand/15 text-brand font-bold shadow-2xs"
                : "text-text-secondary hover:text-foreground hover:bg-surface-subtle/70"
            }`}
          >
            <TrendingUp size={22} />
          </Link>

          {/* 3. Center FAB: Pflanze hinzufügen (+) */}
          <button
            onClick={handleCreatePlant}
            className="w-12 h-12 -mt-5 rounded-full bg-brand hover:bg-brand-hover text-white shadow-md flex items-center justify-center active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface ring-4 ring-surface cursor-pointer"
            title="Pflanze hinzufügen"
            aria-label="Pflanze hinzufügen"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>

          {/* 4. Archiv (Ghost) */}
          <Link
            href="/archive"
            title="Archiv / Verlorene Pflanzen"
            aria-label="Archiv / Verlorene Pflanzen"
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${
              pathname === "/archive"
                ? "bg-brand-subtle dark:bg-brand/15 text-brand font-bold shadow-2xs"
                : "text-text-secondary hover:text-foreground hover:bg-surface-subtle/70"
            }`}
          >
            <Ghost size={22} />
          </Link>

          {/* 5. Settings (Settings) */}
          <Link
            href="/settings"
            title="Einstellungen"
            aria-label="Einstellungen"
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${
              pathname === "/settings"
                ? "bg-brand-subtle dark:bg-brand/15 text-brand font-bold shadow-2xs"
                : "text-text-secondary hover:text-foreground hover:bg-surface-subtle/70"
            }`}
          >
            <Settings size={22} />
          </Link>
        </div>
      </nav>
    </>
  );
}
