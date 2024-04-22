import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig } from "payload/config";
import path from "path";
import Users from "./cms/collections/Users";
import Media from "./cms/collections/Media";
import Pages from "./cms/collections/Pages";
import Categories from "./cms/collections/Categories";
import { seo } from "@payloadcms/plugin-seo";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import Navigations from "./cms/globals/Navigations";
import Site from "./cms/globals/Site";
import {
  BlocksFeature,
  LinkFeature,
  UploadFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import Video from "./cms/blocks/Video";
import Publications from "./cms/blocks/Publications";
import Foldable from "./cms/blocks/Foldable";
import Button from "./cms/blocks/Button";
import Review from "./cms/blocks/Review";
import CTAColumns from "./cms/blocks/CTAColumns";
import Newsletter from "./cms/blocks/Newsletter";
import Gallery from "./cms/blocks/Gallery";
import GoogleMaps from "./cms/blocks/GoogleMaps";
import { linkAppendix } from "./cms/fields/linkAppendix";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // rateLimit: {
  //   window: 15 * 60 * 1000, // 15 minutes
  //   max: process.env.NODE_ENV === "development" ? 9999999 : 1000, // limit each IP to 1000 requests per windowMs
  // },
  secret: process.env.PAYLOAD_SECRET,
  localization: {
    locales: ["de"],
    defaultLocale: "de",
  },
  admin: {
    user: Users.slug,
  },
  editor: lexicalEditor({
    // @ts-ignore
    features: ({ defaultFeatures }) => [
      // we remove the ordered list feature because it makes entering dates in the editor difficult, as it automatically creates an ordered list if you type sth. like "22. [...]"
      ...defaultFeatures.filter((feature) => feature.key !== "orderedList"),
      LinkFeature({
        enabledCollections: ["pages", "media"],
        // @ts-ignore
        fields: [linkAppendix],
      }),
      BlocksFeature({
        blocks: [
          // @ts-ignore
          Button,
          // @ts-ignore
          CTAColumns,
          // @ts-ignore
          Foldable,
          // @ts-ignore
          Gallery,
          // @ts-ignore
          GoogleMaps,
          // @ts-ignore
          Publications,
          // @ts-ignore
          Review,
          // @ts-ignore
          Video,
          // @ts-ignore
          Newsletter,
        ],
      }),
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: "caption",
                label: "Caption",
                type: "text",
              },
            ],
          },
        },
      }),
    ],
  }),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI ?? false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  collections: [Pages, Categories, Media, Users],
  globals: [Navigations, Site],
  typescript: {
    outputFile: path.resolve(dirname, "cms/payload-types.ts"),
  },
  plugins: [
    seo({
      globals: ["site"],
      uploadsCollection: "media",
      fields: [
        {
          name: "additionalMetaTags",
          label: "Zusätzliche Meta-Tags",
          labels: {
            singular: "Meta-Tag",
            plural: "Meta-Tags",
          },
          type: "array",
          fields: [
            {
              name: "key",
              label: "Key",
              type: "text",
              required: true,
            },
            {
              name: "value",
              label: "Value",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    }),
    cloudStorage({
      enabled: process.env.S3_ENABLED === "true",
      collections: {
        media: {
          disablePayloadAccessControl: true, // serve files directly from S3
          generateFileURL: (file) => {
            return `${process.env.MEDIA_URL}/${file.filename}`;
          },
          adapter: s3Adapter({
            bucket: process.env.S3_BUCKET || "",
            config: {
              endpoint: process.env.S3_ENDPOINT || undefined,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY || "",
                secretAccessKey: process.env.S3_SECRET_KEY || "",
              },
              region: process.env.S3_REGION || "",
            },
          }),
        },
      },
    }),
  ],
});
