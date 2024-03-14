import { isLoggedIn } from "../access/isLoggedIn";
import type { GlobalConfig } from "payload/types";

export const Site: GlobalConfig = {
  slug: "site",
  label: "Seitenkonfiguration",
  admin: {
    group: "Einstellungen",
  },
  access: {
    read: () => true,
    update: isLoggedIn,
  },
  fields: [
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      required: true,
      relationTo: "media",
    },
  ],
};

export default Site;
