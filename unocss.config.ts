import {
  defineConfig,
  presetUno,
  presetWind,
  presetIcons,
  transformerDirectives,
} from "unocss";
import presetWebFonts from "@unocss/preset-web-fonts";

export default defineConfig({
  presets: [
    presetUno(),
    presetWind() /* tailwind compatible */,
    presetIcons(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: {
          name: "Spartan",
          weights: [400, 500, 700],
          italic: true,
        },
        altsans: {
          name: "League Spartan",
          weights: [400],
        },
      },
    }),
    presetIcons(),
  ],
  transformers: [transformerDirectives()],
  theme: {
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
  },
});
