import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
        full: "9999px",
      },
      colors: {
        brand: {
          light: "var(--brand-light)",
          DEFAULT: "var(--brand)",
          primary: "var(--brand-primary)",
          hover: "var(--brand-hover)",
          dark: "var(--brand-dark)",
          subtle: "var(--brand-subtle)",
          border: "var(--brand-border)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: "var(--bg-canvas)",
        surface: {
          DEFAULT: "var(--surface)",
          foreground: "var(--surface-foreground)",
          elevated: "var(--surface-elevated)",
          subtle: "var(--bg-surface-subtle)",
          hover: "var(--bg-surface-hover)",
        },
        surfaceForeground: "var(--surface-foreground)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          onBrand: "var(--text-on-brand)",
        },
        care: {
          water: "var(--care-water)",
          "water-bg": "var(--care-water-bg)",
          fertilizer: "var(--care-fertilizer)",
          "fertilizer-bg": "var(--care-fertilizer-bg)",
          bug: "var(--care-bug)",
          "bug-bg": "var(--care-bug-bg)",
          fungus: "var(--care-fungus)",
          "fungus-bg": "var(--care-fungus-bg)",
          frost: "var(--care-frost)",
          "frost-bg": "var(--care-frost-bg)",
          sun: "var(--care-sun)",
          "sun-bg": "var(--care-sun-bg)",
        },
        status: {
          success: "var(--status-success)",
          "success-bg": "var(--status-success-bg)",
          warning: "var(--status-warning)",
          "warning-bg": "var(--status-warning-bg)",
          danger: "var(--status-danger)",
          "danger-bg": "var(--status-danger-bg)",
          info: "var(--status-info)",
          "info-bg": "var(--status-info-bg)",
        },
        urgency: {
          due: "var(--urgency-due)",
          overdue: "var(--urgency-overdue)",
          "overdue-bg": "var(--urgency-overdue-bg)",
        },
        border: {
          subtle: "var(--border-subtle)",
          hairline: "var(--border-hairline)",
          strong: "var(--border-strong)",
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
