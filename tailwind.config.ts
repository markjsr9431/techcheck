import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        background: "#0A0A0B",
        surface: "#131316",
        border: "#232326",
        foreground: "#F4F4F5",
        muted: "#8B8B92",
        accent: {
          DEFAULT: "#5E6AD2",
          foreground: "#F4F4F5",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
      boxShadow: {
        soft: "0 8px 30px -8px rgba(0, 0, 0, 0.5)",
        subtle: "0 2px 12px -2px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
