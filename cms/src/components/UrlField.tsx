'use client'

import { TextFieldClientComponent } from 'payload'
import { FieldLabel, useField } from '@payloadcms/ui'
import { env } from '@/util/env'

const UrlField: TextFieldClientComponent = ({ field }) => {
  const { value: relativeUrl } = useField({})
  const absoluteUrl = `${env.FRONTEND_URL}${relativeUrl}`
  return typeof relativeUrl === 'string' ? (
    <div>
      <FieldLabel field={field} />
      <a
        href={absoluteUrl}
        target="_blank"
        rel="noreferrer"
        style={{ marginBlock: '0.5rem' }}
        className="mb-2 inline-block"
      >
        {relativeUrl}
      </a>
    </div>
  ) : null
}

export default UrlField
