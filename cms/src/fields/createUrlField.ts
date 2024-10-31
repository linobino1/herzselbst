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
  },
  hooks: {
    afterRead: [
      (args: FieldHookArgs) => {
        return hook(args)
      },
    ],
  },
})
