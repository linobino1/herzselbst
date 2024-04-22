import type { Field, FieldHookArgs } from "payload/types";

export const createUrlField = (
  hook: (
    args: FieldHookArgs,
  ) => string | null | undefined | Promise<string | null | undefined>,
): Field => ({
  name: "url",
  type: "text",
  required: true,
  admin: {
    readOnly: true,
    position: "sidebar",
  },
  hooks: {
    afterRead: [
      (args: FieldHookArgs) => {
        return hook(args);
      },
    ],
  },
});
