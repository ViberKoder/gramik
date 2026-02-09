import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        tg: {
          bg: "#0e1621",
          surface: "#17212b",
          border: "#242f3d",
          accent: "#2b5278",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)",
        "gradient-mesh": "radial-gradient(at 40% 20%, #3b82f6 0px, transparent 50%), radial-gradient(at 80% 0%, #1d4ed8 0px, transparent 50%), radial-gradient(at 0% 50%, #1e40af 0px, transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(59, 130, 246, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
