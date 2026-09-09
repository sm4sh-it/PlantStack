import "./globals.css";
import pkg from "../package.json";
import Link from "next/link";
import { ThemeProvider } from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import OnboardingModal from "../components/OnboardingModal";

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "PlantStack — Houseplant Care Companion",
  description: "Minimalist Houseplant Care Companion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PlantStack",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F9F6" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1310" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col selection:bg-brand selection:text-white">
        <ThemeProvider>
          <OnboardingModal />
          <Navbar />
          <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-20 md:pb-8 flex-1">
            {children}
          </main>
          <footer className="py-6 pb-24 md:pb-6 text-center text-sm text-text-muted border-t border-border-hairline mt-auto">
            <span>
              &copy; 2026 PlantStack v{pkg.version} by{" "}
              <a
                href="https://www.sm4sh.it"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand transition-colors font-medium"
              >
                sm4sh.it
              </a>{" "}
              |{" "}
              <Link
                href="/about"
                className="hover:text-brand transition-colors font-medium"
              >
                About
              </Link>
            </span>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
