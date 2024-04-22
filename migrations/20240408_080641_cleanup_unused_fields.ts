import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-mongodb";

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // @ts-ignore
  await payload.db.collections.pages?.updateMany(
    {},
    { $unset: { layout: "", content_html: "" } },
    { strict: false },
  );
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // we won't bring back the fields
}
