"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Settings, BarChart2, Ghost, LayoutDashboard, Plus } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dschungel", title: "Dashboard & Pflanzensammlung" },
    { href: "/statistics", icon: BarChart2, label: "Statistiken", title: "Statistiken & Abzeichen" },
    { href: "/archive", icon: Ghost, label: "Archiv", title: "Archiv / Verlorene Pflanzen" },
  ];

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
      <header className="hidden md:block border-b border-border-hairline bg-surface/85 backdrop-blur-xl sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
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

          {/* Desktop Center Navigation */}
          <nav aria-label="Hauptnavigation" className="flex items-center gap-1 p-1 bg-surface-subtle/70 border border-border-hairline rounded-xl">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-surface text-brand font-semibold shadow-xs"
                      : "text-text-secondary hover:text-foreground hover:bg-surface/50"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Utilities */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-text-secondary hover:text-foreground hover:bg-surface-subtle transition-all"
              aria-label="Theme umschalten"
              title={theme === "light" ? "Dunkelmodus aktivieren" : "Hellmodus aktivieren"}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <Link
              href="/settings"
              title="Einstellungen"
              aria-label="Einstellungen"
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                pathname === "/settings"
                  ? "bg-brand-subtle text-brand font-semibold"
                  : "text-text-secondary hover:text-foreground hover:bg-surface-subtle"
              }`}
            >
              <Settings size={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= MOBILE HEADER (< md) ================= */}
      <header className="flex md:hidden border-b border-border-hairline bg-surface/85 backdrop-blur-xl sticky top-0 z-40 px-4 h-14 items-center justify-between transition-colors">
        <Link href="/" className="flex items-center gap-2">
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
          className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-foreground hover:bg-surface-subtle transition-all"
          aria-label="Theme umschalten"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>

      {/* ================= MOBILE BOTTOM NAVIGATION (< md) ================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-border-hairline shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1"
      >
        <div className="max-w-md mx-auto px-2 flex items-center justify-around">
          {/* 1. Dschungel */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 rounded-lg transition-colors ${
              pathname === "/"
                ? "text-brand font-semibold"
                : "text-text-muted hover:text-foreground"
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] mt-0.5">Dschungel</span>
          </Link>

          {/* 2. Statistik */}
          <Link
            href="/statistics"
            className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 rounded-lg transition-colors ${
              pathname === "/statistics"
                ? "text-brand font-semibold"
                : "text-text-muted hover:text-foreground"
            }`}
          >
            <BarChart2 size={20} />
            <span className="text-[10px] mt-0.5">Statistik</span>
          </Link>

          {/* Center FAB: Pflanze hinzufügen (+) */}
          <button
            onClick={handleCreatePlant}
            className="w-12 h-12 -mt-5 rounded-full bg-brand text-white shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface"
            title="Pflanze hinzufügen"
            aria-label="Pflanze hinzufügen"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>

          {/* 3. Archiv */}
          <Link
            href="/archive"
            className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 rounded-lg transition-colors ${
              pathname === "/archive"
                ? "text-brand font-semibold"
                : "text-text-muted hover:text-foreground"
            }`}
          >
            <Ghost size={20} />
            <span className="text-[10px] mt-0.5">Archiv</span>
          </Link>

          {/* 4. Settings */}
          <Link
            href="/settings"
            className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 rounded-lg transition-colors ${
              pathname === "/settings"
                ? "text-brand font-semibold"
                : "text-text-muted hover:text-foreground"
            }`}
          >
            <Settings size={20} />
            <span className="text-[10px] mt-0.5">Settings</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
