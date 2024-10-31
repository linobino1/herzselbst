import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb'
import type { Config } from '@/payload-types'

/**
 * save all docs with a url field to run the hooks
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Migration code
  await Promise.all(
    Object.values(payload.collections).map(async (collection) => {
      if ('addUrlField' in collection.config.custom) {
        const collectionSlug = collection.config.slug as keyof Config['collections']
        console.log(`Updating collection ${collectionSlug}`)
        // save all docs again with the url field
        const docs = (await payload.find({ collection: collectionSlug, limit: 9999999 })).docs
        await Promise.all(
          docs.map(async (doc) => {
            const data = await payload.findByID({
              collection: collectionSlug,
              id: doc.id,
            })
            if ('url' in data) delete data['url']
            const url = '' // this will trigger the beforeChange hook

            await payload.update({
              collection: collectionSlug,
              id: doc.id,
              data: {
                url,
              },
            })
          }),
        )
      }
    }),
  )
}

/**
 * unset the url field in all collection that use addUrlField
 */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await Promise.all(
    Object.values(payload.collections).map(async (collection) => {
      if ('addUrlField' in collection.config.custom) {
        const collectionSlug = collection.config.slug as keyof Config['collections']
        console.log(`Updating collection ${collectionSlug}`)

        // unset the url field
        await payload.db.collections[collectionSlug]?.updateMany({}, { $unset: { url: '' } })
      }
    }),
  )
}
