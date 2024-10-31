import type { Block } from 'payload'
import type { Media } from '@/payload-types'

export type Publication = {
  image: Media
  title: string
  description: string
}

export const Publications: Block = {
  slug: 'publications',
  interfaceName: 'PublicationsBlock',
  labels: {
    singular: 'Publikationen',
    plural: 'Publikationen',
  },
  fields: [
    {
      name: 'items',
      label: 'Einträge',
      labels: {
        singular: 'Eintrag',
        plural: 'Einträge',
      },
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}

export default Publications
