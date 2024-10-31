import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb'

// page.title is not localized anymore
// page.title.de -> page.title
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.collections.pages?.updateMany({}, [
    {
      $addFields: { title: '$title.de' },
    },
  ])
}

// page.title is localized again
// page.title -> page.title.de
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.collections.pages?.updateMany({}, [
    {
      $addFields: { 'title.de': '$title' },
    },
  ])
}
