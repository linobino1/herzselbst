import { isLoggedIn } from "../access/isLoggedIn";
import type { ArrayField, GlobalConfig } from "payload/types";

const createNavigationField = (
  name: string,
  label: string,
  allowSubnavigation: boolean = true,
  nested: boolean = false
): ArrayField => ({
  name,
  label,
  labels: {
    singular: "Eintrag",
    plural: "Einträge",
  },
  type: "array",
  minRows: 1,
  admin: {
    components: {
      RowLabel: ({ data }: { data: any }): string => data.label,
    },
    condition: (data: any, siblingData: any): boolean => {
      if (nested) {
        return siblingData.type === "subnavigation";
      }
      return true;
    },
  },
  // @ts-ignore everything is fine, it's just that filter(Boolean) is not typed
  fields: [
    {
      name: "type",
      label: "Art",
      type: "radio",
      defaultValue: "internal",
      options: [
        {
          label: "Interner Link",
          value: "internal",
        },
        {
          label: "Externer Link",
          value: "external",
        },
        allowSubnavigation
          ? {
              label: "Untermenü",
              value: "subnavigation",
            }
          : null,
      ].filter(Boolean),
    },
    {
      name: "label",
      label: "Bezeichnung",
      type: "text",
      required: true,
    },
    // internal link
    {
      name: "doc",
      label: "Seite",
      type: "relationship",
      relationTo: ["pages"],
      admin: {
        condition: (data: any, siblingData: any) =>
          siblingData.type === "internal",
      },
    },
    // external link
    {
      name: "url",
      type: "text",
      required: true,
      admin: {
        condition: (data: any, siblingData: any) =>
          siblingData.type === "external",
      },
    },
    {
      name: "newTab",
      label: "In neuem Tab öffnen",
      type: "checkbox",
      defaultValue: false,
      admin: {
        condition: (data: any, siblingData: any) =>
          siblingData.type !== "subnavigation",
      },
    },
    // subnavigation
    allowSubnavigation
      ? createNavigationField("subnavigation", "Untermenü", false, true)
      : null,
  ].filter(Boolean),
});

export const Navigations: GlobalConfig = {
  slug: "navigations",
  typescript: {
    interface: "Navigations",
  },
  label: "Menüs",
  admin: {
    group: "Einstellungen",
  },
  access: {
    read: () => true,
    update: isLoggedIn,
  },
  fields: [
    createNavigationField("main", "Hauptmenü", true),
    createNavigationField("footer", "Fußmenü", false),
  ],
};

export default Navigations;