import type { CollectionConfig } from 'payload'
import { publicReadOnly } from '@/access/publicReadOnly'
import { createUrlField } from '@/fields/createUrlField'
import { createSlugField } from '@/fields/createSlugField'

const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Seitenkategorie',
    plural: 'Seitenkategorien',
  },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: publicReadOnly,
  fields: [
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      required: true,
    },
    {
      name: 'defaultPage',
      label: 'Standardseite',
      type: 'relationship',
      relationTo: 'pages',
      maxDepth: 0,
      required: true,
    },
    createSlugField(({ data }) => data?.title),
    createUrlField(({ data }) => (data?.slug ? `/${data?.slug}` : null)),
  ],
}

export default Categories
