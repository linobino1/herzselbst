import {
  defineConfig,
  presetUno,
  presetWind,
  presetIcons,
  transformerDirectives,
} from "unocss";
import presetWebFonts from "@unocss/preset-web-fonts";
import axios from "axios";

export default defineConfig({
  presets: [
    presetUno(),
    presetWind() /* tailwind compatible */,
    presetIcons(),
    presetWebFonts({
      customFetch: (url: string) => axios.get(url).then((it) => it.data),
      provider: "google",
      fonts: {
        sans: {
          name: "Spartan",
          weights: [400, 500, 700],
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
      // gray: {
      //   50: "#F0F0F0",
      //   100: "#E3E3E3",
      //   200: "#C4C4C4",
      //   300: "#A8A8A8",
      //   400: "#8A8A8A",
      //   500: "#6E6E6E",
      //   600: "#4F4F4F",
      //   700: "#333333",
      //   800: "#212121",
      //   900: "#121212",
      //   950: "#080808",
      // },
    },
  },
});
