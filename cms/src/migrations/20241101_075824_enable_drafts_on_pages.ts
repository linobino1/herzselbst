import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb'

/**
 * make all pages _status: published
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.update({
    collection: 'pages',
    where: {
      _status: {
        exists: false,
      },
    },
    data: {},
    draft: false,
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Migration code
}
