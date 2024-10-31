import type { MigrateUpArgs } from '@payloadcms/db-mongodb'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.collections.pages?.updateMany(
    {},
    { $unset: { layout: '', content_html: '' } },
    { strict: false },
  )
}

export async function down(): Promise<void> {
  // we won't bring back the fields
}
