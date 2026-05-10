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
        background: {
          main: "#050816",
          sidebar: "#0A1023",
          card: "#111936",
          secondary: "#161F3F",
        },
        accent: {
          primary: "#8B7CFF",
          start: "#7B61FF",
          end: "#A78BFA",
          glow: "#6C63FF",
        },
        text: {
          heading: "#D9D6FF",
          primary: "#B7BCD6",
          secondary: "#7E86A8",
          placeholder: "#667085",
        },
        support: {
          emotional: "#FF7AC6",
          meditation: "#A78BFA",
          anxiety: "#4DA3FF",
          affirmation: "#FFD166",
        },
        extra: {
          cyan: "#6EE7F9",
          peach: "#FFB4A2",
          rose: "#F472B6",
          mint: "#6EE7B7",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(135deg, #050816 0%, #0B1330 45%, #161F3F 100%)",
        "gradient-button": "linear-gradient(90deg, #7B61FF 0%, #A78BFA 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "glow-effect": "0 0 30px rgba(139, 124, 255, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "typing-dot": "typingDot 1.4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #A7BBEC44, 0 0 10px #9097C022" },
          "100%": { boxShadow: "0 0 20px #A7BBEC88, 0 0 40px #9097C044" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        typingDot: {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-8px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
