import type { Field, FieldHookArgs } from 'payload'
import slugify from 'slugify'

export const createSlugField = (
  hook: (args: FieldHookArgs) => string | null | undefined | Promise<string | null | undefined>,
): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  validate: () => true as const,
  admin: {
    readOnly: true,
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [
      async (args: FieldHookArgs) => {
        return slugify((await hook(args)) || '', {
          lower: true,
          locale: 'en',
        })
      },
    ],
  },
})
