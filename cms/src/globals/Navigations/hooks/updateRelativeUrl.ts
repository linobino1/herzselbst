import { CollectionSlug, FieldHook } from 'payload'

export const updateRelativeUrl: FieldHook = async ({
  siblingData: data,
  value,
  req: { payload },
}) => {
  let collection: CollectionSlug | undefined
  let id: string | undefined

  if (data?.type === 'internal') {
    collection = data.doc?.relationTo as CollectionSlug
    id = data.doc?.value as string
  }
  if (data?.type === 'subnavigation') {
    collection = data.category?.relationTo as CollectionSlug
    id = data.category?.value as string
  }
  if (collection && id) {
    const doc = await payload.findByID({
      collection,
      id,
      depth: 0,
    })

    // @ts-expect-error doc has a title property
    return doc?.url ?? value
  }

  return value
}
