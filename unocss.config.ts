import { defineConfig, presetUno, presetWind, presetIcons } from "unocss";
import presetWebFonts from "@unocss/preset-web-fonts";
import axios from "axios";

export default defineConfig({
  presets: [
    presetUno(),
    presetWind() /* tailwind compatible */,
    presetWebFonts({
      customFetch: (url: string) => axios.get(url).then((it) => it.data),
      provider: "google",
      fonts: {
        serif: {
          name: "Kaisei HarunoUmi",
          weights: [400, 500, 700],
        },
        sans: {
          name: "Lato",
          weights: [400, 500, 700],
        },
      },
    }),
    presetIcons(),
  ],
  theme: {},
});
