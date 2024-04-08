import type { Config, Plugin } from "payload/config";
import type { Field, FieldHookArgs } from "payload/dist/fields/config/types";

/**
 * this plugin adds a url field to a collection if you add the following to the collection config:
 * custom: {
 *  addUrlField: {
 *   hook: (slug?: string) => `my/path/${slug || ''}`,
 * },
 */
export const addUrlField: Plugin = (incomingConfig: Config): Config => {
  // Spread the existing config
  const config: Config = {
    ...incomingConfig,
    collections: [
      ...(incomingConfig.collections || [])?.map((collection) =>
        collection.custom?.addUrlField
          ? {
              ...collection,
              admin: {
                ...collection.admin,
                enableRichTextLink: true,
                enableRichTextRelationship: true,
              },
              fields: [
                ...collection.fields,
                {
                  name: "url",
                  type: "text",
                  required: true,
                  validate: () => true,
                  hooks: {
                    beforeChange: [
                      (args: FieldHookArgs): string => {
                        const relativeUrl =
                          collection.custom?.addUrlField.hook(args) || "";
                        return relativeUrl || "";
                      },
                    ],
                  },
                  admin: {
                    position: "sidebar",
                    readOnly: true,
                    components: {
                      Field: undefined,
                    },
                  },
                } satisfies Field,
              ],
            }
          : {
              ...collection,
            },
      ),
    ],
  };

  return config;
};

export default addUrlField;
