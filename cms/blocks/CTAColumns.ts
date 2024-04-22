import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload/types";
import Button from "./Button";

export const CTAColumns: Block = {
  slug: "ctaColumns",
  labels: {
    singular: "CTA-Spalten",
    plural: "CTA-Spalten",
  },
  fields: [
    {
      name: "items",
      label: "Einträge",
      labels: { singular: "Eintrag", plural: "Einträge" },
      type: "array",
      fields: [
        {
          name: "image",
          label: "Bild",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "content",
          label: "Inhalt",
          type: "richText",
          required: true,
          editor: lexicalEditor({
            // @ts-ignore
            features({ defaultFeatures }) {
              return [...defaultFeatures, BlocksFeature({ blocks: [] })];
            },
            // features: ({ defaultFeatures }) => [
            //   ...defaultFeatures,
            //   BlocksFeature({
            //     blocks: [Button],
            //   }),
            // ],
          }),
        },
      ],
    },
  ],
};

export default CTAColumns;
