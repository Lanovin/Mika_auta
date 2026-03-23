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
          DEFAULT: "#c9a84c",
          dark: "#7a6030",
          light: "#e2c97e"
        },
        background: "#0a0a0a",
        surface: {
          DEFAULT: "#161616",
          muted: "#1e1e1e",
          strong: "#111111"
        },
        ink: {
          DEFAULT: "#f7f0e0",
          soft: "#d4c9a8",
          muted: "#7a7060"
        }
      },
      fontFamily: {
        sans: ["'Raleway'", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "serif"]
      },
      boxShadow: {
        "soft": "none",
        "panel": "none"
      }
    }
  },
  plugins: []
};

export default config;

