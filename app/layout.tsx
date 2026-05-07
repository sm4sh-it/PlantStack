import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import OnboardingModal from "../components/OnboardingModal";

export const metadata = {
  title: "PlantStack",
  description: "Responsive Houseplant Management App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <ThemeProvider>
          <OnboardingModal />
          <Navbar />
          <main className="container mx-auto p-4 md:p-8 flex-1">{children}</main>
          <footer className="py-6 text-center text-sm text-surface-foreground/40 border-t border-black/5 dark:border-white/5 mt-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span>&copy; {new Date().getFullYear()} PlantStack | <a href="https://www.sm4sh.it" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">sm4sh.it</a></span>
            <span className="hidden sm:inline">&bull;</span>
            <a href="/about" className="hover:text-brand transition-colors">About</a>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
