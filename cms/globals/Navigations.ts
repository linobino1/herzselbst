import { useEffect, useState } from "react";
import { isLoggedIn } from "../access/isLoggedIn";
import type { ArrayField, GlobalConfig } from "payload/types";

const createNavigationField = (
  name: string,
  label: string,
  allowSubnavigation: boolean = true,
  nested: boolean = false,
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
      RowLabel: ({ data, index = 0 }: { data: any; index?: number }) => {
        const [label, setLabel] = useState(
          `Feature ${String(index).padStart(2, "0")}`,
        );

        useEffect(() => {
          if (data.type === "external") {
            setLabel(data.label || data.url);
          } else if (data.doc?.value) {
            fetch(`/api/pages/${data.doc.value}`).then(async (res) => {
              setLabel((await res.json()).title);
            });
          } else if (data.category?.value) {
            fetch(`/api/categories/${data.category.value}`).then(
              async (res) => {
                setLabel((await res.json()).title);
              },
            );
          }
        }, [data]);

        return label;
      },
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
      admin: {
        condition: (data: any, siblingData: any) =>
          siblingData.type === "external",
      },
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
    {
      name: "category",
      label: "Kategorie",
      type: "relationship",
      relationTo: ["categories"],
      required: true,
      admin: {
        condition: (data: any, siblingData: any) =>
          siblingData.type === "subnavigation",
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
