import type { CollectionConfig, FieldHookArgs } from "payload/types";
import { publicReadOnly } from "../access/publicReadOnly";

const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    singular: "Seitenkategorie",
    plural: "Seitenkategorien",
  },
  admin: {
    group: "Inhalte",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
  },
  access: publicReadOnly,
  custom: {
    addUrlField: {
      hook: ({ siblingData }: FieldHookArgs) => `/${siblingData.slug || ""}`,
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
      name: "defaultPage",
      label: "Standardseite",
      type: "relationship",
      relationTo: "pages",
      maxDepth: 0,
      required: true,
    },
  ],
};

export default Categories;
