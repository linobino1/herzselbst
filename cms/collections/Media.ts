import type { CollectionConfig } from "payload/types";
import { publicReadOnly } from "../access/publicReadOnly";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Datei",
    plural: "Dateien",
  },
  admin: {
    group: "Inhalte",
    pagination: {
      defaultLimit: 50,
    },
  },
  access: publicReadOnly,
  upload: true,
  fields: [
    {
      name: "alt",
      label: "alt text",
      type: "text",
      admin: {
        description:
          "Beschreibe, was das Bild zeigt. Feld leer lassen, um den Dateinamen als Alt-Text zu verwenden",
      },
      // hooks: {
      //   beforeValidate: [
      //     // use filename as alt text if alt text is empty
      //     ({ value, data }) => {
      //       if (typeof value === "string" && value.length > 0) {
      //         return value;
      //       }
      //       if (typeof data?.filename === "string") {
      //         return data.filename.split(".")[0];
      //       }
      //       return value;
      //     },
      //   ],
      // },
    },
  ],
};

export default Media;
