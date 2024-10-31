import type { Block } from 'payload'
import { link } from '@/fields/link'

export const Button: Block = {
  slug: 'button',
  fields: [link({}), { name: 'label', label: 'Beschriftung', type: 'text' }],
}

export default Button
