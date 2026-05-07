"use client";

import Link from "next/link";
import { Moon, Sun, Leaf, Settings, BarChart2, Archive } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b border-black/5 dark:border-white/10 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-full bg-brand-light dark:bg-brand-dark/30 text-brand group-hover:scale-105 transition-transform">
            <Leaf size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-brand">PlantStack</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground"
            aria-label="Toggle Dark Mode"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link href="/archive" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground">
            <Archive size={20} />
          </Link>
          <Link href="/statistics" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground">
            <BarChart2 size={20} />
          </Link>
          <Link href="/settings" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground">
            <Settings size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
