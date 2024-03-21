import {
  BlocksFeature,
  HTMLConverterFeature,
  LinkFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload/types";
import Video from "./Video";
import Publications from "./Publications";
import { HTMLConverterWithAlign } from "../lexical/HTMLConverterWithAlign";
import { UploadHTMLConverter } from "../lexical/UploadHTMLCOnverter";

export const Foldable: Block = {
  slug: "foldable",
  labels: {
    singular: "Einklappblock",
    plural: "Einklappblöcke",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
      // default editor configuration without the Foldable block
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          LinkFeature({
            enabledCollections: ["pages", "media"],
          }),
          BlocksFeature({
            blocks: [Video, Publications],
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
};

export default Foldable;
