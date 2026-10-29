import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        asooo: {
          bg: "var(--bg-primary)",
          surface: "var(--bg-surface)",
          subtle: "var(--bg-subtle)",
          text: "var(--text-main)",
          muted: "var(--text-muted)",
          dim: "var(--text-dim)",
          adire: "var(--adire-indigo)",
          border: "var(--border-light)",
          borderStrong: "var(--border-strong)",
        },
        harmattan: {
          DEFAULT: "var(--harmattan-ochre)",
          bg: "var(--harmattan-bg)",
        },
        rain: {
          DEFAULT: "var(--rain-green)",
          bg: "var(--rain-bg)",
        },
        sun: {
          DEFAULT: "var(--sun-amber)",
          bg: "var(--sun-bg)",
        },
        ac: {
          DEFAULT: "var(--ac-cold-blue)",
          bg: "var(--ac-cold-bg)",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(28, 25, 23, 0.04)",
        card: "0 4px 20px rgba(28, 25, 23, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
