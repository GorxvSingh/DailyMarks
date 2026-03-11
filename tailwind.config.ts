import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          light: "var(--color-accent-light)",
        },
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        "surface-light": "var(--color-surface-light)",
        "surface-lighter": "var(--color-surface-lighter)",
      },
      maxWidth: {
        content: "1056px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.03em",
        tightest: "-0.05em",
      },
    },
  },
  plugins: [],
};

export default config;
