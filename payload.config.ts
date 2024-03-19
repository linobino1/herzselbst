import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { viteBundler } from "@payloadcms/bundler-vite";
import { buildConfig } from "payload/config";
import path from "path";
import Users from "./cms/collections/Users";
import Media from "./cms/collections/Media";
import Pages from "./cms/collections/Pages";
import Categories from "./cms/collections/Categories";
import seoPlugin from "@payloadcms/plugin-seo";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import Navigations from "./cms/globals/Navigations";
import Site from "./cms/globals/Site";
import addSlugField from "./cms/plugins/addSlugField";
import addUrlField from "./cms/plugins/addUrlField";
import {
  BlocksFeature,
  HTMLConverterFeature,
  LinkFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { HTMLConverterWithAlign } from "./cms/lexical/HTMLConverterWithAlign";
import { UploadHTMLConverter } from "./cms/lexical/UploadHTMLCOnverter";
import Video from "./cms/blocks/Video";
import Publications from "./cms/blocks/Publications";
import Foldable from "./cms/blocks/Foldable";

export default buildConfig({
  localization: {
    locales: ["de"],
    defaultLocale: "de",
  },
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
    vite: (incomingViteConfig) => ({
      ...incomingViteConfig,
      build: {
        ...incomingViteConfig.build,
        emptyOutDir: false,
      },
    }),
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      LinkFeature({
        enabledCollections: ["pages", "media"],
      }),
      BlocksFeature({
        blocks: [Video, Publications, Foldable],
      }),
      HTMLConverterFeature({
        // @ts-ignore
        converters: ({ defaultConverters }) => {
          return [
            HTMLConverterWithAlign,
            UploadHTMLConverter,
            ...defaultConverters,
          ];
        },
      }),
    ],
  }),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI ?? false,
    migrationDir: path.resolve(__dirname, "migrations"),
  }),
  collections: [Pages, Categories, Media, Users],
  globals: [Navigations, Site],
  typescript: {
    outputFile: path.resolve(__dirname, "cms/payload-types.ts"),
  },
  plugins: [
    addSlugField,
    addUrlField,
    seoPlugin({
      globals: ["site"],
      uploadsCollection: "media",
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
