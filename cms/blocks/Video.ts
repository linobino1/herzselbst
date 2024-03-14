import type { Block } from "payload/types";

export const Video: Block = {
  slug: "video",
  fields: [
    {
      name: "url",
      type: "text",
      required: true,
    },
  ],
};

export default Video;
