import type { ArrayField, GlobalConfig } from 'payload'
import { isLoggedIn } from '../../access/isLoggedIn'
import { updateRelativeUrl } from './hooks/updateRelativeUrl'
import { updateLabel } from './hooks/updateLabel'

const createNavigationField = (
  name: string,
  label: string,
  allowSubnavigation: boolean = true,
  nested: boolean = false,
): ArrayField => ({
  name,
  label,
  labels: {
    singular: 'Eintrag',
    plural: 'Einträge',
  },
  type: 'array',
  minRows: 1,
  admin: {
    components: {
      RowLabel: '@/globals/Navigations/components/RowLabel',
    },
    condition: (data: any, siblingData: any): boolean => {
      if (nested) {
        return siblingData?.type === 'subnavigation'
      }
      return true
    },
  },
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
        ...(allowSubnavigation
          ? [
              {
                label: 'Untermenü',
                value: 'subnavigation',
              },
            ]
          : []),
      ].filter(Boolean),
    },
    // internal link
    {
      name: 'doc',
      label: 'Seite',
      type: 'relationship',
      relationTo: ['pages'],
      maxDepth: 0,
      admin: {
        condition: (data: any, siblingData: any) => siblingData?.type === 'internal',
      },
    },
    // subnavigation
    {
      name: 'category',
      label: 'Kategorie',
      type: 'relationship',
      relationTo: ['categories'],
      maxDepth: 0,
      required: true,
      admin: {
        condition: (data: any, siblingData: any) => siblingData?.type === 'subnavigation',
      },
    },
    {
      name: 'relativeUrl',
      type: 'text',
      required: true,
      hooks: {
        beforeChange: [updateRelativeUrl],
      },
      // hidden: true,
      validate: (value: any, { siblingData }: { siblingData: any }) =>
        siblingData?.type === 'external' ? true : !value ? 'required' : true,
    },
    {
      name: 'label',
      label: 'Bezeichnung',
      type: 'text',
      required: true,
      hooks: {
        beforeChange: [updateLabel],
      },
      admin: {
        description: 'Leer lassen, um den Seiten- bzw. Kategorientitel zu übernehmen.',
      },
    },
    // external link
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        condition: (data: any, siblingData: any) => siblingData?.type === 'external',
      },
    },
    {
      name: 'newTab',
      label: 'In neuem Tab öffnen',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (data: any, siblingData: any) => siblingData?.type !== 'subnavigation',
      },
    },
    ...(allowSubnavigation
      ? [createNavigationField('subnavigation', 'Untermenü', false, true)]
      : []),
  ],
})

export const Navigations: GlobalConfig = {
  slug: 'navigations',
  typescript: {
    interface: 'Navigations',
  },
  label: 'Menüs',
  admin: {
    group: 'Einstellungen',
  },
  access: {
    read: () => true,
    update: isLoggedIn,
  },
  fields: [
    createNavigationField('main', 'Hauptmenü', true),
    createNavigationField('footer', 'Fußmenü', false),
  ],
}

export default Navigations
