import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        vjDark: {
          950: "#050508",
          900: "#0b0b12",
          850: "#10101c",
          800: "#161626",
          700: "#222238",
        },
        vjCyan: {
          400: "#38ef7d",
          500: "#00f2fe",
          600: "#4facfe",
        },
        vjPurple: {
          400: "#d946ef",
          500: "#a855f7",
          600: "#7c3aed",
        },
        vjAccent: {
          cyan: "#00f2fe",
          purple: "#7928ca",
          pink: "#ff0080",
          gold: "#f59e0b",
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(circle at 50% 0%, rgba(0, 242, 254, 0.15), rgba(121, 40, 202, 0.08) 50%, transparent 80%)',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'glow-gradient': 'linear-gradient(90deg, #00f2fe 0%, #4facfe 50%, #00f2fe 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 242, 254, 0.2), 0 0 30px rgba(121, 40, 202, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 242, 254, 0.5), 0 0 50px rgba(121, 40, 202, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
