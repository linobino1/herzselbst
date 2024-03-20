import {
  BlocksFeature,
  HTMLConverterFeature,
  LinkFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { HTMLConverterWithAlign } from "../lexical/HTMLConverterWithAlign";
import { UploadHTMLConverter } from "../lexical/UploadHTMLCOnverter";
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
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              LinkFeature({
                enabledCollections: ["pages", "media"],
              }),
              BlocksFeature({
                blocks: [Button],
              }),
              HTMLConverterFeature({
                // @ts-ignore
                converters: ({ defaultConverters }) => {
                  return [
                    HTMLConverterWithAlign,
                    UploadHTMLConverter,
                    ...defaultConverters,
                  ];
                },
              }),
            ],
          }),
        },
      ],
    },
  ],
};

export default CTAColumns;
