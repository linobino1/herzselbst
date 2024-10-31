import type { Block } from 'payload'

export const Review: Block = {
  slug: 'review',
  labels: {
    singular: 'Rezension',
    plural: 'Rezensionen',
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'about',
          type: 'textarea',
        },
      ],
    },
  ],
}

export default Review
