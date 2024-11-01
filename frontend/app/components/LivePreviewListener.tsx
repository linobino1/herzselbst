import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRevalidator } from '@remix-run/react'
import React from 'react'
import { useEnv } from '~/util/useEnv'

export const LivePreviewListener: React.FC = () => {
  const env = useEnv()
  const revalidator = useRevalidator()
  const revalidate = () => {
    revalidator.revalidate()
  }
  return <PayloadLivePreview refresh={revalidate} serverURL={env?.BACKEND_URL ?? ''} />
}
