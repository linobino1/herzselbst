import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-mongodb";

/**
 * pages.images -> pages.sidebar.images
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // await payload.db.collections.pages?.updateMany({}, [
  //   {
  //     $addFields: { "sidebar.images": "$images" },
  //   },
  //   {
  //     $unset: ["images"],
  //   },
  // ]);
  await payload.db.collections.pages?.updateMany(
    {},
    {
      $rename: { images: "sidebar.images" },
    },
    {
      strict: false,
    },
  );
}

/**
 * pages.sidebar.images -> pages.images
 */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // await payload.db.collections.pages?.updateMany(
  //   {},
  //   [
  //     {
  //       $addFields: { images: "$sidebar.images" },
  //     },
  //     {
  //       $unset: ["sidebar.images"],
  //     },
  //   ],
  //   {
  //     strict: false,
  //   },
  // );
  await payload.db.collections.pages?.updateMany(
    {},
    {
      $rename: { "sidebar.images": "images" },
    },
    {
      strict: false,
    },
  );
}
