import type { CollectionConfig } from "payload/types";
import { publicReadOnly } from "../access/publicReadOnly";
import { lexicalHTML } from "@payloadcms/richtext-lexical";

const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: "Seite",
    plural: "Seiten",
  },
  admin: {
    group: "Inhalte",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
  },
  access: publicReadOnly,
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/${slug || ""}`,
    },
    addSlugField: {
      from: "title",
    },
  },
  fields: [
    {
      name: "title",
      label: "Titel",
      type: "text",
      required: true,
    },
    {
      name: "images",
      label: "Runde Abbildungen",
      labels: {
        singular: "Bild",
        plural: "Bilder",
      },
      type: "array",
      fields: [
        {
          name: "image",
          label: "Bild",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
      required: false,
    },
    {
      name: "h1",
      label: "Überschrift",
      type: "text",
    },
    {
      name: "content",
      label: "Inhalt",
      type: "richText",
    },
    lexicalHTML("content", {
      name: "content_html",
    }),
  ],
};

export default Pages;
