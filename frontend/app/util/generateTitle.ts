import type { Site } from '@/payload-types'

export default function generateTitle(site: Site, doc: any) {
  let docTitle = doc?.slug !== 'home' ? doc?.title : null
  return [docTitle, site?.meta?.title].filter(Boolean).join(' · ')
}
