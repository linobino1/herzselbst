import type { Config } from "tailwindcss";
import { addDynamicIconSelectors } from "@iconify/tailwind";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        key: {
          50: "#FCF8EE",
          100: "#F8F1DD",
          200: "#F2E2BB",
          300: "#EBD498",
          400: "#E5C576",
          500: "#DEB754",
          600: "#CD9E28",
          700: "#9A771E",
          800: "#674F14",
          900: "#33280A",
          950: "#1A1405",
        },
      },
      transitionProperty: {
        "max-h": "max-height",
      },
      fontFamily: {
        sans: ["Spartan", "sans-serif"],
        altsans: ["League Spartan", "sans-serif"],
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
} satisfies Config;
