import { fontFamily } from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Material 3 Dark Theme Colors
        surface: {
          DEFAULT: "#121212",
          dim: "#121212",
          bright: "#1E1E1E",
          container: {
            lowest: "#121212",
            low: "#1E1E1E",
            DEFAULT: "#252525",
            high: "#2E2E2E",
            highest: "#383838",
          }
        },
        primary: {
          DEFAULT: "#D0BCFF",
          container: "#4F378B",
        },
        secondary: {
          DEFAULT: "#CCC2DC",
          container: "#4A4458",
        },
        tertiary: {
          DEFAULT: "#EFB8C8",
          container: "#633B48",
        },
        // Jewel tones for accents
        jewel: {
          sapphire: "#B4C6FF",
          emerald: "#7DDAC0",
          amethyst: "#D0BCFF",
          ruby: "#FFB4AB",
          topaz: "#FFB87A",
        },
        error: "#FFB4AB",
        outline: "#938F99",
        ring: "#D0BCFF",
        background: "#121212",
        foreground: "#E6E1E5",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", ...fontFamily.sans],
        sans: ["var(--font-inter)", ...fontFamily.sans],
        content: ["var(--font-dm-sans)", ...fontFamily.sans],
      },
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
        'elevation-2': '0 2px 6px rgba(0,0,0,0.15), 0 1px 6px 3px rgba(0,0,0,0.1)',
        'elevation-3': '0 4px 8px rgba(0,0,0,0.15), 0 1px 8px 4px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config