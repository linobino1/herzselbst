import type { Block } from "payload/types";
import { lexicalHTML } from "@payloadcms/richtext-lexical";

export const Image: Block = {
  slug: "image",
  labels: {
    singular: "Bild",
    plural: "Bilder",
  },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "caption",
      type: "richText",
      localized: true,
      required: false,
    },
    lexicalHTML("caption", {
      name: "caption_html",
    }),
  ],
};

export default Image;
