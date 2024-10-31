'use client'

import { Navigations } from '@/payload-types'
import { useRowLabel } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

const RowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<NonNullable<Navigations['main']>[number]>()
  const fallback = String(rowNumber).padStart(2, '0')

  if (!data) return fallback

  const [label, setLabel] = useState(fallback)

  useEffect(() => {
    if (data.type === 'external') {
      setLabel(data.label ?? data.url ?? fallback)
    } else if (data.doc?.value) {
      fetch(`/api/pages/${data.doc.value}`).then(async (res) => {
        setLabel(((await res.json()) as any).title)
      })
    } else if (data.category?.value) {
      fetch(`/api/categories/${data.category.value}`).then(async (res) => {
        setLabel(((await res.json()) as any).title)
      })
    }
  }, [data])

  return label
}

export default RowLabel
