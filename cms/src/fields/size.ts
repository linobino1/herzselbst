import type { Field } from 'payload'

export function createSizeField(defaultValue: string): Field {
  return {
    name: 'size',
    type: 'radio',
    defaultValue,
    options: [
      {
        label: 'Small',
        value: 'small',
      },
      {
        label: 'Medium',
        value: 'medium',
      },
      {
        label: 'Large',
        value: 'large',
      },
    ],
    required: true,
  }
}
