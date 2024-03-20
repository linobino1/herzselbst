import type { Block } from "payload/types";

export const GoogleMaps: Block = {
  slug: "googleMaps",
  fields: [
    {
      name: "embedUrl",
      type: "text",
      label: "Google Maps Embed URL",
      admin: {
        description:
          'Find the Google Maps Embed URL by clicking the share button on the Google Maps page and selecting "Embed map". Copy the URL from the src attribute of the iframe tag.',
      },
    },
    {
      name: "placeholderImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "pagePrivacy",
      type: "relationship",
      relationTo: "pages",
      required: true,
    },
  ],
};

export default GoogleMaps;
