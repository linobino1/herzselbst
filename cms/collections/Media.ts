import type { CollectionConfig } from "payload/types";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: (): boolean => true, // Everyone can read Media
  },
  upload: {
    staticDir: process.env.MEDIA_DIR || undefined,
  },
  fields: [
    {
      name: "alt",
      label: "alt text",
      type: "text",
      admin: {
        description: "Beschreibe, was das Bild zeigt. Feld leer lassen, um den Dateinamen als Alt-Text zu verwenden",
      },
      hooks: {
        beforeValidate: [
          // use filename as alt text if alt text is empty
          ({ value, data }) => {
            if (typeof value === "string" && value.length > 0) {
              return value;
            }
            if (typeof data?.filename === "string") {
              return data.filename.split(".")[0];
            }
            return value;
          },
        ],
      },
    },
  ],
};

export default Media;
