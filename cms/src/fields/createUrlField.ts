import type { Field, FieldHookArgs } from 'payload'

export const createUrlField = (
  hook: (args: FieldHookArgs) => string | null | undefined | Promise<string | null | undefined>,
): Field => ({
  name: 'url',
  type: 'text',
  required: true,
  validate: () => true as const,
  admin: {
    readOnly: true,
    position: 'sidebar',
    components: {
      Field: '@/components/UrlField',
    },
  },
  hooks: {
    beforeChange: [
      (args: FieldHookArgs) => {
        return hook(args)
      },
    ],
  },
})
