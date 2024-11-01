import type { CollectionConfig } from 'payload'
import { publicReadOnly } from '@/access/publicReadOnly'
import { createUrlField } from '@/fields/createUrlField'
import { createSlugField } from '@/fields/createSlugField'
import { generatePreviewURL } from '@/util/generatePreviewURL'

const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Seite',
    plural: 'Seiten',
  },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category'],
    pagination: {
      defaultLimit: 50,
    },
    preview: (data) => generatePreviewURL(data.url as string),
    livePreview: {
      url: ({ data }) => generatePreviewURL(data.url as string),
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1000,
      },
    },
  },

  // uncomment the next line as soon as this bug is fixed:
  // https://github.com/payloadcms/payload/issues/4815
  // defaultSort: "-updatedAt",
  access: publicReadOnly,
  fields: [
    createSlugField(({ data }) => data?.title),
    createUrlField(async ({ siblingData, req: { payload } }) => {
      let s = `/${siblingData.slug || ''}`
      if (siblingData.category) {
        let { category } = siblingData
        if (typeof category === 'string') {
          category = await payload.findByID({
            collection: 'categories',
            id: category,
            depth: 0,
          })
        }
        s = `/${category.slug}${s}`
      }
      return s
    }),
    {
      name: 'category',
      label: 'Kategorie',
      type: 'relationship',
      relationTo: 'categories',
      maxDepth: 0,
    },
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Inhalt',
          fields: [
            {
              name: 'h1',
              label: 'Überschrift',
              type: 'text',
            },
            {
              name: 'content',
              label: 'Inhalt',
              type: 'richText',
            },
          ],
        },
        {
          label: 'Seitenleiste',
          name: 'sidebar',
          fields: [
            {
              name: 'images',
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
              ],
              required: false,
            },
            {
              name: 'content',
              label: 'Inhalt',
              type: 'richText',
            },
          ],
        },
      ],
    },
  ],
}

export default Pages
