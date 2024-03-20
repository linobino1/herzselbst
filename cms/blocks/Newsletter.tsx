import type { Block } from "payload/types";

export const Newsletter: Block = {
  slug: "newsletter",
  labels: {
    singular: "Newsletter",
    plural: "Newsletter",
  },
  fields: [
    {
      name: "title",
      label: "Titel",
      type: "text",
      required: true,
    },
    {
      name: "mailchimpSignupUrl",
      label: "Mailchimp Anmelde-URL",
      type: "text",
      required: true,
      admin: {
        placeholder:
          "https://<YOUR-USER>.us16.list-manage.com/subscribe/post?u=XXXXXXXXXXXXX&amp;id=XXXXXX",
        description: () => (
          <a
            rel="noopener noreferrer"
            href="https://www.npmjs.com/package/react-mailchimp-form"
            target="_blank"
          >
            Anleitung
          </a>
        ),
      },
    },
    {
      name: "pagePrivacy",
      label: "Datenschutzseite",
      type: "relationship",
      relationTo: "pages",
      required: true,
    },
    {
      name: "images",
      label: "Bilder",
      labels: {
        singular: "Bild",
        plural: "Bilder",
      },
      type: "array",
      fields: [
        {
          name: "image",
          label: "Bild",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};

export default Newsletter;
