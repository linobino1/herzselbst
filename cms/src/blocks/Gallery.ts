import type { Block } from 'payload'

export const Gallery: Block = {
  slug: 'gallery',
  labels: {
    singular: 'Gallerie',
    plural: 'Gallerien',
  },
  fields: [
    {
      name: 'items',
      label: 'Bilder',
      labels: {
        singular: 'Bild',
        plural: 'Bilder',
      },
      type: 'array',
      fields: [
        {
          name: 'image',
          label: 'Bild',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          label: 'Bildunterschrift',
          type: 'text',
        },
      ],
    },
  ],
}

export default Gallery
