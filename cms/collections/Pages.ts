import type { CollectionConfig, FieldHookArgs } from "payload/types";
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
    defaultColumns: ["title", "category"],
    pagination: {
      defaultLimit: 50,
    },
  },
  defaultSort: "-updatedAt",
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
              depth: 0,
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
      type: "tabs",
      tabs: [
        {
          label: "Inhalt",
          fields: [
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
          ],
        },
        {
          label: "Seitenleiste",
          name: "sidebar",
          fields: [
            {
              name: "images",
              label: "Bilder",
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
              name: "content",
              label: "Inhalt",
              type: "richText",
            },
          ],
        },
      ],
    },
  ],
};

export default Pages;
