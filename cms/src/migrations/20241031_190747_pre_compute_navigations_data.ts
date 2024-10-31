import { MigrateUpArgs } from '@payloadcms/db-mongodb'
import { CollectionSlug } from 'payload'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // save all docs with a url field to run the hooks
  const collections: CollectionSlug[] = ['pages', 'categories']
  await Promise.all(
    collections.map(async (collection) => {
      await Promise.all(
        (
          await payload.find({ collection, where: { id: { exists: true } }, limit: 9999999 })
        ).docs.map(async (doc) => {
          try {
            await payload.update({
              collection,
              id: doc.id,
              data: {},
            })
          } catch (error) {
            console.error('Error updating doc', doc.id, 'title' in doc ? doc.title : '')
            console.error(error)
          }
        }),
      )
    }),
  )
}

export async function down(): Promise<void> {
  // Migration code
}
