import type { Field } from 'payload'
import { linkAppendix } from './linkAppendix'

export const link = ({
  extraFields,
  extraTypeOptions,
}: {
  extraFields?: Field[]
  extraTypeOptions?: { label: string; value: string }[]
}): Field => ({
  name: 'link',
  type: 'group',
  // @ts-expect-error - filter(Boolean) is not typesafe
  fields: [
    {
      name: 'type',
      label: 'Art',
      type: 'radio',
      defaultValue: 'internal',
      options: [
        {
          label: 'Interner Link',
          value: 'internal',
        },
        {
          label: 'Externer Link',
          value: 'external',
        },
        ...(extraTypeOptions || []),
      ].filter(Boolean),
    },
    // internal link
    {
      name: 'doc',
      label: 'Seite',
      type: 'relationship',
      relationTo: ['pages'],
      admin: {
        condition: (data: any, siblingData: any) => siblingData.type === 'internal',
      },
    },
    {
      name: 'category',
      label: 'Kategorie',
      type: 'relationship',
      relationTo: ['categories'],
      required: true,
      admin: {
        condition: (data: any, siblingData: any) => siblingData.type === 'subnavigation',
      },
    },
    // external link
    {
      name: 'label',
      label: 'Bezeichnung',
      type: 'text',
      admin: {
        condition: (data: any, siblingData: any) => siblingData.type === 'external',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        condition: (data: any, siblingData: any) => siblingData.type === 'external',
      },
    },
    {
      name: 'newTab',
      label: 'In neuem Tab öffnen',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (data: any, siblingData: any) => siblingData.type !== 'subnavigation',
      },
    },
    linkAppendix,
    ...(extraFields || []),
  ].filter(Boolean),
})
