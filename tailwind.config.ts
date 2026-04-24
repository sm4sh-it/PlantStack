import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#dcfce7", // green-100
          DEFAULT: "#22c55e", // green-500
          dark: "#166534", // green-800
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        surfaceForeground: "var(--surface-foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
