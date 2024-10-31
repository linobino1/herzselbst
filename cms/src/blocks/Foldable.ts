import type { Block } from 'payload'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import Video from './Video'
import Publications from './Publications'

export const Foldable: Block = {
  slug: 'foldable',
  labels: {
    singular: 'Einklappblock',
    plural: 'Einklappblöcke',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      // default editor configuration without the Foldable block
      editor: lexicalEditor({
        // @ts-ignore
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            // @ts-ignore
            blocks: [Video, Publications],
          }),
        ],
      }),
    },
  ],
}

export default Foldable
