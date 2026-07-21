import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        secondary: "hsl(var(--secondary))",
        destructive: "hsl(var(--destructive))",
      },
      backgroundImage: {
        "gradient-neon":
          "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
        "gradient-accent":
          "linear-gradient(to right, hsl(var(--accent)), hsl(var(--primary)))",
        "gradient-surface":
          "linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted)))",
      },
      boxShadow: {
        glow: "0 0 24px hsl(var(--primary) / 0.45)",
        card: "0 20px 50px -20px hsl(225 40% 2% / 0.8)",
      },
      keyframes: {
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "scale-in": "scale-in 0.5s ease-out both",
        "fade-in": "fade-in 0.5s ease-out both",
        "slide-in-left": "slide-in-left 0.6s ease-out both",
        "slide-in-right": "slide-in-right 0.6s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
