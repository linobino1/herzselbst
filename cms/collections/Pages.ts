import type { CollectionConfig, FieldHookArgs } from "payload/types";
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
    defaultColumns: ["title", "slug", "category"],
  },
  access: publicReadOnly,
  custom: {
    addUrlField: {
      hook: async ({ siblingData, req: { payload } }: FieldHookArgs) => {
        let s = `/${siblingData.slug || ""}`;
        if (siblingData.category) {
          let { category } = siblingData;
          if (typeof category === "string") {
            category = await payload.findByID({
              collection: "categories",
              id: category,
            });
          }
          s = `/${category.slug}${s}`;
        }
        return s;
      },
    },
    addSlugField: {
      from: "title",
    },
  },
  fields: [
    {
      name: "category",
      label: "Kategorie",
      type: "relationship",
      relationTo: "categories",
      maxDepth: 0,
    },
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
      name: "sidebar",
      type: "group",
      fields: [
        {
          name: "content",
          label: "Inhalt",
          type: "richText",
        },
      ],
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
