import type { GlobalConfig } from 'payload'
import { isLoggedIn } from '@/access/isLoggedIn'

export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Seitenkonfiguration',
  admin: {
    group: 'Einstellungen',
  },
  access: {
    read: () => true,
    update: isLoggedIn,
  },
  fields: [
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      required: true,
      relationTo: 'media',
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'phone',
          label: 'Telefon',
          type: 'text',
        },
        {
          name: 'email',
          label: 'E-Mail',
          type: 'text',
        },
      ],
    },
  ],
}

export default Site
