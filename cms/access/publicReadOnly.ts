import type { CollectionConfig } from "payload/types";
import { isLoggedIn } from "./isLoggedIn";

export const publicReadOnly: CollectionConfig["access"] = {
  read: () => true,
  create: isLoggedIn,
  update: isLoggedIn,
  delete: isLoggedIn,
};
