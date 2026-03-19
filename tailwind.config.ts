import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#B45309",
          dark: "#7C2D12",
          light: "#F59E0B"
        },
        background: "#F6F1E8",
        surface: {
          DEFAULT: "#FFFDF9",
          muted: "#F3ECE1",
          strong: "#E6D7C3"
        },
        ink: {
          DEFAULT: "#111827",
          soft: "#475569",
          muted: "#64748B"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "soft": "0 22px 50px rgba(15, 23, 42, 0.10)",
        "panel": "0 10px 30px rgba(15, 23, 42, 0.08)"
      },
      backgroundImage: {
        "grid-fade": "linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;

