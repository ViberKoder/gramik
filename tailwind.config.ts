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
        "x-black": "#0f1419",
        "x-gray": "#536471",
        "x-border": "#eff3f4",
        "x-bg": "#f7f9f9",
        ton: {
          DEFAULT: "#0088cc",
          hover: "#006699",
          light: "#e8f4fc",
        },
      },
      backgroundImage: {
        "gradient-ton": "linear-gradient(135deg, #0088cc 0%, #006699 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
