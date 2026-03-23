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
          DEFAULT: "#C6A34A",
          dark: "#8F7230",
          light: "#E5C879"
        },
        background: "#09090B",
        surface: {
          DEFAULT: "#141416",
          muted: "#1C1C20",
          strong: "#26262B"
        },
        ink: {
          DEFAULT: "#F8FAFC",
          soft: "#CBD5E1",
          muted: "#94A3B8"
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

