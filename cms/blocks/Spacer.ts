import type { Block } from "payload/types";
import { createSizeField } from "../fields/size";

export const Spacer: Block = {
  slug: "spacer",
  labels: {
    singular: "Abstand",
    plural: "Abstände",
  },
  fields: [createSizeField("small")],
};

export default Spacer;
