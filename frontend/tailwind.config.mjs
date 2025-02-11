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
          foreground: "#381E72",
        },
        secondary: {
          DEFAULT: "#CCC2DC",
          foreground: "#332D41",
        },
        tertiary: {
          DEFAULT: "#EFB8C8",
          foreground: "#492532",
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", ...fontFamily.sans],
        sans: ["var(--font-inter)", ...fontFamily.sans],
        content: ["var(--font-dm-sans)", ...fontFamily.sans],
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
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
        'elevation-2': '0 2px 6px rgba(0,0,0,0.15), 0 1px 6px 3px rgba(0,0,0,0.1)',
        'elevation-3': '0 4px 8px rgba(0,0,0,0.15), 0 1px 8px 4px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config