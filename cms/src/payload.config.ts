import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import { de } from 'payload/i18n/de'
import path from 'path'
import Users from './collections/Users'
import Media from './collections/Media'
import Pages from './collections/Pages'
import Categories from './collections/Categories'
import { seoPlugin } from '@payloadcms/plugin-seo'
import Navigations from './globals/Navigations'
import Site from './globals/Site'
import {
  BlocksFeature,
  FixedToolbarFeature,
  LinkFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import Video from './blocks/Video'
import Publications from './blocks/Publications'
import Foldable from './blocks/Foldable'
import Button from './blocks/Button'
import Review from './blocks/Review'
import CTAColumns from './blocks/CTAColumns'
import Newsletter from './blocks/Newsletter'
import Gallery from './blocks/Gallery'
import GoogleMaps from './blocks/GoogleMaps'
import { linkAppendix } from './fields/linkAppendix'
import { fileURLToPath } from 'url'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { ZeptomailTransport } from 'nodemailer-zeptomail-transport'
import { createTransport } from 'nodemailer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  // content localization
  localization: {
    locales: ['de'],
    defaultLocale: 'de',
  },
  // admin panel localization
  i18n: {
    supportedLanguages: {
      de,
    },
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: '@',
    },
  },
  cors: {
    origins: [process.env.FRONTEND_URL ?? 'http://localhost:5173'],
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    disable: true,
  },
  // The email adapter is used to send password reset emails
  ...(process.env.ZEPTOMAIL_API_KEY
    ? {
        email: nodemailerAdapter({
          transport: createTransport(
            new ZeptomailTransport({
              apiKey: process.env.ZEPTOMAIL_API_KEY!,
              region: 'eu',
            }),
          ),
          defaultFromAddress: process.env.EMAIL_FROM_ADDRESS!,
          defaultFromName: process.env.EMAIL_FROM_NAME!,
        }),
      }
    : {}),
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      // we remove the ordered list feature because it makes entering dates in the editor difficult, as it automatically creates an ordered list if you type sth. like "22. [...]"
      ...defaultFeatures.filter((feature) => feature.key !== 'orderedList'),
      FixedToolbarFeature(),
      LinkFeature({
        enabledCollections: ['pages', 'media'],
        fields: [linkAppendix],
      }),
      BlocksFeature({
        blocks: [
          Button,
          CTAColumns,
          Foldable,
          Gallery,
          GoogleMaps,
          Publications,
          Review,
          Video,
          Newsletter,
        ],
      }),
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: 'caption',
                label: 'Caption',
                type: 'text',
              },
            ],
          },
        },
      }),
    ],
  }),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI ?? false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  collections: [Pages, Categories, Media, Users],
  globals: [Navigations, Site],
  plugins: [
    seoPlugin({
      globals: ['site'],
      uploadsCollection: 'media',
      fields: [
        {
          name: 'additionalMetaTags',
          label: 'Zusätzliche Meta-Tags',
          labels: {
            singular: 'Meta-Tag',
            plural: 'Meta-Tags',
          },
          type: 'array',
          fields: [
            {
              name: 'key',
              label: 'Key',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              label: 'Value',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    }),
    s3Storage({
      enabled: process.env.S3_ENABLED === 'true',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
        region: process.env.S3_REGION,
      },
      bucket: process.env.S3_BUCKET || '',
      collections: {
        media: {
          disablePayloadAccessControl: true, // serve files directly from S3
          generateFileURL: (file) => {
            return `${process.env.MEDIA_URL}/${file.filename}`
          },
        },
      },
    }),
  ],
})
