import { blocks } from "../blocks";
import type { CollectionConfig } from "payload/types";
import { publicReadOnly } from "../access/publicReadOnly";

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
      localized: true,
      required: true,
    },
    {
      name: "images",
      label: "Runde Abbildungen",
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
      name: "layout",
      label: "Layout",
      type: "blocks",
      blocks,
    },
  ],
};

export default Pages;
